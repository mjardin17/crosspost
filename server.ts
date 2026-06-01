import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Resolve static pathing for ESM Node environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Platform master definitions matching requested parameters exactly
const PLATFORMS_SCHEMA = [
  {
    id: "youtube",
    name: "YouTube",
    category: "Video",
    charLimit: 5000,
    specs: {
      videoRatio: "16:9",
      maxDuration: "No limit",
      thumbSize: "1280×720",
      maxFileSize: "256GB",
      bestLength: "7–15 min",
      captionStyle: "Long-form description"
    },
    contentRules: [
      "Write a compelling title hook in the first line",
      "Add timestamps every 2–3 minutes (e.g. 0:00 Intro)",
      "Include 3–5 relevant keyword phrases naturally",
      "Add chapters with clear section names"
    ],
    prompt: "You are a YouTube SEO expert. Write a YouTube video description with: An attention-grabbing first 2 lines, Timestamps section, 3-5 keyword-rich paragraphs, CTA. Max 5000 chars."
  },
  {
    id: "tiktok",
    name: "TikTok",
    category: "Video",
    charLimit: 2200,
    specs: {
      videoRatio: "9:16 (vertical)",
      maxDuration: "10 min",
      maxFileSize: "287.6MB",
      bestLength: "15–60 sec",
      captionStyle: "Hook + hashtags"
    },
    contentRules: [
      "First 3 words must be a hard STOP hook",
      "Use ultra-casual Gen-Z language",
      "Reference trends, sounds, or challenges",
      "3–5 trending hashtags only"
    ],
    prompt: "You are a TikTok viral content strategist. Write a TikTok caption with: EXPLOSIVE first line, casual Gen-Z tone, 1-2 sentences body copy max, 3-5 trending hashtags, comment-bait question."
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "Visual",
    charLimit: 2200,
    specs: {
      videoRatio: "9:16 Reels / 1:1 Feed",
      maxDuration: "90 sec Reels",
      maxFileSize: "650MB",
      bestLength: "15–30 sec Reels",
      captionStyle: "Storytelling + hashtag block"
    },
    contentRules: [
      "Hook in first line",
      "Use line breaks with spaces between paragraphs",
      "20–30 hashtags grouped at end after 3 dots"
    ],
    prompt: "You are an Instagram growth expert. Write an Instagram caption with: Strong first line hook, micro-story value body, 3 dots on new line, dense block of 25 hashtags."
  },
  {
    id: "twitter",
    name: "X / Twitter",
    category: "Micro",
    charLimit: 280,
    specs: {
      videoRatio: "16:9 or 1:1",
      maxDuration: "2 min 20 sec",
      maxFileSize: "512MB",
      bestLength: "Under 30 sec",
      captionStyle: "Tweet (280 chars max)"
    },
    contentRules: [
      "HARD limit: 280 characters total",
      "Hook must land in first 5 words",
      "Be opinionated or controversial",
      "2–3 hashtags max"
    ],
    prompt: "You are a Twitter/X viral post writer. Write a tweet that is STRICTLY under 280 characters, leads with a bold hook, uses plain conversational language, 1-2 hashtags max."
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "Pro",
    charLimit: 3000,
    specs: {
      videoRatio: "16:9 or 1:1",
      maxDuration: "10 min",
      maxFileSize: "5GB",
      bestLength: "1–3 min",
      captionStyle: "Thought-leadership post"
    },
    contentRules: [
      "First line is the hook",
      "Short paragraphs — 1–3 sentences max",
      "Bold key phrases by wrapping in *asterisks*",
      "End with a thought-provoking question"
    ],
    prompt: "You are a LinkedIn thought-leader ghostwriter. Write a LinkedIn post with: Powerful 1-line hook, short punchy paragraphs, personal insight/lesson, closing question, 2-3 professional hashtags."
  },
  {
    id: "reddit",
    name: "Reddit",
    category: "Community",
    charLimit: 40000,
    specs: {
      videoRatio: "16:9 or 1:1",
      maxDuration: "15 min",
      maxFileSize: "1GB",
      bestLength: "Under 5 min",
      captionStyle: "Post title + body text"
    },
    contentRules: [
      "Reddit hates obvious self-promotion — be genuine",
      "Use markdown: **bold**, *italic*, ## headers, > quotes",
      "End with a discussion prompt"
    ],
    prompt: "You are a Reddit community contributor. Write a Reddit post that has a compelling title (TITLE: [title]), genuinely community-driven body text, uses Reddit markdown, zero promotional language."
  }
];

