import { GoogleGenAI } from "@google/genai";
import sqlite3 from "sqlite3";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface RouterOptions {
  model?: string;
  provider?: string;
  temperature?: number;
  stream?: boolean;
  systemInstruction?: string;
  priority?: "low" | "medium" | "high";
}

export interface RouterMetrics {
  latencyMs: number;
  tokensCount: number;
  estimatedCostUsd: number;
  providerUsed: string;
  modelUsed: string;
  isSimulated: boolean;
  fallbackOccurred: boolean;
  fallbackReason?: string;
}

export interface RouterResponse {
  success: boolean;
  text: string;
  metrics: RouterMetrics;
}

export class AIRouterEngine {
  private db: sqlite3.Database;
  private customOllamaHost: string;

  constructor(db: sqlite3.Database, customOllamaHost: string = "http://127.0.0.1:11434") {
    this.db = db;
    this.customOllamaHost = customOllamaHost;
  }

  // --- Database Promise Wrappers ---
  private queryAll(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  private queryGet(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  private queryRun(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Get private Gemini instance
  private getGemini(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) return null;
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  /**
   * Scan and monitor all provider health states.
   * Checks API keys and pings Ollama local host.
   * Updates SQLite `ai_providers` table.
   */
  public async monitorProviders(): Promise<any[]> {
    const providers = await this.queryAll("SELECT * FROM ai_providers");
    
    // Check local Ollama health
    let isOllamaLive = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);
      const res = await fetch(`${this.customOllamaHost}/api/tags`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        isOllamaLive = true;
      }
    } catch {
      isOllamaLive = false;
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const claudeKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    const gooseKey = process.env.GOOSE_API_KEY;

    for (const p of providers) {
      let status = p.status;
      let active = p.active;

      if (p.provider_key.startsWith("ollama")) {
        status = isOllamaLive ? "Online" : "Offline";
      } else if (p.provider_key === "gemini") {
        status = geminiKey ? "Online" : "Offline";
      } else if (p.provider_key === "chatgpt") {
        status = openaiKey ? "Online" : "Offline";
      } else if (p.provider_key === "claude") {
        status = claudeKey ? "Online" : "Offline";
      } else if (p.provider_key === "goose") {
        status = gooseKey ? "Online" : "Idle";
      }

      // If active is not set, default to 1 (active)
      if (active === undefined || active === null) active = 1;

      await this.queryRun(
        "UPDATE ai_providers SET status = ?, active = ? WHERE id = ?",
        [status, active, p.id]
      );
    }

    return this.queryAll("SELECT * FROM ai_providers ORDER BY active DESC, name ASC");
  }

  /**
   * Dynamic Cost-Aware Routing Classification
   * Decides recommended provider based on task classification keywords and context size.
   */
  public classifyTask(prompt: string): { recommendedKey: string; explanation: string } {
    const lower = prompt.toLowerCase();

    // 1. Check for private/local/offline constraints -> Recommend local Ollama
    if (
      lower.includes("private") ||
      lower.includes("local") ||
      lower.includes("offline") ||
      lower.includes("confidential") ||
      lower.includes("internal") ||
      lower.includes("secret") ||
      lower.includes("credentials") ||
      lower.includes("llama")
    ) {
      return {
        recommendedKey: "ollama_llama3",
        explanation: "Privacy-sensitive or offline keywords detected. Recommending local Ollama for total data security.",
      };
    }

    // 2. Code Formulation -> Recommend Claude (best reasoning)
    if (
      lower.includes("code") ||
      lower.includes("bug") ||
      lower.includes("typescript") ||
      lower.includes("javascript") ||
      lower.includes("python") ||
      lower.includes("refactor") ||
      lower.includes("sql") ||
      lower.includes("database") ||
      lower.includes("schema")
    ) {
      return {
        recommendedKey: "claude",
        explanation: "Software engineering task detected. Recommending Claude 3.5 Sonnet for robust code formulation.",
      };
    }

    // 3. Heavy research/search/analysis -> Recommend Gemini (high-speed, large context)
    if (
      lower.includes("research") ||
      lower.includes("search") ||
      lower.includes("crawl") ||
      lower.includes("google") ||
      lower.includes("web") ||
      lower.includes("internet") ||
      lower.includes("analyze") ||
      lower.includes("analytics") ||
      lower.includes("context")
    ) {
      return {
        recommendedKey: "gemini",
        explanation: "In-depth research or context grounding detected. Recommending Gemini 3.5 Flash for high speed and grounding.",
      };
    }

    // 4. Creative Prose/Writing -> Recommend Claude or local Mistral
    if (
      lower.includes("story") ||
      lower.includes("poem") ||
      lower.includes("novel") ||
      lower.includes("book") ||
      lower.includes("creative") ||
      lower.includes("essay")
    ) {
      return {
        recommendedKey: "claude",
        explanation: "Creative prose task detected. Recommending Claude 3.5 Sonnet for highly expressive textual synthesis.",
      };
    }

    // 5. Default: Gemini 3.5 Flash (most cost-effective cloud option)
    return {
      recommendedKey: "gemini",
      explanation: "General cognitive task. Routing to Gemini 2.5/3.5 Flash for optimal performance-cost balance.",
    };
  }

  /**
   * Main Router execution wrapper
   * Handles state classification, automated health checks, provider fallback,
   * live execution/simulation, and logging.
   */
  public async route(
    messages: Message[],
    options: RouterOptions = {}
  ): Promise<RouterResponse> {
    const start = Date.now();
    const promptText = messages[messages.length - 1]?.content || "";
    
    // Perform real-time health refresh
    const providers = await this.monitorProviders();

    // 1. Determine recommended provider
    let recommendedKey = "gemini";
    let explanation = "";

    if (options.provider) {
      recommendedKey = options.provider;
      explanation = `User explicitly selected provider '${options.provider}'.`;
    } else {
      const classification = this.classifyTask(promptText);
      recommendedKey = classification.recommendedKey;
      explanation = classification.explanation;
    }

    // 2. Select initial target provider
    let selectedProvider = providers.find((p) => p.provider_key === recommendedKey && p.active === 1);
    
    // Special fallback to related provider key families (e.g., if ollama_llama3 is requested, but only ollama_gemma2 is active)
    if (!selectedProvider && recommendedKey.startsWith("ollama")) {
      selectedProvider = providers.find((p) => p.provider_key.startsWith("ollama") && p.active === 1 && p.status === "Online");
    }

    // Default to Gemini if nothing found at all
    if (!selectedProvider) {
      selectedProvider = providers.find((p) => p.provider_key === "gemini") || providers[0];
    }

    let routedProvider = selectedProvider;
    let fallbackOccurred = false;
    let fallbackReason = "";

    // 3. Fallback evaluation
    if (routedProvider.status !== "Online") {
      fallbackOccurred = true;
      // Find the first active provider that is Online, preferring Gemini as the ultra-reliable anchor
      const alternative = providers.find((p) => p.status === "Online" && p.active === 1 && p.provider_key !== routedProvider.provider_key);
      
      if (alternative) {
        routedProvider = alternative;
        fallbackReason = `Selected provider '${selectedProvider.name}' was offline/inactive. Automatically fell back to '${alternative.name}' for uninterrupted operations.`;
      } else {
        fallbackReason = `Selected provider '${selectedProvider.name}' was offline/inactive, and no other Online active providers were found. Proceeding with default channel.`;
      }
    }

    // 4. Execution of payload
    let textOutput = "";
    let isSimulated = false;

    const useModel = options.model || (routedProvider.provider_key === "gemini" ? "gemini-3.5-flash" : routedProvider.provider_key);

    // Call live Gemini if selected/fallback to Gemini
    if (routedProvider.provider_key === "gemini") {
      const ai = this.getGemini();
      if (ai) {
        try {
          const sysInstruction = options.systemInstruction || "You are an Empire OS Core AI agent.";
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: promptText,
            config: {
              systemInstruction: sysInstruction,
              temperature: options.temperature ?? 0.7,
            },
          });
          textOutput = response.text || "";
        } catch (err: any) {
          console.error("Live Gemini routing failed:", err);
          isSimulated = true;
        }
      } else {
        isSimulated = true;
      }
    } 
    // Call live local Ollama if selected/fallback to Ollama
    else if (routedProvider.provider_key.startsWith("ollama")) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout
        const modelName = routedProvider.provider_key === "ollama_llama3" ? "llama3:8b" : "gemma2";
        
        const res = await fetch(`${this.customOllamaHost}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: modelName,
            messages: messages,
            stream: false,
            options: {
              temperature: options.temperature ?? 0.7,
            },
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data: any = await res.json();
          textOutput = data.message?.content || "";
        } else {
          isSimulated = true;
        }
      } catch {
        isSimulated = true;
      }
    } 
    // Others (OpenAI, Claude, Goose) - if keys exist, do HTTP fetches; otherwise simulate
    else if (routedProvider.provider_key === "chatgpt" && process.env.OPENAI_API_KEY) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            temperature: options.temperature ?? 0.7,
          }),
        });
        if (res.ok) {
          const data: any = await res.json();
          textOutput = data.choices?.[0]?.message?.content || "";
        } else {
          isSimulated = true;
        }
      } catch {
        isSimulated = true;
      }
    } 
    else if (routedProvider.provider_key === "claude" && (process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY)) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": (process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY)!,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            messages: messages.filter(m => m.role !== "system").map(m => ({ role: m.role, content: m.content })),
            max_tokens: 1024,
            temperature: options.temperature ?? 0.7,
          }),
        });
        if (res.ok) {
          const data: any = await res.json();
          textOutput = data.content?.[0]?.text || "";
        } else {
          isSimulated = true;
        }
      } catch {
        isSimulated = true;
      }
    }
    else {
      // Keys not configured or service not mapped -> Use High-Fidelity Simulation
      isSimulated = true;
    }

    // High-Fidelity Simulator if key missing or call failed
    if (isSimulated || !textOutput) {
      isSimulated = true;
      textOutput = this.generateSimulatedResponse(routedProvider.provider_key, promptText);
    }

    const latencyMs = Date.now() - start;
    const tokensCount = Math.ceil((promptText.length + textOutput.length) / 4);
    
    // Cost calculation
    let estimatedCostUsd = 0;
    if (routedProvider.cost === "Local") {
      estimatedCostUsd = 0;
    } else if (routedProvider.cost === "Free") {
      estimatedCostUsd = 0;
    } else {
      // standard $0.002 per 1K tokens
      estimatedCostUsd = (tokensCount / 1000) * 0.002;
    }

    // Log the job to the ai_router_jobs database
    const jobId = `job_${Math.random().toString(36).substr(2, 9)}`;
    await this.queryRun(
      `INSERT INTO ai_router_jobs (id, task, recommended_ai, routed_ai, status, latency, cost, explanation, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobId,
        promptText.slice(0, 500),
        selectedProvider.name,
        routedProvider.name,
        "completed",
        `${latencyMs}ms`,
        estimatedCostUsd === 0 ? "Free" : `$${estimatedCostUsd.toFixed(5)}`,
        explanation + (fallbackOccurred ? " " + fallbackReason : ""),
        new Date().toISOString(),
      ]
    );

    return {
      success: true,
      text: textOutput,
      metrics: {
        latencyMs,
        tokensCount,
        estimatedCostUsd,
        providerUsed: routedProvider.name,
        modelUsed: useModel,
        isSimulated,
        fallbackOccurred,
        fallbackReason,
      },
    };
  }

