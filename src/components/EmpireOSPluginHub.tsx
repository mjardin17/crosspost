import React, { useState, useEffect, useRef } from "react";
import { 
  Server, Cpu, Database, Brain, Play, RefreshCw, Send, Terminal, 
  CheckCircle, AlertTriangle, ShieldAlert, Zap, Activity, Info, 
  Globe, Code, ChevronRight, Share2, CornerDownRight, CheckCircle2,
  BookOpen, Sliders, Search, Trash2, Plus, SlidersHorizontal, Tag,
  FileText, Sparkles, User, Image, Video, Volume2, Award, Eye, Download,
  Check, ArrowRight, ToggleLeft, ToggleRight, HelpCircle
} from "lucide-react";

interface EndpointInfo {
  method: string;
  path: string;
  description: string;
}

interface PluginMetadata {
  success: boolean;
  pluginId: string;
  name: string;
  version: string;
  status: string;
  developer: string;
  architecture: {
    framework: string;
    hostPort: number;
    protocol: string;
  };
  capabilities: string[];
  dependencies: {
    aiEngine: string;
    executionRuntime: string;
    styling: string;
  };
  endpoints: EndpointInfo[];
  orchestraKeyConfigured: boolean;
  timestamp: string;
}

interface EventLog {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  payload: any;
}

interface RouterMetrics {
  latencyMs: number;
  modelUsed: string;
  tokensCount: number;
  estimatedCostUsd: number;
  gateway: string;
  isSimulated: boolean;
}

interface MemoryRecord {
  id: string;
  key: string;
  value: string;
  module: string;
  tags: string[];
  timestamp: string;
}

interface MarketplacePlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  status: "active" | "disabled" | "not_installed";
  developer: string;
  capabilities: string[];
}