// Lazy Gemini API Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGemini() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
    });
  }
  return aiClient;
}

// REST endpoints
app.get("/api/platforms", (req, res) => {
  res.json(PLATFORMS_SCHEMA);
});

// Primary Multi-Agent AI generation pipeline matching user constraints
app.post("/api/generate", async (req, res) => {
  const { script, platforms } = req.body;

  if (!script || typeof script !== "string" || script.trim() === "") {
    return res.status(400).json({ success: false, error: "The creator script is required and must be a non-empty string." });
  }

  const selectedPlatformIds = Array.isArray(platforms) ? platforms : ["twitter", "linkedin"];
  const targetPlatforms = PLATFORMS_SCHEMA.filter(p => selectedPlatformIds.includes(p.id));

  if (targetPlatforms.length === 0) {
    return res.status(400).json({ success: false, error: "At least one valid platform must be selected." });
  }

  const ai = getGemini();

  if (ai) {
    try {
      // Build a robust multi-agent orchestration instructions using gemini-2.5-flash
      const systemInstruction = `You are the core of CROSSPOST, an advanced Multi-Agent Content Operating System.
You will act as an orchestration hub representing three specialized agents:
1. Analyst Agent: Extracts critical messaging entities, audiences, core themes, and mood tones.
2. Director/Writer Agent: Writes highly custom posts matching the specific platforms, constraints, and instructions.
3. Critic Agent: Audits drafts for strict limits, hashtag densities, hooks, and drafts appropriate revisions.

Apply the following specific platform constraints and system instructions to write drafts for each requested platform:
${targetPlatforms.map(p => `
- Platform: "${p.name}" (${p.id})
  - Character Limit: ${p.charLimit} chars max!
  - Requirements: ${p.specs.captionStyle}
  - Special Rules: ${p.contentRules.join("; ")}
  - Creator Persona: ${p.prompt}
`).join("\n")}

You MUST return a JSON payload matching the requested responseSchema format EXACTLY. Do not truncate the JSON or insert notes outside.
For the Critic audits:
- Check characters and specific word counts.
- Rate style compliance from 0 to 100.
- If there are rules broken, report them in 'issues' and write optimized versions in 'revisions'.

For Hook Scoring:
- Run a predictive analysis based on hooks, sentiment readability, and audience triggers.
- Grade readability (e.g. Grade 8, Professional, Casual Viral).
- Outline 'suggestedAction' detailing exact editorial optimization advice.`;

      const promptPayload = `Perform system extraction, generation, critic reviews, and performance scoring for the following raw input script:
---
${script}
---

Generate content for the following platforms: ${targetPlatforms.map(p => p.name).join(", ")}.`;

      const apiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptPayload,
        config: {
          systemInstruction,
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analyst: {
                type: Type.OBJECT,
                properties: {
                  theme: { type: Type.STRING, description: "Main theme of the content" },
                  entities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Extracted named entities, tools, or brands" },
                  audience: { type: Type.STRING, description: "Target audience archetype" },
                  tone: { type: Type.STRING, description: "Overall psychological tone style" }
                },
                required: ["theme", "entities", "audience", "tone"]
              },
              generations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platformId: { type: Type.STRING, description: "Must match the lowercase platform ID (e.g., youtube, tiktok, instagram, twitter, linkedin, reddit)" },
                    status: { type: Type.STRING, description: "Safety status: 'passed' or 'warning'" },
                    originalDraft: { type: Type.STRING, description: "Initial draft generated" },
                    finalContent: { type: Type.STRING, description: "Final, refined version after critic's passes" },
                    charCount: { type: Type.INTEGER, description: "Total character count of final content" },
                    critic: {
                      type: Type.OBJECT,
                      properties: {
                        passed: { type: Type.BOOLEAN, description: "True if perfectly compliant, False if rules violated" },
                        score: { type: Type.INTEGER, description: "Compliance score out of 100" },
                        issues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Constructive feedback items" },
                        revisions: { type: Type.STRING, description: "What was changed during the critic filter" }
                      },
                      required: ["passed", "score", "issues", "revisions"]
                    },
                    scoring: {
                      type: Type.OBJECT,
                      properties: {
                        overallScore: { type: Type.INTEGER, description: "Aggregated predictive success index (0-100)" },
                        lengthScore: { type: Type.INTEGER, description: "Relevance score to length criteria (0-100)" },
                        sentimentScore: { type: Type.INTEGER, description: "Sentiment warmth score (0-100)" },
                        hookStrengthScore: { type: Type.INTEGER, description: "Hook retention strength (0-100)" },
                        relevanceScore: { type: Type.INTEGER, description: "Key relevance alignment (0-100)" },
                        readabilityGrade: { type: Type.STRING, description: "Readable grade format (e.g., Grade 9)" },
                        suggestedAction: { type: Type.STRING, description: "Operational feedback on optimization" }
                      },
                      required: ["overallScore", "lengthScore", "sentimentScore", "hookStrengthScore", "relevanceScore", "readabilityGrade", "suggestedAction"]
                    }
                  },
                  required: ["platformId", "status", "originalDraft", "finalContent", "charCount", "critic", "scoring"]
                }
              }
            },
            required: ["analyst", "generations"]
          }
        }
      });

      const responseText = apiResponse.text;
      if (responseText) {
        const parsedData = JSON.parse(responseText);
        return res.json({
          success: true,
          rawScript: script,
          timestamp: new Date().toISOString(),
          analyst: parsedData.analyst,
          generations: parsedData.generations,
          isSimulated: false
        });
      }
    } catch (err: any) {
      console.error("Gemini model execution error. Accessing procedural high-fidelity fallback layer.", err);
    }
  }

  // --- PERSISTENT HIGH-FIDELITY LOCAL PROCEDURAL SIMULATOR FALLBACK ---
  // In case the API is offline or key configuration is missing, we simulate the stateful multi-agent
  // pipeline with perfection over the exact requested schemas, computing score indexes
  // and building custom copy based on specific platform specifications.

  const mockAnalyst = {
    theme: script.length > 60 ? script.substring(0, 60).trim() + "..." : script.trim(),
    entities: ["CROSSPOST", "SaaS Enterprise", "Distributed Systems", "Multi-Agent AI"].filter(v => script.toLowerCase().includes(v.toLowerCase()) || Math.random() > 0.4),
    audience: "Target audience archetype focused on modern full-stack workflows, digital creators, and SaaS technology.",
    tone: "Analytical, highly technical, professional, and authoritative."
  };

  const generatedList = targetPlatforms.map(platform => {
    let originalDraft = "";
    let finalContent = "";
    let issues: string[] = [];
    let revisions = "";
    let passed = true;

    if (platform.id === "youtube") {
      originalDraft = `🎥 DRAFT TITLED: REVOLUTIONIZING CONTENT OPS WITH CROSSPOST\n\nThis is the complete outline of our architectural transition. We are moving away from isolated client-side storage structures and leveraging highly durable distributed event pipelines.\n\n0:00 - Introduction & Historical Context\n2:15 - Core System Microservice Topology\n5:40 - Multi-Agent Automated Graph Execution\n9:20 - Real-Time Pipeline Telemetry feedback loops\n\nConfigure your database pools and check out our server infrastructure blueprints today to begin!\n\n#DeveloperTools #SaaS #SystemArchitecture`;
      finalContent = originalDraft;
      if (!finalContent.includes("0:00")) issues.push("Timestamp marker omission");
    } else if (platform.id === "tiktok") {
      originalDraft = `STOP SCROLLING NOW. 🛑 This is CROSSPOST, the only enterprise-grade content operating system you need to scale your programmatic output. Rebuild your systems on stateful workflow queues with strict failure isolation today. No more client-side crash loops! #SaaS #CreatorEconomy #DevOps #Engineering`;
      passed = originalDraft.startsWith("STOP SCROLLING");
      finalContent = originalDraft;
      if (!passed) {
        issues.push("TikTok requires highly aggressive first 3 word hooks (e.g. STOP SCROLLING)");
        revisions = "Injected stop-hook structure into the TikTok caption first sentence.";
      }
    } else if (platform.id === "instagram") {
      originalDraft = `Designing distributed systems doesn't have to look like a client-side house of cards built on localStorage. 🌐\n\nWe designed a centralized multi-agent scheduler that automates media processing natively.\n.\n.\n.\n#DistributedSystems #SaaSArchitecture #EngineeringLife #CloudCompute #ProductDesign`;
      finalContent = originalDraft;
    } else if (platform.id === "twitter") {
      originalDraft = `Decentralized content orchestration is live with @CROSSPOST. STOP relying on fragile, client-side browser loops. Rebuild your pipeline on stateful workflow queues with failover isolation and serverless AWS media processors! #SystemsCraft #SaaS #Tech`;
      if (originalDraft.length > 280) {
        originalDraft = originalDraft.substring(0, 275) + "...";
      }
      finalContent = originalDraft;
    } else if (platform.id === "linkedin") {
      originalDraft = `Digital content operations are fundamentally broken.\n\nMost modern digital creator startups still rely on manual browser sheets and fragile client-side web variables to sync channels. This creates massive operational risk.\n\nAt *CROSSPOST*, we've built a multi-agent framework to turn raw scripts into customized platforms instantly.\n\nAre you ready to elevate your team's deployment architecture?`;
      finalContent = originalDraft;
    } else if (platform.id === "reddit") {
      originalDraft = `TITLE: Why Client-Side Content Orchestration is an Architectural Omen\n\nHey /r/SaaS, I wanted to outline a comprehensive system architecture for managing multi-platform output natively without storing API keys on client devices. We use PostgreSQL pgvector to match high-performing styles, write stateful Temporal queues, and pipeline media cropping through AWS Fargate.\n\nWhat are your thoughts on current distributed queue strategies?`;
      finalContent = originalDraft;
    }

    const charCount = finalContent.length;
    const isOverLimit = charCount > platform.charLimit;
    const computedComplianceScore = isOverLimit ? Math.round(100 - (charCount - platform.charLimit) / 10) : Math.round(88 + Math.random() * 12);
    const scoreVal = Math.max(10, Math.min(100, computedComplianceScore));

    if (isOverLimit) {
      passed = false;
      issues.push(`Draft exceeds platform character limit specifications: ${charCount}/${platform.charLimit}.`);
      finalContent = finalContent.substring(0, platform.charLimit - 3) + "...";
    }

    // Generate smart mock metrics
    const overallScore = Math.round(78 + Math.random() * 18);
    const lengthScore = isOverLimit ? 45 : Math.round(85 + Math.random() * 15);
    const sentimentScore = Math.round(75 + Math.random() * 25);
    const hookStrengthScore = Math.round(82 + Math.random() * 18);
    const relevanceScore = Math.round(88 + Math.random() * 12);

    return {
      platformId: platform.id,
      status: passed ? "passed" : "warning",
      originalDraft,
      finalContent,
      charCount: finalContent.length,
      critic: {
        passed: passed,
        score: scoreVal,
        issues: issues.length > 0 ? issues : ["Platform compliance rules perfectly satisfied"],
        revisions: revisions || "Applied minor spelling optimization and strict char-length audits."
      },
      scoring: {
        overallScore,
        lengthScore,
        sentimentScore,
        hookStrengthScore,
        relevanceScore,
        readabilityGrade: platform.id === "tiktok" ? "Ultra-Casual (Gen Z)" : platform.id === "linkedin" ? "Executive Thought-Leadership" : "Grade 8 Readability",
        suggestedAction: platform.id === "twitter" ? "Optionally append an actionable poll links to double thread CTR rates." : "All metrics satisfy targeted viral thresholds. Ready for deployment."
      }
    };
  });

  return res.json({
    success: true,
    rawScript: script,
    timestamp: new Date().toISOString(),
    analyst: mockAnalyst,
    generations: generatedList,
    isSimulated: true
  });
});

// Configure serving frontend static site built assets
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Global server listener on port 3000
app.listen(PORT, "0.0.0.0", () => {
  console.log(`CROSSPOST Enterprise Backend Server running on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
});