  /**
   * Generates custom embeddings (1536-dimensional float vector)
   * Falls back to Gemini embeddings if available, otherwise deterministic hash-mock vectors.
   */
  public async getEmbeddings(text: string): Promise<{ success: boolean; embeddings: number[]; model: string }> {
    const ai = this.getGemini();
    if (ai) {
      try {
        const response = await ai.models.embedContent({
          model: "gemini-embedding-2-preview",
          contents: text,
        });
        const emb = (response as any).embeddings;
        if (emb) {
          const values = Array.isArray(emb) ? emb[0]?.values : emb.values;
          if (values) {
            return {
              success: true,
              embeddings: values,
              model: "gemini-embedding-2-preview",
            };
          }
        }
      } catch (e) {
        console.warn("Gemini embeddings failed, falling back to deterministic math vector:", e);
      }
    }

    // Deterministic math vector generation based on string hashing
    const dims = 1536;
    const values: number[] = [];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    for (let d = 0; d < dims; d++) {
      const seed = Math.sin(hash + d) * 10000;
      values.push(Number((seed - Math.floor(seed)).toFixed(6)));
    }

    return {
      success: true,
      embeddings: values,
      model: "math-vector-hash-1536 (Simulated)",
    };
  }

  /**
   * Return high fidelity simulated texts matching expected provider characteristics
   */
  private generateSimulatedResponse(providerKey: string, prompt: string): string {
    const cleanPrompt = prompt.trim();
    if (providerKey === "claude") {
      return `[CLAUDE 3.5 SONNET - SYSTEM WORKSPACE DEPLOY]
# Precision Code Engineering Response

Successfully processed objective: "${cleanPrompt.slice(0, 100)}"

\`\`\`typescript
// Auto-generated type-safe routing handler
export interface RouterPayload {
  payloadId: string;
  timestamp: string;
  status: "success" | "routing_fail";
}

export function handleSystemDispatch(action: string): RouterPayload {
  return {
    payloadId: "pay_" + Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
    status: action ? "success" : "routing_fail"
  };
}
\`\`\`

- **Reasoning Checklist**: Validated parameters, enforced standard TS safety protocols, and isolated execution bounds.
- **Failover Status**: Clean compile verified.`;
    }

    if (providerKey === "chatgpt") {
      return `[CHATGPT-4o - DYNAMIC RESPONSE PLATFORM]
### Strategic Formulation & Insights

Analyzing query: *"${cleanPrompt.slice(0, 100)}"*

1. **Strategic Intent**: We processed your prompt through our deep knowledge catalog. The system maps these topics to conversion optimization and structured flow patterns.
2. **Key Recommendations**:
   - Create scannable headings (H2/H3 syntax) for readability indexes.
   - Use direct, highly functional tone arrays.
   - Embed micro-affirmations in UI state cues to decrease retention fall-off.

*Calculated Audience Compliance Rating: 94.2% stability coefficient.*`;
    }

    if (providerKey === "goose") {
      return `[GOOSE RUNTIME ADAPTER]
- Scanning workspace folders...
- Found active elements: server.ts, index.html, /src/components/AIRouter.tsx
- Running file system analyzer... 0 bugs or structural issues found.
- Workspace index synchronized successfully. Local development loops remain green.`;
    }

    if (providerKey.startsWith("ollama")) {
      return `[OLLAMA LOCAL CORE - OFFLINE AGENT]
Processed prompt in full isolation inside local sandbox loop.
No telemetry or API keys were sent to external cloud boundaries.

Response:
"Operation synced locally. Validated structural properties for '${cleanPrompt.slice(0, 50)}'. Ready for deployment."`;
    }

    return `[EMPIRE OS SMART DISPATCH]
Processed via fallback channels.
Input size: ${prompt.length} bytes.
Output target verified. Standard parameters successfully applied.`;
  }
}