export default function EmpireOSPluginHub() {
  const [activeTab, setActiveTab] = useState<"telemetry" | "content_os" | "marketplace" | "memory">("telemetry");

  // Plugin info state
  const [pluginInfo, setPluginInfo] = useState<PluginMetadata | null>(null);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(true);

  // Event bus state
  const [events, setEvents] = useState<EventLog[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [eventEmitSource, setEventEmitSource] = useState<string>("empire.plugin.crosspost");
  const [eventEmitType, setEventEmitType] = useState<string>("content.generated");
  const [eventEmitPayload, setEventEmitPayload] = useState<string>(
    JSON.stringify({ platform: "twitter", charCount: 242, qualityScore: 94 }, null, 2)
  );
  const [emittingEvent, setEmittingEvent] = useState<boolean>(false);

  // AI Router state
  const [routerPrompt, setRouterPrompt] = useState<string>("Analyze the engagement pattern of B2B SaaS builders and suggest a post theme.");
  const [routerInstruction, setRouterInstruction] = useState<string>("You are an expert LinkedIn growth consultant. Output a professional viral recommendation.");
  const [routerPlatform, setRouterPlatform] = useState<string>("linkedin");
  const [routerModel, setRouterModel] = useState<string>("gemini-3.5-flash");
  const [routerResponse, setRouterResponse] = useState<string>("Click 'Route Cognitive Request' to test live or simulated AI load balancing.");
  const [routerMetrics, setRouterMetrics] = useState<RouterMetrics | null>(null);
  const [routerLoading, setRouterLoading] = useState<boolean>(false);

  // Goose Runtime state
  const [gooseCommand, setGooseCommand] = useState<string>("scrape-social-density");
  const [gooseNicheInput, setGooseNicheInput] = useState<string>("AI Agents for Solo Hackers");
  const [gooseTargetPlatform, setGooseTargetPlatform] = useState<string>("twitter,linkedin");
  const [gooseLogs, setGooseLogs] = useState<any[]>([]);
  const [gooseExecuting, setGooseExecuting] = useState<boolean>(false);
  const [gooseRunId, setGooseRunId] = useState<string | null>(null);

  // --- NEW INTEGRATIONS STATE (PHASE 4) ---

  // Memory states
  const [memories, setMemories] = useState<MemoryRecord[]>([]);
  const [loadingMemories, setLoadingMemories] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchModule, setSearchModule] = useState<string>("");
  const [searchTag, setSearchTag] = useState<string>("");
  
  // Create memory form state
  const [newMemKey, setNewMemKey] = useState<string>("");
  const [newMemVal, setNewMemVal] = useState<string>("");
  const [newMemModule, setNewMemModule] = useState<string>("CrossPost");
  const [newMemTags, setNewMemTags] = useState<string>("branding, guidelines");
  const [savingMemory, setSavingMemory] = useState<boolean>(false);

  // Marketplace states
  const [marketplace, setMarketplace] = useState<MarketplacePlugin[]>([]);
  const [loadingMarketplace, setLoadingMarketplace] = useState<boolean>(false);
  const [marketplaceActionId, setMarketplaceActionId] = useState<string | null>(null);

  // One-Button Content OS Pipeline states
  const [topic, setTopic] = useState<string>("Programmatic SEO and Multi-Agent Content Ingestion");
  const [style, setStyle] = useState<string>("Technical Explainer");
  const [targetAudience, setTargetAudience] = useState<string>("Developers & AI Founders");
  const [channel, setChannel] = useState<string>("YouTube Shorts");
  const [length, setLength] = useState<string>("Short (<1 min)");
  const [hasCharacterBible, setHasCharacterBible] = useState<boolean>(true);
  const [pipelineResult, setPipelineResult] = useState<any | null>(null);
  const [loadingPipeline, setLoadingPipeline] = useState<boolean>(false);

  // Suggested Topics for quick-fill
  const suggestedTopics = [
    { topic: "Bypassing LLM pricing gates using local models", style: "Viral Tutorial", audience: "Solo Hackers", channel: "X / Twitter", length: "Short (<1 min)" },
    { topic: "The Multi-Agent framework powering modern e-commerce scrapers", style: "Technical Explainer", audience: "Systems Architects", channel: "YouTube", length: "Long (>5 min)" },
    { topic: "How programmatic video compositing generates 100 channels overnight", style: "Case Study", audience: "Digital Marketers", channel: "LinkedIn", length: "Medium (1-3 min)" }
  ];

  // Fetch plugin registration data
  const fetchRegistration = async () => {
    setLoadingRegister(true);
    try {
      const res = await fetch("/api/empire/register");
      const data = await res.json();
      if (data.success) {
        setPluginInfo(data);
      }
    } catch (err) {
      console.error("Failed to load registration:", err);
    } finally {
      setLoadingRegister(false);
    }
  };

  // Fetch event bus logs
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/empire/event-bus");
      const data = await res.json();
      if (data.success) {
        setEvents(data.events.reverse()); // Show newest first
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch shared memories
  const fetchMemories = async () => {
    setLoadingMemories(true);
    try {
      const res = await fetch("/api/empire/memory");
      const data = await res.json();
      if (data.success) {
        setMemories(data.memories);
      }
    } catch (err) {
      console.error("Failed to load memories:", err);
    } finally {
      setLoadingMemories(false);
    }
  };

  // Fetch marketplace modules
  const fetchMarketplace = async () => {
    setLoadingMarketplace(true);
    try {
      const res = await fetch("/api/empire/marketplace/plugins");
      const data = await res.json();
      if (data.success) {
        setMarketplace(data.plugins);
      }
    } catch (err) {
      console.error("Failed to load marketplace:", err);
    } finally {
      setLoadingMarketplace(false);
    }
  };

  useEffect(() => {
    fetchRegistration();
    fetchEvents();
    fetchMemories();
    fetchMarketplace();

    const interval = setInterval(() => {
      fetchEvents();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Post new event to the bus
  const handleEmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmittingEvent(true);
    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(eventEmitPayload);
      } catch {
        parsedPayload = { rawText: eventEmitPayload };
      }

      const res = await fetch("/api/empire/event-bus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: eventEmitSource,
          type: eventEmitType,
          payload: parsedPayload
        })
      });
      const data = await res.json();
      if (data.success) {
        setEventEmitPayload(JSON.stringify({ platform: "twitter", charCount: Math.floor(Math.random() * 100) + 120, qualityScore: Math.floor(Math.random() * 10) + 90 }, null, 2));
        await fetchEvents();
      }
    } catch (err) {
      console.error("Failed to emit event:", err);
    } finally {
      setEmittingEvent(false);
    }
  };

  // Run central AI router query
  const handleRouteAI = async () => {
    if (!routerPrompt.trim()) return;
    setRouterLoading(true);
    setRouterResponse("");
    setRouterMetrics(null);
    try {
      const res = await fetch("/api/empire/ai-router", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: routerPrompt,
          systemInstruction: routerInstruction,
          platformId: routerPlatform,
          useModel: routerModel
        })
      });
      const data = await res.json();
      if (data.success) {
        setRouterResponse(data.text);
        setRouterMetrics(data.metrics);
        await fetchEvents();
      }
    } catch (err) {
      console.error("AI Router failure:", err);
      setRouterResponse("Error: Failed to route query to the Empire AI Router.");
    } finally {
      setRouterLoading(false);
    }
  };

  // Run Goose Runtime Command
  const handleExecuteGoose = async () => {
    setGooseExecuting(true);
    setGooseLogs([]);
    setGooseRunId(null);
    try {
      const args = gooseCommand === "scrape-social-density" 
        ? { niche: gooseNicheInput } 
        : { platforms: gooseTargetPlatform.split(",") };

      const res = await fetch("/api/empire/goose-runtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: gooseCommand,
          args
        })
      });
      const data = await res.json();
      if (data.success) {
        setGooseRunId(data.runId);
        let currentLogs: any[] = [];
        for (let i = 0; i < data.logs.length; i++) {
          await new Promise(r => setTimeout(r, 400));
          currentLogs.push(data.logs[i]);
          setGooseLogs([...currentLogs]);
        }
        await fetchEvents();
      }
    } catch (err) {
      console.error("Goose runtime failure:", err);
      setGooseLogs([{ timestamp: "0.0s", action: "ERROR", output: "Goose runtime failed to initialize CLI." }]);
    } finally {
      setGooseExecuting(false);
    }
  };

  // --- MEMORY CONTROLLERS ---
  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemKey.trim() || !newMemVal.trim()) return;
    setSavingMemory(true);
    try {
      const tagsArray = newMemTags.split(",").map(t => t.trim().toLowerCase()).filter(t => t);
      const res = await fetch("/api/empire/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: newMemKey.trim(),
          value: newMemVal.trim(),
          module: newMemModule,
          tags: tagsArray
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewMemKey("");
        setNewMemVal("");
        await fetchMemories();
        await fetchEvents();
      }
    } catch (err) {
      console.error("Failed to store memory:", err);
    } finally {
      setSavingMemory(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      const res = await fetch(`/api/empire/memory/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        await fetchMemories();
        await fetchEvents();
      }
    } catch (err) {
      console.error("Failed to delete memory:", err);
    }
  };

  // Search/Filter Memories
  const filteredMemories = memories.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || m.key.toLowerCase().includes(q) || m.value.toLowerCase().includes(q);
    const matchesModule = !searchModule || m.module.toLowerCase() === searchModule.toLowerCase();
    const matchesTag = !searchTag || m.tags.includes(searchTag.toLowerCase());
    return matchesSearch && matchesModule && matchesTag;
  });

  // --- MARKETPLACE CONTROLLERS ---
  const handleTogglePlugin = async (id: string) => {
    setMarketplaceActionId(id);
    try {
      const res = await fetch("/api/empire/marketplace/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        await fetchMarketplace();
        await fetchEvents();
      }
    } catch (err) {
      console.error("Failed to toggle marketplace module:", err);
    } finally {
      setMarketplaceActionId(null);
    }
  };

  const handleInstallPlugin = async (id: string) => {
    setMarketplaceActionId(id);
    try {
      const res = await fetch("/api/empire/marketplace/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        await fetchMarketplace();
        await fetchEvents();
      }
    } catch (err) {
      console.error("Failed to install marketplace module:", err);
    } finally {
      setMarketplaceActionId(null);
    }
  };

  const handleUpdatePlugin = async (id: string) => {
    setMarketplaceActionId(id);
    try {
      const res = await fetch("/api/empire/marketplace/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        await fetchMarketplace();
        await fetchEvents();
      }
    } catch (err) {
      console.error("Failed to update marketplace module:", err);
    } finally {
      setMarketplaceActionId(null);
    }
  };

  // --- ONE-BUTTON CONTENT PIPELINE CONTROLLER ---
  const handleTriggerPipeline = async () => {
    setLoadingPipeline(true);
    setPipelineResult(null);
    try {
      const res = await fetch("/api/empire/content-os/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          style,
          targetAudience,
          channel,
          length,
          hasCharacterBible
        })
      });
      const data = await res.json();
      if (data.success) {
        setPipelineResult(data);
        await fetchMemories(); // reload since pipeline saves memory
        await fetchEvents();
      }
    } catch (err) {
      console.error("Pipeline failure:", err);
    } finally {
      setLoadingPipeline(false);
    }
  };

  const handleQuickFill = (item: any) => {
    setTopic(item.topic);
    setStyle(item.style);
    setTargetAudience(item.audience);
    setChannel(item.channel);
    setLength(item.length);
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-12 text-slate-100">
      
      {/* Top Header Panel */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border-2 border-purple-900/60 rounded-xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-[9px] font-mono font-black uppercase tracking-wider bg-purple-900/50 text-purple-300 border border-purple-800 rounded-full">
                Empire OS Plug-In Architecture
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-950/50 text-emerald-400 border border-emerald-900 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ecosystem Hub Ready
              </span>
            </div>
            
            <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 uppercase">
              <Brain className="w-7 h-7 text-indigo-400" />
              CrossPost Sovereign Content OS
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Transforming social postings into an autonomous corporate content engine. Manage system marketplace plugins, search unified brand memory, and dispatch single-button business production pipelines across Google and local runtimes.
            </p>
          </div>

          <div className="bg-slate-950/95 border border-purple-900/40 rounded-lg p-4 font-mono text-[11px] text-slate-300 space-y-2 shrink-0 md:min-w-[280px]">
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-500">INGRESS ROUTER:</span>
              <span className="font-bold text-slate-200">PORT 3000 (Gateway)</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-500">SHARED PLUGINS:</span>
              <span className="text-indigo-400 font-bold">{marketplace.filter(p => p.status === "active").length} Active</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-500">MEMORY CELLS:</span>
              <span className="text-cyan-400 font-bold">{memories.length} Registered</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">AUTO-OPTIMIZE:</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-extrabold text-[9px]">ONLINE</span>
            </div>
          </div>
        </div>

        {/* Global Hub Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-8 border-t border-slate-800/80 pt-5">
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-2 cursor-pointer ${
              activeTab === "telemetry"
                ? "bg-indigo-600 text-slate-100 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Telemetry & Gateway</span>
          </button>

          <button
            onClick={() => setActiveTab("content_os")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-2 cursor-pointer relative ${
              activeTab === "content_os"
                ? "bg-indigo-600 text-slate-100 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>One-Button Content Pipeline</span>
            <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 text-[8px] bg-red-500 text-white font-extrabold rounded-full animate-bounce">
              NEW
            </span>
          </button>

          <button
            onClick={() => setActiveTab("marketplace")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-2 cursor-pointer ${
              activeTab === "marketplace"
                ? "bg-indigo-600 text-slate-100 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Plugin Marketplace</span>
          </button>

          <button
            onClick={() => setActiveTab("memory")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-2 cursor-pointer ${
              activeTab === "memory"
                ? "bg-indigo-600 text-slate-100 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Unified Memory Engine</span>
          </button>
        </div>
      </div>

      {/* --- TELEMETRY & GATEWAY TAB CONTENT --- */}
      {activeTab === "telemetry" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* Left Side (AI Router + Goose) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Empire AI Router */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <h3 className="text-sm font-mono font-black uppercase text-slate-100 tracking-tight">
                    Universal AI Router Playground
                  </h3>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-900/30">
                  POST /api/empire/ai-router
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Dynamic gateway balance agent. Swaps execution models based on prompt language markers: routes coding parameters offline to local Ollama, research structures to Gemini Pro, and multi-file reasoning tasks to Claude Sonnet.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">System Instruction Override</label>
                  <input
                    type="text"
                    value={routerInstruction}
                    onChange={(e) => setRouterInstruction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Platform Target</label>
                    <select
                      value={routerPlatform}
                      onChange={(e) => setRouterPlatform(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="linkedin">LinkedIn (Professional)</option>
                      <option value="twitter">X / Twitter (Brevity)</option>
                      <option value="tiktok">TikTok (Casual)</option>
                      <option value="reddit">Reddit (Community)</option>
                      <option value="youtube">YouTube (SEO Essay)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">LLM Core Model</label>
                    <select
                      value={routerModel}
                      onChange={(e) => setRouterModel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash (SaaS Pro)</option>
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep)</option>
                      <option value="ollama-local">Local Ollama Llama3 (Offline)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">User prompt</label>
                <textarea
                  value={routerPrompt}
                  onChange={(e) => setRouterPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 text-xs font-sans rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition leading-relaxed resize-none font-medium"
                />
              </div>

              <button
                onClick={handleRouteAI}
                disabled={routerLoading || !routerPrompt.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-slate-950 hover:text-slate-950 font-mono text-xs font-black uppercase tracking-wider py-2.5 rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {routerLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ROUTING AND BALANCING REQUEST...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ROUTE COGNITIVE REQUEST</span>
                  </>
                )}
              </button>

              {/* AI Router response and telemetry stats */}
              {(routerResponse || routerMetrics) && (
                <div className="bg-slate-950 border border-slate-850 rounded-lg p-4 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Router Reply Output</span>
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3" />
                      <span>Response Decoded</span>
                    </span>
                  </div>

                  <div className="text-xs font-sans text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                    {routerResponse}
                  </div>

                  {routerMetrics && (
                    <div className="bg-slate-900 border border-slate-850 rounded-lg p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-center font-mono">
                      <div className="p-2 border-r border-slate-850">
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">LATENCY</span>
                        <span className="text-xs font-bold text-cyan-400">{routerMetrics.latencyMs}ms</span>
                      </div>
                      <div className="p-2 border-r border-slate-850">
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">ENGINE</span>
                        <span className="text-[10px] font-bold text-slate-300 break-all">{routerMetrics.modelUsed}</span>
                      </div>
                      <div className="p-2 border-r border-slate-850">
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">TOKEN VOL</span>
                        <span className="text-xs font-bold text-indigo-400">~{routerMetrics.tokensCount} tokens</span>
                      </div>
                      <div className="p-2">
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">EST. COST</span>
                        <span className="text-xs font-bold text-emerald-400">${routerMetrics.estimatedCostUsd.toFixed(6)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Goose Execution Runtime CLI */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-mono font-black uppercase text-slate-100 tracking-tight">
                    Goose Execution Runtime Terminal
                  </h3>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/50 text-amber-400 border border-amber-900/30">
                  POST /api/empire/goose-runtime
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Dispatch autonomous scraper crawls, keyword indexings, or deployment tasks straight to the <strong>Goose Execution Runtime CLI</strong>. The CLI automates social search queries and publishes post payload outputs directly to external gateways.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Goose Command</label>
                  <select
                    value={gooseCommand}
                    onChange={(e) => setGooseCommand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="scrape-social-density">scrape-social-density</option>
                    <option value="deploy-winning-posts">deploy-winning-posts</option>
                  </select>
                </div>

                {gooseCommand === "scrape-social-density" ? (
                  <div className="md:col-span-5 space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Niche Filter Arg</label>
                    <input
                      type="text"
                      value={gooseNicheInput}
                      onChange={(e) => setGooseNicheInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans font-medium"
                    />
                  </div>
                ) : (
                  <div className="md:col-span-5 space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Platforms Target Arg</label>
                    <input
                      type="text"
                      value={gooseTargetPlatform}
                      onChange={(e) => setGooseTargetPlatform(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans font-medium"
                    />
                  </div>
                )}

                <div className="md:col-span-3">
                  <button
                    onClick={handleExecuteGoose}
                    disabled={gooseExecuting}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-slate-950 font-mono text-xs font-black uppercase tracking-wider py-2.5 rounded-lg transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {gooseExecuting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>SPAWNING...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>SPAWN GOOSE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Goose terminal logging logs */}
              {(gooseExecuting || gooseLogs.length > 0) && (
                <div className="bg-slate-950 border border-slate-850 rounded-lg overflow-hidden flex flex-col shadow-inner">
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-850 flex justify-between items-center text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span className="text-slate-200 font-black">GOOSE RUNTIME TERMINAL</span>
                    </div>
                    <span className="text-slate-500">{gooseRunId || "PENDING_ID"}</span>
                  </div>

                  <div className="p-4 bg-slate-950 font-mono text-[11px] leading-relaxed text-slate-300 min-h-[140px] space-y-2 select-text max-h-[250px] overflow-auto">
                    {gooseLogs.map((log: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                        <span className="text-amber-400 font-bold shrink-0">{log.action}:</span>
                        <span className="text-slate-200">{log.output}</span>
                      </div>
                    ))}
                    {gooseExecuting && (
                      <div className="flex gap-1.5 items-center text-slate-400 text-[10px] italic mt-1 bg-slate-900/30 p-1 rounded max-w-[200px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                        <span>Goose crawling social clusters...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side (Event Bus + REST APIs) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Empire Event Bus Real-Time Ledger */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-mono font-black uppercase text-slate-100 tracking-tight">
                    Empire Event Bus Ledger
                  </h3>
                </div>
                <button 
                  onClick={fetchEvents}
                  disabled={loadingEvents}
                  className="text-[10px] font-mono text-purple-400 hover:text-purple-300 transition flex items-center gap-1 cursor-pointer disabled:opacity-45"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingEvents ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
                Monitor standard ecosystem triggers published across the <strong>Empire Event Bus</strong>. Any system actions (saving memories, deploying content, running pipelines) broadcast standard schema payloads across modules.
              </p>

              {/* Event ledger flow */}
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                {events.length === 0 ? (
                  <div className="text-center py-6 border border-slate-850 rounded-lg text-xs font-mono text-slate-500 bg-slate-950/40">
                    No Event Bus entries logged.
                  </div>
                ) : (
                  events.map((evt: EventLog) => {
                    const isCore = evt.source.includes("core") || evt.source.includes("memory");
                    const isGoose = evt.source.includes("goose") || evt.source.includes("content_os");
                    
                    return (
                      <div 
                        key={evt.id} 
                        className={`p-3 rounded-lg border text-xs font-mono transition-all duration-150 hover:bg-slate-950 ${
                          isCore 
                            ? "bg-slate-950/50 border-cyan-900/30" 
                            : isGoose
                              ? "bg-slate-950/50 border-amber-900/30"
                              : "bg-purple-950/10 border-purple-900/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-bold ${
                            isCore ? "text-cyan-400" : isGoose ? "text-amber-400" : "text-purple-300"
                          }`}>
                            {evt.type}
                          </span>
                          <span className="text-[9px] text-slate-500">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <div className="text-[10px] text-slate-400 break-words font-sans space-y-1">
                          <div>
                            <span className="font-mono text-slate-500 uppercase text-[9px]">Source:</span>{" "}
                            <span className="font-mono text-slate-300">{evt.source}</span>
                          </div>
                          <div>
                            <span className="font-mono text-slate-500 uppercase text-[9px]">Payload:</span>{" "}
                            <code className="text-slate-350 bg-slate-950/85 px-1 py-0.5 rounded break-all text-[9px]">
                              {JSON.stringify(evt.payload)}
                            </code>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Emit Mock Event Form */}
              <form onSubmit={handleEmitEvent} className="bg-slate-950 border border-slate-850 rounded-lg p-3.5 space-y-3">
                <span className="text-[9.5px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
                  Emit Custom Event to Bus
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Event Source</label>
                    <input
                      type="text"
                      value={eventEmitSource}
                      onChange={(e) => setEventEmitSource(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 font-mono focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Event Type</label>
                    <input
                      type="text"
                      value={eventEmitType}
                      onChange={(e) => setEventEmitType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 font-mono focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold block">JSON Payload</label>
                  <textarea
                    value={eventEmitPayload}
                    onChange={(e) => setEventEmitPayload(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 text-[10px] font-mono rounded p-2 text-slate-300 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={emittingEvent}
                  className="w-full bg-purple-900/40 border border-purple-700/60 hover:bg-purple-900/70 text-purple-200 font-mono text-[10px] font-bold uppercase tracking-wider py-1.5 rounded cursor-pointer transition disabled:opacity-40"
                >
                  {emittingEvent ? "Broadcasting..." : "Broadcast Event message"}
                </button>
              </form>
            </div>

            {/* REST API Gateway Directory */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Globe className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-mono font-black uppercase text-slate-100 tracking-tight">
                  Standard REST API Gateway
                </h3>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
                This system container exposes standard endpoints on <strong>port 3000</strong>:
              </p>

              <div className="space-y-2 font-mono">
                {pluginInfo?.endpoints.slice(0, 5).map((ep: EndpointInfo, idx: number) => {
                  const isGet = ep.method === "GET";
                  const isEmpire = ep.path.includes("empire") || ep.path.includes("memory");
                  return (
                    <div key={idx} className="p-2 bg-slate-950 border border-slate-850 rounded flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                            isGet ? "bg-cyan-950 text-cyan-400 border border-cyan-900/40" : "bg-emerald-950 text-emerald-400 border border-emerald-900/40"
                          }`}>
                            {ep.method}
                          </span>
                          <span className={`text-[10px] font-bold truncate ${isEmpire ? "text-purple-300" : "text-slate-300"}`}>
                            {ep.path}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest bg-slate-900 px-1 rounded">
                          {isEmpire ? "CORE_SYS" : "API"}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans leading-relaxed font-medium">
                        {ep.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SOVEREIGN ONE-BUTTON PIPELINE TAB CONTENT --- */}
      {activeTab === "content_os" && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Quick-Fill Ideas Panel */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider block mb-2.5">
              💡 Quick-Fill Suggested Campaigns
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {suggestedTopics.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleQuickFill(item)}
                  className="bg-slate-950 border border-slate-850 hover:border-purple-500/50 p-3 rounded-lg text-xs cursor-pointer transition hover:bg-slate-900/80 group space-y-1.5"
                >
                  <p className="font-bold text-slate-200 group-hover:text-purple-300 transition line-clamp-1">
                    {item.topic}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{item.style}</span>
                    <span className="text-purple-400">{item.channel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input parameters panel (Col Span 5) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-mono font-black uppercase text-slate-100 tracking-tight">
                    Campaign Inputs
                  </h3>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-1.5 py-0.5 rounded">
                  OS WORKER
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Topic / Core Business Idea</label>
                  <textarea
                    rows={2}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Programmatic SEO with Next.js..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans font-medium resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Creative Style</label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                    >
                      <option value="Technical Explainer">Technical Explainer</option>
                      <option value="Viral Tutorial">Viral Tutorial</option>
                      <option value="Brutalist Case Study">Brutalist Case Study</option>
                      <option value="Ecosystem Storytelling">Ecosystem Story</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Target Audience</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Primary Channel</label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans font-medium"
                    >
                      <option value="YouTube Shorts">YouTube Shorts</option>
                      <option value="YouTube">YouTube Video</option>
                      <option value="TikTok">TikTok</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="X / Twitter">X / Twitter</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Length Profile</label>
                    <select
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans font-medium"
                    >
                      <option value="Short (<1 min)">Short/Shorts (&lt;1 min)</option>
                      <option value="Medium (1-3 min)">Medium (1-3 min)</option>
                      <option value="Long (>5 min)">Long/Deep-Dive (&gt;5 min)</option>
                    </select>
                  </div>
                </div>

                {/* Character Consistency Toggle */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-200 block">Character Engine Bible</span>
                      <span className="text-[9px] text-slate-500 block leading-relaxed">Lock consistent visuals & voice prompts</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setHasCharacterBible(!hasCharacterBible)}
                    className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                  >
                    {hasCharacterBible ? (
                      <ToggleRight className="w-9 h-9 text-purple-500" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleTriggerPipeline}
                disabled={loadingPipeline || !topic.trim()}
                className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-slate-950 hover:opacity-95 font-mono text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loadingPipeline ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>SYNCHRONIZING PRODUCTION AGENTS...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950 fill-current animate-pulse" />
                    <span>Run Autonomous Campaign Pipeline</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-slate-500 leading-relaxed font-mono text-center p-2 border border-dashed border-slate-850 rounded">
                ⚡ Automatically updates brand training memory upon success.
              </div>
            </div>

            {/* Pipeline Outputs Display (Col Span 7) */}
            <div className="lg:col-span-8 space-y-6">
              
              {!pipelineResult && !loadingPipeline && (
                <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center bg-slate-900/10 flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-full text-slate-600">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="max-w-md space-y-1.5">
                    <p className="text-sm font-bold text-slate-300 uppercase font-mono tracking-tight">
                      Sovereign Pipeline Awaiting Dispatch
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Provide campaign specifications and click the trigger button. Our coordinator agent will spawn specialists to construct the business outline, character consistency sheet, video blueprints, SSML narratives, and cross-platform publishing versions.
                    </p>
                  </div>
                </div>
              )}

              {loadingPipeline && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
                  <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-indigo-900/30 border-t-indigo-500 animate-spin flex items-center justify-center"></div>
                      <Brain className="w-6 h-6 text-indigo-400 absolute top-5 left-5 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200 font-mono">AUTONOMOUS MULTI-AGENT INGESTION PIPELINE LIVE</p>
                      <p className="text-xs text-slate-500 italic font-mono mt-1">Coordinating Google Gemini & Local Context Workers</p>
                    </div>
                  </div>

                  <div className="space-y-3 font-mono text-[11px] bg-slate-950 p-4 border border-slate-850 rounded-lg">
                    <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                      <Check className="w-3.5 h-3.5" />
                      <span>[0.1s] Research Agent: Scraping social indices & validating credentials...</span>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-400">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                      <span>[0.8s] Writing Agent: Synthesizing hook thresholds, SEO, and CTA matrix...</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>[--] Character Engine: Awaiting appearance, expressions & clothing lock...</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>[--] Image Engine: Cinematic scene storyboard queues pending...</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>[--] Voice Engine: Phonetic synthesis SSML templates pending...</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>[--] Learning Engine: Cross-reference memories for optimization index...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pipeline Results Bento Board */}
              {pipelineResult && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Results Top Stats Banner */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-950/50 border border-emerald-900/60 rounded text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-mono font-black text-slate-200 uppercase">Ecosystem Pipeline Finished</p>
                        <p className="text-[10px] font-mono text-slate-500">Latency: <span className="text-cyan-400">{pipelineResult.latencyMs}ms</span> | Simulated Fallback: <span className={pipelineResult.isSimulated ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>{pipelineResult.isSimulated ? "FALLBACK_ACTIVE" : "NO"}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 block">PREDICTED CTR</span>
                        <span className="text-sm font-bold text-emerald-400">
                          {pipelineResult.data.analyticsEngine.predictedCTR}%
                        </span>
                      </div>
                      <div className="text-right border-l border-slate-800 pl-4">
                        <span className="text-[9px] text-slate-500 block">EXPECTED RPM</span>
                        <span className="text-sm font-bold text-cyan-400">
                          ${pipelineResult.data.analyticsEngine.expectedRPM.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1. Research Agent Output */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-mono font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      Research Agent Insights & Citations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-black">Key Researched Facts</span>
                        <ul className="space-y-1.5 font-sans text-slate-300 list-disc list-inside leading-relaxed font-medium">
                          {pipelineResult.data.research.keyFacts.map((fact: string, idx: number) => (
                            <li key={idx}>{fact}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-black">Verified Citations</span>
                        <div className="space-y-1 font-mono text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-850">
                          {pipelineResult.data.research.citations.map((cite: string, idx: number) => (
                            <div key={idx} className="flex gap-1.5 items-center">
                              <span className="text-indigo-400 font-bold">[{idx + 1}]</span>
                              <span className="truncate">{cite}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {pipelineResult.data.research.sections.map((section: any, idx: number) => (
                      <div key={idx} className="bg-slate-950/50 p-3 rounded-lg border border-slate-850/60 mt-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1">{section.title}</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{section.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* 2. Writing Agent Output */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      Writing Agent Script & Hook Matrix
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-indigo-950/25 border border-indigo-900/40 p-3 rounded-lg">
                        <span className="text-[9px] font-mono text-indigo-400 uppercase font-black tracking-widest block mb-1">
                          🧲 Tested High-Converting Hook
                        </span>
                        <p className="text-xs font-bold text-slate-100 italic leading-relaxed">
                          "{pipelineResult.data.writing.hook}"
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-black">Narration Script Blueprint</span>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs font-sans text-slate-200 leading-relaxed max-h-[160px] overflow-auto whitespace-pre-wrap font-medium">
                          {pipelineResult.data.writing.script}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-500 uppercase font-black">Chapters</span>
                          <div className="space-y-1 bg-slate-950/40 p-2 rounded border border-slate-850">
                            {pipelineResult.data.writing.chapters.map((ch: string, idx: number) => (
                              <div key={idx} className="text-[11px] text-slate-300">{ch}</div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-500 uppercase font-black">SEO Tags / Metadata</span>
                          <div className="flex flex-wrap gap-1">
                            {pipelineResult.data.writing.seoKeywords.map((kw: string, idx: number) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-850 text-[10px]">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Character Engine Bible */}
                  {hasCharacterBible && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-mono font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                        <User className="w-4 h-4 text-purple-400" />
                        Character Engine Consistent Bible
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2 bg-slate-950 p-3 rounded border border-slate-850">
                          <div>
                            <span className="text-[9px] font-mono text-slate-500 uppercase">Age / Personality profile</span>
                            <p className="font-bold text-slate-200">Age {pipelineResult.data.characterBible.age} | {pipelineResult.data.characterBible.personality}</p>
                          </div>
                          <div className="mt-2">
                            <span className="text-[9px] font-mono text-slate-500 uppercase">Appearance Prompt</span>
                            <p className="text-slate-300 font-medium leading-relaxed mt-0.5">{pipelineResult.data.characterBible.appearance}</p>
                          </div>
                          <div className="mt-2">
                            <span className="text-[9px] font-mono text-slate-500 uppercase">Clothing Styles</span>
                            <p className="text-slate-300 font-medium">{pipelineResult.data.characterBible.clothing}</p>
                          </div>
                        </div>

                        <div className="space-y-2 font-mono">
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase block font-bold">Expressions Checklist</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {pipelineResult.data.characterBible.expressions.map((exp: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-purple-950/30 text-purple-300 border border-purple-900/40 text-[10px]">
                                  {exp}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-3">
                            <span className="text-[9px] text-slate-500 uppercase block font-bold">Lighting Style Reference</span>
                            <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed font-medium">
                              {pipelineResult.data.characterBible.lighting} ({pipelineResult.data.characterBible.style})
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Image & Video Engine */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Engine */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                        <Image className="w-4 h-4 text-cyan-400" />
                        Imagen Cinematic Prompts
                      </h4>
                      <div className="space-y-3 text-xs">
                        {pipelineResult.data.imageEngine.sceneBreakdowns.map((scene: any, idx: number) => (
                          <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-850">
                            <span className="text-[9px] font-mono text-cyan-400 uppercase font-black block">Scene {scene.sceneId} Image Prompt</span>
                            <p className="text-slate-300 mt-0.5 italic leading-relaxed font-medium">"{scene.visualPrompt}"</p>
                          </div>
                        ))}
                        <div className="bg-slate-950/30 p-2.5 rounded border border-slate-850/60">
                          <span className="text-[9px] font-mono text-slate-500 uppercase font-black block">Thumbnail Concept Prompt</span>
                          <p className="text-slate-300 mt-0.5 font-medium leading-relaxed">"{pipelineResult.data.imageEngine.thumbnailPrompt}"</p>
                        </div>
                      </div>
                    </div>

                    {/* Video Engine */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-mono font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                        <Video className="w-4 h-4 text-emerald-400" />
                        Veo Camera & SFX Blueprints
                      </h4>
                      <div className="space-y-2 text-xs font-mono">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block font-bold">Timing Matrix</span>
                          <p className="text-[11px] text-slate-300 mt-0.5">{pipelineResult.data.videoEngine.sceneTiming}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block font-bold">Camera Directions</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-450 mt-0.5 text-[10.5px]">
                            {pipelineResult.data.videoEngine.cameraMovement.map((cam: string, idx: number) => (
                              <li key={idx} className="truncate">{cam}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block font-bold">Transitions Track</span>
                          <p className="text-indigo-400 text-[11px] font-bold">{pipelineResult.data.videoEngine.transitions.join(" ➔ ")}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block font-bold">Music Sync Cues</span>
                          <p className="text-[11px] text-slate-300">{pipelineResult.data.videoEngine.musicTiming}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Voice & Publishing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Voice Engine SSML */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-mono font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                        <Volume2 className="w-4 h-4 text-rose-400" />
                        TTS SSML Phonetic Templates
                      </h4>
                      <div className="space-y-3 text-xs font-mono">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block font-bold">Speech SSML Config</span>
                          <pre className="bg-slate-950 p-2 rounded text-[10px] text-rose-300 border border-slate-850 overflow-x-auto select-all">
                            {pipelineResult.data.voiceEngine.ssml}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block font-bold">Phonetics Guide</span>
                          <p className="text-slate-300 font-sans text-xs italic">{pipelineResult.data.voiceEngine.pronunciationGuide}</p>
                        </div>
                      </div>
                    </div>

                    {/* Publishing Recipes */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-mono font-black text-teal-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                        <Globe className="w-4 h-4 text-teal-400" />
                        Syndication Publishing Recipes
                      </h4>
                      <div className="space-y-3 text-xs">
                        {pipelineResult.data.publishingEngine.platformVersions.map((plat: any, idx: number) => (
                          <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-850 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-teal-400 font-black uppercase">{plat.platform} Version</span>
                              <span className="text-slate-500">Post Time: {plat.bestPostingTime}</span>
                            </div>
                            <p className="text-slate-300 font-sans text-xs font-medium line-clamp-2 leading-relaxed">"{plat.content}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 6. Learning Engine & Continuous Optimization */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-mono font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      Continuous Learning Engine Training Records
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold mb-1.5">Hooks Indexed for Reuse</span>
                        <div className="space-y-1.5">
                          {pipelineResult.data.learningEngine.successfulHooks.map((h: string, idx: number) => (
                            <div key={idx} className="p-2 bg-slate-950 border border-slate-850 rounded text-slate-300">
                              {h}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold mb-1.5">Errors and Pitfalls to Avoid</span>
                        <div className="space-y-1.5">
                          {pipelineResult.data.learningEngine.mistakeAvoidance.map((m: string, idx: number) => (
                            <div key={idx} className="p-2 bg-rose-950/20 border border-rose-900/30 rounded text-rose-300 font-sans text-xs">
                              {m}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
          
        </div>
      )}

      {/* --- PLUGIN MARKETPLACE TAB CONTENT --- */}
      {activeTab === "marketplace" && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-mono font-black uppercase text-slate-100 tracking-tight border-b border-slate-850 pb-3 mb-4">
              Empire OS Plugin Directory
            </h3>

            {loadingMarketplace ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-2" />
                <span className="text-xs font-mono text-slate-500 uppercase">Synchronizing Plugin Index...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplace.map((plugin) => {
                  const isActive = plugin.status === "active";
                  const isDisabled = plugin.status === "disabled";
                  const isNotInstalled = plugin.status === "not_installed";

                  return (
                    <div
                      key={plugin.id}
                      className={`bg-slate-950 border rounded-xl p-5 flex flex-col justify-between space-y-4 transition hover:border-slate-700/60 ${
                        isActive 
                          ? "border-indigo-900/40 shadow-[0_4px_20px_rgba(99,102,241,0.05)]" 
                          : "border-slate-850"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                            {plugin.developer}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider rounded ${
                            isActive
                              ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900"
                              : isDisabled
                                ? "bg-amber-950/50 text-amber-400 border border-amber-900"
                                : "bg-slate-900 text-slate-500 border border-slate-800"
                          }`}>
                            {plugin.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-tight font-sans">
                            {plugin.name}
                          </h4>
                          <span className="text-[10px] font-mono text-indigo-400">
                            v{plugin.version}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-3">
                          {plugin.description}
                        </p>

                        <div className="space-y-1 pt-1">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Capabilities</span>
                          <div className="flex flex-wrap gap-1">
                            {plugin.capabilities.map((cap, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-350 border border-slate-850 text-[9px] font-mono">
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4 border-t border-slate-900/80 grid grid-cols-2 gap-2">
                        {isNotInstalled ? (
                          <button
                            onClick={() => handleInstallPlugin(plugin.id)}
                            disabled={marketplaceActionId !== null}
                            className="col-span-2 w-full bg-indigo-600 hover:opacity-90 text-slate-100 font-mono text-[10px] font-black uppercase py-2 rounded cursor-pointer transition disabled:opacity-40"
                          >
                            {marketplaceActionId === plugin.id ? "Installing..." : "Install Module"}
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleTogglePlugin(plugin.id)}
                              disabled={marketplaceActionId !== null}
                              className={`w-full font-mono text-[10px] font-bold uppercase py-2 rounded cursor-pointer transition disabled:opacity-40 border ${
                                isActive
                                  ? "bg-slate-900 border-slate-800 text-amber-500 hover:bg-slate-850"
                                  : "bg-indigo-900/20 border-indigo-700/40 text-indigo-300 hover:bg-indigo-900/40"
                              }`}
                            >
                              {marketplaceActionId === plugin.id 
                                ? "Wait..." 
                                : isActive 
                                  ? "Disable" 
                                  : "Enable"}
                            </button>

                            <button
                              onClick={() => handleUpdatePlugin(plugin.id)}
                              disabled={marketplaceActionId !== null}
                              className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-mono text-[10px] font-bold uppercase py-2 rounded cursor-pointer transition disabled:opacity-40"
                            >
                              Check Patch
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>
      )}

      {/* --- UNIFIED MEMORY ENGINE TAB CONTENT --- */}
      {activeTab === "memory" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          
          {/* Left panel: Query & Create memory (Col span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Create memory entry form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Plus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-mono font-black uppercase text-slate-100 tracking-tight">
                  Register Memory Key
                </h3>
              </div>

              <form onSubmit={handleSaveMemory} className="space-y-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Memory Key</label>
                  <input
                    type="text"
                    value={newMemKey}
                    onChange={(e) => setNewMemKey(e.target.value)}
                    placeholder="crosspost_brand_tone"
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500 font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Target Module Owner</label>
                  <select
                    value={newMemModule}
                    onChange={(e) => setNewMemModule(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-250 focus:outline-none"
                  >
                    <option value="CrossPost">CrossPost Content OS</option>
                    <option value="StoryForge">StoryForge Narrator</option>
                    <option value="BossListers">Boss Listers Lead Crawler</option>
                    <option value="VideoBot">Video Bot Renderer</option>
                    <option value="General">General / Shared Module</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newMemTags}
                    onChange={(e) => setNewMemTags(e.target.value)}
                    placeholder="branding, rules"
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-200 focus:outline-none font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Memory String Content</label>
                  <textarea
                    rows={4}
                    value={newMemVal}
                    onChange={(e) => setNewMemVal(e.target.value)}
                    placeholder="Input exact text parameters that the AI engine must remember during generation runs..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-medium"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingMemory}
                  className="w-full bg-indigo-600 hover:opacity-90 text-slate-100 font-mono text-xs font-black uppercase py-3 rounded-lg transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  {savingMemory ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Writing Memory Cell...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>Persist Memory Key</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right panel: Memory ledger (Col span 8) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            
            {/* Memory Filter & Search Board */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-850 pb-4">
              <div className="flex items-center gap-2 shrink-0">
                <Database className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-mono font-black uppercase text-slate-100 tracking-tight">
                  Ecosystem Shared Memory Ledger
                </h3>
              </div>

              {/* Filters row */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2.5 left-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search memory..."
                    className="w-full md:w-48 bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 pl-8 text-[11px] text-slate-200 focus:outline-none"
                  />
                </div>

                <select
                  value={searchModule}
                  onChange={(e) => setSearchModule(e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded px-2 py-1.5 text-[10px] font-mono text-slate-300"
                >
                  <option value="">All Modules</option>
                  <option value="CrossPost">CrossPost</option>
                  <option value="StoryForge">StoryForge</option>
                  <option value="BossListers">Boss Listers</option>
                  <option value="VideoBot">Video Bot</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            {loadingMemories ? (
              <div className="text-center py-12 font-mono text-xs text-slate-500 uppercase">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-2" />
                <span>Synchronizing shared memories...</span>
              </div>
            ) : filteredMemories.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                <Database className="w-8 h-8 text-slate-600 mx-auto mb-2.5" />
                <p className="text-xs font-mono font-bold text-slate-400 uppercase">No shared memory cells located</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Try widening search criteria or register a new memory entry.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredMemories.map((mem) => (
                  <div
                    key={mem.id}
                    className="bg-slate-950 border border-slate-850 rounded-lg p-4 hover:border-slate-800 transition relative group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400 font-bold uppercase break-all">
                          {mem.key}
                        </span>
                        <span className="px-1.5 py-0.5 text-[8.5px] font-mono bg-slate-900 text-indigo-300 rounded border border-indigo-950">
                          {mem.module}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-slate-500">
                          {new Date(mem.timestamp).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleDeleteMemory(mem.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-900 transition cursor-pointer md:opacity-0 group-hover:opacity-100"
                          title="Delete memory cell"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-350 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                      {mem.value}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-900/60">
                      <Tag className="w-3 h-3 text-slate-500" />
                      {mem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSearchTag(searchTag === tag ? "" : tag)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer transition ${
                            searchTag === tag
                              ? "bg-purple-600 text-slate-100 font-bold"
                              : "bg-slate-900 text-slate-450 hover:text-slate-200 border border-slate-850"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
