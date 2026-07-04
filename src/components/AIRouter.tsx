import React, { useState, useEffect } from "react";
import {
  Brain, Zap, Sparkles, Terminal, ChevronRight, Settings, Plus, Trash2, AlertCircle, RefreshCw,
  Play, Cpu, Database, Eye, CheckCircle, Clock, DollarSign, Activity, ListOrdered, Shield, Layers, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIProvider {
  id: string;
  name: string;
  provider_key: string;
  status: "Online" | "Offline" | "Busy";
  strengths: string;
  weaknesses: string;
  est_response_time: string;
  cost: "Local" | "Free" | "API";
  current_workload: number;
  active: number;
}

interface RouterJob {
  id: string;
  task: string;
  recommended_ai: string;
  routed_ai: string;
  status: "Success" | "Fallback" | "Failed";
  latency: string;
  cost: string;
  explanation: string;
  timestamp: string;
}

interface QueueItem {
  id: string;
  task: string;
  priority: number;
  status: "Pending" | "Completed";
  recommended_ai: string;
  timestamp: string;
}

export default function AIRouter() {
  const [activeTab, setActiveTab] = useState<"playground" | "providers" | "queue" | "history">("playground");
  const [loading, setLoading] = useState<boolean>(false);
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [jobs, setJobs] = useState<RouterJob[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  
  // Playground states
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customTask, setCustomTask] = useState<string>("Write an optimized SQL query to scan the memory registry table for matching tags.");
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);
  const [loadingDispatch, setLoadingDispatch] = useState<boolean>(false);

  // Queue creator states
  const [queueTask, setQueueTask] = useState<string>("");
  const [queuePriority, setQueuePriority] = useState<number>(2); // 1 = High, 2 = Medium, 3 = Low
  const [queueModel, setQueueModel] = useState<string>("Auto Recommendation");
  const [processingQueue, setProcessingQueue] = useState<boolean>(false);

  // Provider creator states (Dynamic Adapter Configurator)
  const [isAddingProvider, setIsAddingProvider] = useState<boolean>(false);
  const [newProvName, setNewProvName] = useState<string>("");
  const [newProvKey, setNewProvKey] = useState<string>("");
  const [newProvStatus, setNewProvStatus] = useState<"Online" | "Offline" | "Busy">("Online");
  const [newProvStrengths, setNewProvStrengths] = useState<string>("");
  const [newProvWeaknesses, setNewProvWeaknesses] = useState<string>("");
  const [newProvResponseTime, setNewProvResponseTime] = useState<string>("1.5s");
  const [newProvCost, setNewProvCost] = useState<"Local" | "Free" | "API">("API");
  const [newProvWorkload, setNewProvWorkload] = useState<number>(0);

  // Detailed view job modal/drawer
  const [selectedJob, setSelectedJob] = useState<RouterJob | null>(null);

  // Presets mapping for easy UI interaction
  const presetTasks = [
    { label: "💻 Coding (Claude/Codex)", text: "Write a high-performance React component using SSE stream reader with auto reconnection logic." },
    { label: "🔒 Local/Confidential Task (Ollama)", text: "Extract confidential database port-mapping rules from local credentials files offline." },
    { label: "🔍 Market Research (Gemini/ChatGPT)", text: "Analyze the top-grossing software-as-a-service frameworks and draft current conversion statistics." },
    { label: "📖 Creative Book Writing (Claude)", text: "Draft a high-concept prologue outlining a planetary grid operated entirely by decentralized AI nodes." },
    { label: "🎬 Video Script Sequence (ChatGPT)", text: "Outline a 60-second YouTube shorts sequence illustrating the top features of Ollama local execution." },
    { label: "🧸 Children's Bedtime Book (StoryForge)", text: "Draft a magical storybook narrative about Little Leo the database crawler and his quest to find the golden key." },
    { label: "🛍️ High-Ticket Product Listing (Boss Listers)", text: "Draft an optimized marketing description and hooks for an enterprise mechanical keyboard listing." }
  ];

  // Fetch all tables from backend SQLite
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [provRes, jobsRes, qRes] = await Promise.all([
        fetch("/api/empire/ai-router/providers"),
        fetch("/api/empire/ai-router/jobs"),
        fetch("/api/empire/ai-router/queue")
      ]);

      const provData = await provRes.json();
      const jobsData = await jobsRes.json();
      const qData = await qRes.json();

      if (provData.success) setProviders(provData.providers);
      if (jobsData.success) setJobs(jobsData.jobs);
      if (qData.success) setQueue(qData.queue);
    } catch (err) {
      console.error("Failed to load AI Router configurations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handlePresetSelect = (text: string) => {
    setSelectedPreset(text);
    setCustomTask(text);
  };

  // Dispatch a task through the Cognitive Router
  const handleDispatch = async () => {
    if (!customTask.trim()) return;
    setLoadingDispatch(true);
    setDispatchResult(null);

    try {
      const response = await fetch("/api/empire/ai-router/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: customTask.trim() })
      });
      const data = await response.json();
      if (data.success) {
        setDispatchResult(data);
        // Refresh histories and workloads
        fetchAllData();
      } else {
        alert(`Routing failed: ${data.error}`);
      }
    } catch (err: any) {
      console.error("Dispatch request failed:", err);
      alert("Failed to connect to the smart routing gateway.");
    } finally {
      setLoadingDispatch(false);
    }
  };

  // Add tasks to the Queue
  const handleAddToQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queueTask.trim()) return;

    try {
      const response = await fetch("/api/empire/ai-router/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: queueTask.trim(),
          priority: queuePriority,
          recommended_ai: queueModel
        })
      });

      const data = await response.json();
      if (data.success) {
        setQueueTask("");
        fetchAllData();
      }
    } catch (err) {
      console.error("Failed to enqueue task:", err);
    }
  };

  // Process next queue task
  const handleProcessQueue = async () => {
    if (queue.length === 0) return;
    setProcessingQueue(true);

    try {
      const response = await fetch("/api/empire/ai-router/queue/process", {
        method: "POST"
      });
      const data = await response.json();
      if (data.success && data.processedItem) {
        // Automatically dispatch processed task
        setCustomTask(data.processedItem.task);
        setActiveTab("playground");
        
        const dispatchRes = await fetch("/api/empire/ai-router/dispatch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task: data.processedItem.task })
        });
        const dispatchData = await dispatchRes.json();
        if (dispatchData.success) {
          setDispatchResult(dispatchData);
        }
        fetchAllData();
      }
    } catch (err) {
      console.error("Queue process failed:", err);
    } finally {
      setProcessingQueue(false);
    }
  };

  // Register New AI Provider Adapter
  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName.trim() || !newProvKey.trim()) {
      alert("Name and Adapter Key are mandatory.");
      return;
    }

    try {
      const response = await fetch("/api/empire/ai-router/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProvName.trim(),
          provider_key: newProvKey.trim().toLowerCase(),
          status: newProvStatus,
          strengths: newProvStrengths.trim(),
          weaknesses: newProvWeaknesses.trim(),
          est_response_time: newProvResponseTime,
          cost: newProvCost,
          current_workload: newProvWorkload,
          active: 1
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsAddingProvider(false);
        setNewProvName("");
        setNewProvKey("");
        setNewProvStrengths("");
        setNewProvWeaknesses("");
        fetchAllData();
      }
    } catch (err) {
      console.error("Failed to add AI Provider:", err);
    }
  };

  // Quick state toggling for AI Providers (Online / Offline / Busy)
  const toggleProviderStatus = async (prov: AIProvider, newStatus: "Online" | "Offline" | "Busy") => {
    try {
      const response = await fetch("/api/empire/ai-router/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...prov,
          status: newStatus
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Toggle active / inactive state
  const toggleProviderActivation = async (prov: AIProvider) => {
    try {
      const response = await fetch("/api/empire/ai-router/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...prov,
          active: prov.active === 1 ? 0 : 1
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
      }
    } catch (err) {
      console.error("Failed to toggle provider activation:", err);
    }
  };

  // Delete Provider Adapter
  const handleDeleteProvider = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete adapter configuration for '${name}'?`)) return;
    try {
      const response = await fetch(`/api/empire/ai-router/providers/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (data.success) {
        fetchAllData();
      }
    } catch (err) {
      console.error("Failed to delete provider:", err);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 space-y-6 animate-fade-in font-sans relative overflow-hidden">
      
      {/* Absolute Background Accent Lines */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-zinc-850 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-sm font-mono font-black text-slate-200 uppercase tracking-tight">
              Sovereign AI Router & Orchestration Gateway
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyze, classify, and dispatch enterprise cognitive tasks. Features multi-provider adapters, live status tracking, automatic busy/offline state fallbacks, SQLite persistence, and asynchronous task queues.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchAllData}
            className="p-1.5 rounded bg-zinc-950 border border-zinc-850 text-slate-400 hover:text-indigo-400 hover:border-indigo-900/30 transition cursor-pointer flex items-center gap-1 text-[10px] font-mono"
            title="Refresh All Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            SYNC LEDGER
          </button>
          <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-900/30 px-2.5 py-1 rounded flex items-center gap-1">
            <Shield className="w-3 h-3" />
            SECURE ADAPTERS
          </span>
        </div>
      </div>

      {/* Top Level Quick Metrics Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div className="bg-zinc-950/40 border border-zinc-850/60 p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 rounded bg-amber-950/40 border border-amber-900/30">
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Configured Adapters</span>
            <span className="text-sm font-bold font-mono text-slate-200">
              {providers.length} Registered
            </span>
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-850/60 p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 rounded bg-indigo-950/40 border border-indigo-900/30">
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Gateway Status</span>
            <span className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Active (200 OK)
            </span>
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-850/60 p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-900/30">
            <ListOrdered className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Asynchronous Queue</span>
            <span className="text-sm font-bold font-mono text-slate-200">
              {queue.length} Pending
            </span>
          </div>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-850/60 p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 rounded bg-purple-950/40 border border-purple-900/30">
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Total Jobs Routed</span>
            <span className="text-sm font-bold font-mono text-slate-200">
              {jobs.length} Transacted
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-850 relative z-10">
        <button
          onClick={() => setActiveTab("playground")}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase transition border-b-2 cursor-pointer ${
            activeTab === "playground"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          🚀 Dispatch Playground
        </button>
        <button
          onClick={() => setActiveTab("providers")}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === "providers"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          🎛️ Provider Adapters ({providers.filter(p => p.active === 1).length})
        </button>
        <button
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === "queue"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          📥 Task Queue ({queue.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === "history"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          📊 Routing History ({jobs.length})
        </button>
      </div>

      {/* Main Tab Area */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: PLAYGROUND */}
          {activeTab === "playground" && (
            <motion.div
              key="playground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Preset triggers & Playground form */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-zinc-950/40 border border-zinc-850 rounded-lg p-4 space-y-4">
                  <div>
                    <span className="text-[9px] font-mono text-amber-400 uppercase font-black tracking-wider">Cognitive Task Classifier</span>
                    <h4 className="text-xs font-bold text-slate-200">Query Playground</h4>
                  </div>

                  {/* Preset Buttons Grid */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Quick Presets / Classifier Triggers</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[145px] overflow-y-auto pr-1">
                      {presetTasks.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handlePresetSelect(preset.text)}
                          className={`p-2 rounded text-left text-[10.5px] font-mono cursor-pointer border transition truncate ${
                            selectedPreset === preset.text
                              ? "bg-amber-950/30 border-amber-500/50 text-amber-300 font-bold"
                              : "bg-zinc-900 border-zinc-850 hover:border-zinc-750 text-slate-350"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prompt Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Cognitive Input / Instruction Body</label>
                    <textarea
                      value={customTask}
                      onChange={(e) => {
                        setCustomTask(e.target.value);
                        setSelectedPreset("");
                      }}
                      placeholder="Input any instructions, rules, stories, or code commands..."
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-zinc-700 min-h-[100px] focus:outline-none focus:border-amber-500/70 leading-relaxed resize-none"
                    />
                  </div>

                  {/* Dispatch Button */}
                  <button
                    onClick={handleDispatch}
                    disabled={loadingDispatch || !customTask.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider py-2.5 px-4 rounded-lg cursor-pointer transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loadingDispatch ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        ORCHESTRATING ACTIVE ROUTE...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
                        EXECUTE SMART DISPATCH
                      </>
                    )}
                  </button>
                </div>

                {/* Info Tip about dynamic routing rules */}
                <div className="bg-zinc-950/20 border border-dashed border-zinc-850 p-3.5 rounded-lg flex gap-3">
                  <HelpCircle className="w-5 h-5 text-zinc-500 shrink-0" />
                  <div className="text-[11px] text-slate-400 leading-normal">
                    <strong className="text-slate-300 font-mono block">AUTOMATIC FALLBACK MECHANISM</strong>
                    If the recommended model adapter (e.g. Claude) is offline or busy, the cognitive engine immediately searches for the next best active online provider (e.g. Gemini, ChatGPT) to resolve the job automatically.
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Dispatch Trace Output */}
              <div className="lg:col-span-5">
                {loadingDispatch ? (
                  <div className="bg-zinc-950/40 border border-zinc-850 rounded-lg p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                    <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                    <span className="text-xs font-mono text-slate-300 font-bold uppercase">Evaluating Optimal Path</span>
                    <p className="text-[10px] text-slate-500 max-w-xs mt-1">
                      Scanning SQLite provider registers for status flags, indexing keywords, and checking active server gateways...
                    </p>
                  </div>
                ) : dispatchResult ? (
                  <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-4 space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center font-mono text-[10px] border-b border-zinc-900 pb-2">
                      <span className="text-slate-500 uppercase">Routing Decision Metrics</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/20 border border-emerald-900/30 px-1.5 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" />
                        ROUTED OK
                      </span>
                    </div>

                    {/* Recommendation and Final Target */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-zinc-900 p-2.5 border border-zinc-850/80 rounded-lg text-center">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase">Recommended AI</span>
                        <strong className="text-xs text-indigo-400 font-mono mt-1 block truncate">
                          💡 {dispatchResult.recommended.name}
                        </strong>
                      </div>
                      <div className={`p-2.5 border rounded-lg text-center ${
                        dispatchResult.fallbackOccurred
                          ? "bg-amber-950/10 border-amber-900/40"
                          : "bg-zinc-900 border-zinc-850/80"
                      }`}>
                        <span className="text-[8px] font-mono text-slate-500 block uppercase">
                          {dispatchResult.fallbackOccurred ? "⚠️ Routed Fallback" : "Final Routed AI"}
                        </span>
                        <strong className={`text-xs font-mono mt-1 block truncate ${
                          dispatchResult.fallbackOccurred ? "text-amber-400 font-black" : "text-emerald-400"
                        }`}>
                          🎯 {dispatchResult.routed.name}
                        </strong>
                      </div>
                    </div>

                    {/* Alert Banner for Fallbacks */}
                    {dispatchResult.fallbackOccurred && (
                      <div className="bg-amber-950/25 border border-amber-900/30 p-2.5 rounded-lg flex gap-2 text-[10.5px] text-amber-300">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="leading-snug">
                          <strong>AUTO-FALLBACK ACTIVATED:</strong> {dispatchResult.fallbackReason}
                        </p>
                      </div>
                    )}

                    {/* Performance Row */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-zinc-900/60 p-1.5 border border-zinc-850/30 rounded">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase">LATENCY</span>
                        <span className="font-mono text-slate-200 font-bold">{dispatchResult.latency}</span>
                      </div>
                      <div className="bg-zinc-900/60 p-1.5 border border-zinc-850/30 rounded">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase">TX COST</span>
                        <span className="font-mono text-emerald-400 font-bold">{dispatchResult.cost}</span>
                      </div>
                      <div className="bg-zinc-900/60 p-1.5 border border-zinc-850/30 rounded">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase">STATUS</span>
                        <span className="font-mono text-emerald-500 font-bold">200 OK</span>
                      </div>
                    </div>

                    {/* Classifier Explanation */}
                    <div className="bg-zinc-900 p-2.5 rounded border border-zinc-850 text-[10.5px] font-mono text-slate-400">
                      <span className="text-[8px] font-mono text-slate-500 block font-black mb-1 uppercase">Decision Logic Path</span>
                      {dispatchResult.explanation}
                    </div>

                    {/* Response Stream Block */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-black">AI Output Stream</span>
                      <pre className="bg-zinc-950 p-3 rounded text-[11px] font-mono text-slate-300 overflow-y-auto border border-zinc-850 select-text leading-normal max-h-[180px] scrollbar-thin whitespace-pre-wrap">
                        {dispatchResult.output}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-950/40 border border-zinc-850/50 border-dashed rounded-lg p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                    <Terminal className="w-8 h-8 text-zinc-700 mb-3" />
                    <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Waiting for Dispatch</span>
                    <p className="text-[10.5px] text-zinc-600 max-w-xs mt-1">
                      Choose an interactive classifier prompt preset or write your own custom business task and click Execute.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: REGISTERED PROVIDERS & ADAPTERS */}
          {activeTab === "providers" && (
            <motion.div
              key="providers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Add New Provider Control Panel Toggle */}
              {!isAddingProvider ? (
                <button
                  onClick={() => setIsAddingProvider(true)}
                  className="w-full bg-zinc-950 hover:bg-zinc-950/80 border border-dashed border-zinc-800 hover:border-amber-500/40 p-4 rounded-lg flex items-center justify-center gap-2 text-xs font-mono text-slate-300 hover:text-amber-400 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  REGISTER NEW CUSTOM ADAPTER INTERFACE
                </button>
              ) : (
                <form onSubmit={handleAddProvider} className="bg-zinc-950 border border-zinc-850 p-5 rounded-lg space-y-4 animate-fade-in relative z-10">
                  <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                    <span className="text-xs font-mono font-black text-slate-200 uppercase">Register AI Adapter Node</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingProvider(false)}
                      className="text-xs text-slate-500 hover:text-rose-400 uppercase font-mono cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Provider Public Name</label>
                      <input
                        type="text"
                        value={newProvName}
                        onChange={(e) => setNewProvName(e.target.value)}
                        placeholder="e.g. DeepSeek R1"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Routing Key identifier</label>
                      <input
                        type="text"
                        value={newProvKey}
                        onChange={(e) => setNewProvKey(e.target.value)}
                        placeholder="e.g. deepseek"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Default Status State</label>
                      <select
                        value={newProvStatus}
                        onChange={(e: any) => setNewProvStatus(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Busy">Busy</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Strengths & Capabilities</label>
                      <input
                        type="text"
                        value={newProvStrengths}
                        onChange={(e) => setNewProvStrengths(e.target.value)}
                        placeholder="e.g. Deep reasoning, long math, code synthesis"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Weaknesses / Constraints</label>
                      <input
                        type="text"
                        value={newProvWeaknesses}
                        onChange={(e) => setNewProvWeaknesses(e.target.value)}
                        placeholder="e.g. High cost, slow response time"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Est. Response Time</label>
                      <input
                        type="text"
                        value={newProvResponseTime}
                        onChange={(e) => setNewProvResponseTime(e.target.value)}
                        placeholder="e.g. 1.8s"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Cost Class</label>
                      <select
                        value={newProvCost}
                        onChange={(e: any) => setNewProvCost(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="Local">Local (0.00$)</option>
                        <option value="Free">Free (Platform Seeded)</option>
                        <option value="API">API (Metered Token Billing)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Initial Workload</label>
                      <input
                        type="number"
                        value={newProvWorkload}
                        onChange={(e) => setNewProvWorkload(parseInt(e.target.value, 10) || 0)}
                        placeholder="0"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-lg font-mono text-xs font-bold uppercase transition cursor-pointer"
                  >
                    SAVE & REGISTER ADAPTER TO DATABASE
                  </button>
                </form>
              )}

              {/* Providers Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers.map((prov) => (
                  <div
                    key={prov.id}
                    className={`bg-zinc-950/80 border rounded-xl p-4.5 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition duration-300 relative ${
                      prov.active === 0 ? "opacity-40 border-dashed border-zinc-800" : "border-zinc-850"
                    }`}
                  >
                    {/* Upper Line */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-black font-mono text-slate-100 flex items-center gap-1.5">
                          {prov.name}
                          <span className="text-[8px] font-mono text-zinc-500">({prov.provider_key})</span>
                        </h4>
                        
                        {/* Cost category & workload indicator */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] font-mono text-slate-400 uppercase bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <DollarSign className="w-2.5 h-2.5 text-emerald-400" />
                            {prov.cost}
                          </span>
                          <span className="text-[8px] font-mono text-slate-400 uppercase bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5 text-indigo-400" />
                            {prov.est_response_time} response
                          </span>
                        </div>
                      </div>

                      {/* Power toggle for dynamic adapter */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleProviderActivation(prov)}
                          className={`text-[8px] font-mono px-2 py-0.5 rounded border font-bold cursor-pointer transition ${
                            prov.active === 1
                              ? "bg-indigo-950/40 border-indigo-900/60 text-indigo-400"
                              : "bg-zinc-900 border-zinc-850 text-slate-500"
                          }`}
                        >
                          {prov.active === 1 ? "ACTIVE" : "STBY"}
                        </button>
                        <button
                          onClick={() => handleDeleteProvider(prov.id, prov.name)}
                          className="p-1 border border-zinc-850 rounded hover:bg-rose-950/40 hover:border-rose-900 text-slate-500 hover:text-rose-400 cursor-pointer transition"
                          title="Unregister Adapter"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Detailed strengths & weaknesses list */}
                    <div className="space-y-2 text-xs border-t border-b border-zinc-900/60 py-3 font-sans">
                      <div>
                        <span className="text-[8px] font-mono text-indigo-400 font-bold block uppercase tracking-wide">🧠 Strengths</span>
                        <p className="text-slate-300 mt-0.5 text-[11px] leading-relaxed">{prov.strengths || "General purpose logic reasoning."}</p>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-amber-500 font-bold block uppercase tracking-wide">⚠️ Weaknesses</span>
                        <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed">{prov.weaknesses || "No special limitations flagged."}</p>
                      </div>
                    </div>

                    {/* Workload and Interactive Status Picker */}
                    <div className="flex justify-between items-center text-[10px] font-mono pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 uppercase">Load:</span>
                        <span className="font-bold text-slate-300">
                          {prov.current_workload} active tasks
                        </span>
                      </div>

                      {/* Interactive Status Selector */}
                      <div className="flex gap-1">
                        {(["Online", "Offline", "Busy"] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => toggleProviderStatus(prov, st)}
                            disabled={prov.active === 0}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase transition cursor-pointer ${
                              prov.status === st
                                ? st === "Online"
                                  ? "bg-emerald-950/50 border border-emerald-900/50 text-emerald-400"
                                  : st === "Busy"
                                  ? "bg-amber-950/50 border border-amber-900/50 text-amber-400"
                                  : "bg-rose-950/50 border border-rose-900/50 text-rose-400"
                                : "bg-zinc-900/30 border border-transparent text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: ASYNCHRONOUS TASK QUEUE */}
          {activeTab === "queue" && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Add to Queue form */}
              <div className="lg:col-span-5 space-y-4">
                <form onSubmit={handleAddToQueue} className="bg-zinc-950/40 border border-zinc-850 rounded-lg p-5 space-y-4">
                  <div>
                    <span className="text-[9px] font-mono text-amber-400 uppercase font-bold block">Background Scheduler</span>
                    <h4 className="text-xs font-bold text-slate-200">Enqueue Business Task</h4>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Task Description</label>
                    <textarea
                      value={queueTask}
                      onChange={(e) => setQueueTask(e.target.value)}
                      placeholder="e.g. Format campaign listings or refactor SQLite migration files..."
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-zinc-800 min-h-[90px] focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-500 block font-bold uppercase">Priority Score</label>
                      <select
                        value={queuePriority}
                        onChange={(e) => setQueuePriority(parseInt(e.target.value, 10))}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value={1}>1 - High Priority</option>
                        <option value={2}>2 - Medium Priority</option>
                        <option value={3}>3 - Low Priority</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-500 block font-bold uppercase">Target Model</label>
                      <select
                        value={queueModel}
                        onChange={(e) => setQueueModel(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Auto Recommendation">Auto Recommend</option>
                        <option value="Claude 3.5 Sonnet">Claude 3.5</option>
                        <option value="ChatGPT-4o">ChatGPT-4o</option>
                        <option value="Gemini 2.5 Flash">Gemini 2.5</option>
                        <option value="Ollama (llama3)">Ollama (llama3)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    COMMIT TASK TO BACKGROUND QUEUE
                  </button>
                </form>

                {/* Queue status operational note */}
                <div className="bg-zinc-950/20 border border-dashed border-zinc-850 p-3.5 rounded-lg">
                  <span className="text-[9px] font-mono text-zinc-500 block font-black uppercase mb-1">Operational Protocol</span>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans">
                    Tasks placed in the queue run asynchronously. Click "PROCESS NEXT TASK" to trigger immediate smart classification, automated fallback check, and execution.
                  </p>
                </div>
              </div>

              {/* Active Queue list */}
              <div className="lg:col-span-7 bg-zinc-950/40 border border-zinc-850 rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                  <h4 className="text-xs font-bold font-mono text-slate-200 uppercase">Active Task Queue Ledger</h4>
                  <button
                    onClick={handleProcessQueue}
                    disabled={processingQueue || queue.length === 0}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-mono text-[10px] font-black uppercase px-3 py-1.5 rounded-md cursor-pointer transition flex items-center gap-1"
                  >
                    {processingQueue ? "PROCESSING..." : "PROCESS NEXT TASK"}
                  </button>
                </div>

                {queue.length === 0 ? (
                  <div className="text-center py-16 text-zinc-650 italic text-xs font-mono">
                    Task queue is currently empty. Commit a task on the left!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {queue.map((item) => (
                      <div
                        key={item.id}
                        className="bg-zinc-900 border border-zinc-850 rounded-lg p-3.5 flex justify-between items-start gap-4 hover:border-zinc-750 transition"
                      >
                        <div className="space-y-1.5 min-w-0 flex-grow">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-mono font-bold bg-zinc-950 px-2 py-0.5 rounded text-slate-300">
                              ID: {item.id}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              item.priority === 1
                                ? "bg-rose-950/40 border border-rose-900 text-rose-400"
                                : item.priority === 2
                                ? "bg-amber-950/40 border border-amber-900 text-amber-400"
                                : "bg-zinc-950 border border-zinc-800 text-slate-400"
                            }`}>
                              Priority {item.priority}
                            </span>
                            <span className="text-[9px] font-mono text-indigo-400 uppercase">
                              🎯 Model Target: {item.recommended_ai}
                            </span>
                          </div>
                          <p className="text-[11.5px] font-mono text-slate-200 leading-normal break-words whitespace-pre-wrap">
                            {item.task}
                          </p>
                          <span className="text-[8px] font-mono text-slate-500 block">
                            Queued at: {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: ROUTING HISTORY */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-zinc-950/40 border border-zinc-850 rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                  <h4 className="text-xs font-bold font-mono text-slate-200 uppercase">Historic AI Routing Log Ledger</h4>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Backed by SQLite Database</span>
                </div>

                {jobs.length === 0 ? (
                  <div className="text-center py-16 text-zinc-650 italic text-xs font-mono">
                    No transactions recorded in SQLite history table yet. Try the playground!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-zinc-850 text-slate-500">
                          <th className="py-2.5 px-3">TIMESTAMP</th>
                          <th className="py-2.5 px-3">TASK SUMMARY</th>
                          <th className="py-2.5 px-3">RECOMMENDED</th>
                          <th className="py-2.5 px-3">ROUTED AI</th>
                          <th className="py-2.5 px-3">STATUS</th>
                          <th className="py-2.5 px-3">LATENCY</th>
                          <th className="py-2.5 px-3 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 text-slate-300">
                        {jobs.map((job) => (
                          <tr key={job.id} className="hover:bg-zinc-900/40 transition">
                            <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                              {new Date(job.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="py-3 px-3 max-w-[200px] truncate text-slate-200">
                              {job.task}
                            </td>
                            <td className="py-3 px-3 text-indigo-400 font-bold">
                              {job.recommended_ai}
                            </td>
                            <td className="py-3 px-3 text-slate-200">
                              {job.routed_ai}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                job.status === "Success"
                                  ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                                  : "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                              }`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-400">
                              {job.latency}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => setSelectedJob(job)}
                                className="px-2.5 py-1 bg-zinc-950 border border-zinc-850 rounded hover:border-amber-500 hover:text-amber-400 text-slate-400 cursor-pointer transition text-[9px]"
                              >
                                INSPECT
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* INSPECTION DRAWER / MODAL DIALOG */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-xl p-5 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh] font-sans text-slate-200"
            >
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Inspecting Router Job Ledger Row
                  </span>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-xs text-slate-500 hover:text-rose-400 font-mono cursor-pointer"
                >
                  CLOSE DIALOG
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-zinc-900 p-2.5 border border-zinc-850 rounded">
                  <span className="text-[8px] text-slate-500 block">JOB TRANSACTION ID</span>
                  <span className="font-bold text-slate-200 select-all">{selectedJob.id}</span>
                </div>
                <div className="bg-zinc-900 p-2.5 border border-zinc-850 rounded">
                  <span className="text-[8px] text-slate-500 block">COMMIT DATE TIME</span>
                  <span className="font-bold text-slate-200">{new Date(selectedJob.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Original Client Task Request</span>
                <p className="bg-zinc-900 p-3 rounded text-xs font-mono text-slate-100 border border-zinc-850/60 leading-relaxed whitespace-pre-wrap">
                  {selectedJob.task}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Sovereign Routing Decision Analysis</span>
                <div className="bg-zinc-900 p-3 rounded text-xs font-mono text-slate-350 border border-zinc-850/60 leading-relaxed">
                  <div className="flex items-center gap-4 border-b border-zinc-850/40 pb-2 mb-2">
                    <div>
                      <span className="text-[8px] text-slate-500 block">Recommended Path</span>
                      <strong className="text-indigo-400 font-black">💡 {selectedJob.recommended_ai}</strong>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 block">Routed Target</span>
                      <strong className="text-emerald-400 font-black">🎯 {selectedJob.routed_ai}</strong>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 block">Status Code</span>
                      <span className={`font-black text-[10px] ${
                        selectedJob.status === "Success" ? "text-emerald-400" : "text-amber-400"
                      }`}>{selectedJob.status}</span>
                    </div>
                  </div>
                  <p>{selectedJob.explanation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div className="bg-zinc-900/50 p-2.5 rounded border border-zinc-850">
                  <span className="text-[8px] text-slate-500 block uppercase">METERED BILLING</span>
                  <span className="font-bold text-emerald-400">{selectedJob.cost}</span>
                </div>
                <div className="bg-zinc-900/50 p-2.5 rounded border border-zinc-850">
                  <span className="text-[8px] text-slate-500 block uppercase">EXECUTION SPEED</span>
                  <span className="font-bold text-slate-200">{selectedJob.latency}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
