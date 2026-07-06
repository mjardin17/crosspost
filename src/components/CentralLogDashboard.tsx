import React, { useState, useEffect } from "react";
import {
  ShieldAlert, ShieldCheck, Terminal, Play, AlertCircle, RefreshCw,
  Search, Trash2, Filter, Layers, LayoutGrid, CheckCircle2, ChevronRight, AlertTriangle, Cpu
} from "lucide-react";
import { SystemLogItem } from "../types";
import { Logger } from "../services/Logger";

export default function CentralLogDashboard() {
  const [logs, setLogs] = useState<SystemLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  // Simulation inputs
  const [simModule, setSimModule] = useState<string>("AIRouter");
  const [simLevel, setSimLevel] = useState<"INFO" | "WARN" | "ERROR" | "DEBUG">("ERROR");
  const [simMessage, setSimMessage] = useState<string>("Connection closed abruptly by upstream AI endpoint.");
  const [simulating, setSimulating] = useState<boolean>(false);

  // Error boundary test state
  const [triggerCrash, setTriggerCrash] = useState<boolean>(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/system/logs?limit=300");
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.warn("Failed to fetch system logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to purge all aggregated system logs from the SQLite table?")) {
      return;
    }
    try {
      const response = await fetch("/api/system/logs", { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setLogs([]);
        setActiveDetailId(null);
      }
    } catch (err) {
      console.error("Failed to clear logs:", err);
    }
  };

  const handleSimulateLog = async () => {
    setSimulating(true);
    try {
      await Logger.sendLog(simLevel, simModule, simMessage, `Generated via Log Simulator Interface.\nClient time: ${new Date().toISOString()}`);
      await fetchLogs();
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setSimulating(false);
    }
  };

  // Helper for quick triggers
  const triggerQuickSimulation = async (level: "INFO" | "WARN" | "ERROR" | "DEBUG", mod: string, msg: string, details: string) => {
    try {
      await Logger.sendLog(level, mod, msg, details);
      await fetchLogs();
    } catch (err) {
      console.error("Quick simulation failed:", err);
    }
  };

  // Filter calculations
  const filteredLogs = logs.filter((log) => {
    const matchesLevel = selectedLevel === "ALL" || log.level === selectedLevel;
    const query = search.toLowerCase();
    const matchesSearch =
      log.module.toLowerCase().includes(query) ||
      log.message.toLowerCase().includes(query) ||
      (log.details && log.details.toLowerCase().includes(query));
    return matchesLevel && matchesSearch;
  });

  // Log counts
  const totalCount = logs.length;
  const errorCount = logs.filter((l) => l.level === "ERROR").length;
  const warnCount = logs.filter((l) => l.level === "WARN").length;
  const infoCount = logs.filter((l) => l.level === "INFO").length;
  const debugCount = logs.filter((l) => l.level === "DEBUG").length;

  // Health assessment
  const healthIndex = totalCount === 0
    ? "OPTIMAL"
    : errorCount > 15
    ? "DEGRADED"
    : errorCount > 5
    ? "ATTENTION REQUIRED"
    : "OPTIMAL";

  const healthColorClass = healthIndex === "OPTIMAL"
    ? "text-emerald-400 bg-emerald-950/40 border-emerald-900/30"
    : healthIndex === "ATTENTION REQUIRED"
    ? "text-amber-400 bg-amber-950/40 border-amber-900/30"
    : "text-rose-400 bg-rose-950/40 border-rose-900/30";

  // Module frequency mapping
  const moduleCounts: Record<string, number> = {};
  logs.forEach((log) => {
    if (log.level === "ERROR") {
      moduleCounts[log.module] = (moduleCounts[log.module] || 0) + 1;
    }
  });

  // If testing unhandled React crash
  if (triggerCrash) {
    throw new Error("Demonstration Exception: Simulated unhandled error triggered from the System Logs dashboard.");
  }

  return (
    <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 space-y-6 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="border-b border-zinc-850 pb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-mono font-black text-slate-200 uppercase tracking-tight">
              Aggregated Failure & Diagnostics Control
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated system failures, warnings, and unhandled rendering exceptions across all modules. Underpinned by SQLite-backed persistent logging channels.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start font-mono text-[10px]">
          <span className={`font-bold border px-2 py-1 rounded tracking-wide ${healthColorClass}`}>
            STATUS: {healthIndex}
          </span>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-750 text-slate-300 px-3 py-1.5 rounded-lg border border-zinc-700/60 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
        <div className="bg-zinc-950/40 p-3.5 border border-zinc-850 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Aggregated Logs</span>
            <span className="text-base font-black text-slate-200 block">{totalCount}</span>
          </div>
          <Layers className="w-5 h-5 text-indigo-400/70" />
        </div>

        <div className="bg-zinc-950/40 p-3.5 border border-zinc-850 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Failures (Errors)</span>
            <span className={`text-base font-black block ${errorCount > 0 ? "text-red-400" : "text-slate-400"}`}>
              {errorCount}
            </span>
          </div>
          <AlertCircle className={`w-5 h-5 ${errorCount > 0 ? "text-red-400/80 animate-pulse" : "text-slate-500/70"}`} />
        </div>

        <div className="bg-zinc-950/40 p-3.5 border border-zinc-850 rounded-xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">System Warnings</span>
            <span className={`text-base font-black block ${warnCount > 0 ? "text-amber-400" : "text-slate-400"}`}>
              {warnCount}
            </span>
          </div>
          <AlertTriangle className={`w-5 h-5 ${warnCount > 0 ? "text-amber-400/80" : "text-slate-500/70"}`} />
        </div>

        <div className="bg-zinc-950/40 p-3.5 border border-zinc-850 rounded-xl flex items-center justify-between col-span-1">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">System Infos</span>
            <span className="text-base font-black text-slate-400 block">{infoCount}</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-500/70" />
        </div>

        <div className="bg-zinc-950/40 p-3.5 border border-zinc-850 rounded-xl flex items-center justify-between col-span-2 lg:col-span-1">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Debug Flags</span>
            <span className="text-base font-black text-slate-400 block">{debugCount}</span>
          </div>
          <Cpu className="w-5 h-5 text-purple-400/70" />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Left Column: Logs Stream & Filters (7 cols) */}
        <div className="xl:col-span-8 space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/30 p-3 border border-zinc-850 rounded-xl font-mono">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Filter by Module, Message, Stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-slate-200 pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-indigo-600 transition-all font-mono"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-500" /> LEVEL:
              </span>
              <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-[9px] font-bold">
                {["ALL", "INFO", "WARN", "ERROR", "DEBUG"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-2 py-1 rounded cursor-pointer transition-all ${
                      selectedLevel === lvl
                        ? "bg-indigo-650 text-slate-100 font-extrabold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Trash/Clear */}
              <button
                onClick={handleClearLogs}
                className="bg-red-950/30 hover:bg-red-900/30 text-red-400 p-2 rounded-lg border border-red-900/30 hover:border-red-800/40 transition-all cursor-pointer"
                title="Wipe Logs SQLite Table"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Logs Terminal Output */}
          <div className="border border-zinc-850 rounded-xl bg-zinc-950 overflow-hidden shadow-inner flex flex-col h-[400px]">
            
            <div className="bg-zinc-900/80 border-b border-zinc-850 px-4 py-2.5 flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> TELEMETRY DATA FEED
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-0 w-3 h-3 cursor-pointer"
                  />
                  <span>AUTO-REFRESH (5s)</span>
                </label>
                <span className="text-slate-500">showing {filteredLogs.length} matching rows</span>
              </div>
            </div>

            {/* Stream */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-[11px] leading-relaxed scrollbar-thin">
              {filteredLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-12">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/75 animate-bounce" />
                  <p>Zero unhandled exceptions or logging records enregistered matching current filter.</p>
                </div>
              ) : (
                filteredLogs.map((log) => {
                  let rowColor = "text-slate-350 hover:bg-zinc-900/50";
                  let tagColor = "bg-zinc-900 border-zinc-800 text-slate-400";
                  if (log.level === "ERROR") {
                    rowColor = "text-red-350 bg-red-950/5 hover:bg-red-950/10 border border-red-950/30";
                    tagColor = "bg-red-950/60 border-red-900/40 text-red-400 font-bold";
                  } else if (log.level === "WARN") {
                    rowColor = "text-amber-350 bg-amber-950/5 hover:bg-amber-950/10 border border-amber-950/20";
                    tagColor = "bg-amber-950/60 border-amber-900/40 text-amber-400 font-bold";
                  } else if (log.level === "DEBUG") {
                    rowColor = "text-purple-350 hover:bg-zinc-900/50";
                    tagColor = "bg-purple-950/40 border-purple-900/30 text-purple-400 font-bold";
                  }

                  const isSelected = activeDetailId === log.id;

                  return (
                    <div key={log.id} className="space-y-1">
                      <div
                        onClick={() => setActiveDetailId(isSelected ? null : log.id)}
                        className={`flex items-start gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all ${rowColor} ${
                          isSelected ? "bg-indigo-950/20 border border-indigo-900/30 shadow-sm" : ""
                        }`}
                      >
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase shrink-0 ${tagColor}`}>
                          {log.level}
                        </span>
                        
                        <span className="text-slate-500 shrink-0 text-[10px]">
                          {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "--:--:--"}
                        </span>
                        
                        <span className="text-indigo-400 font-bold shrink-0 bg-indigo-950/30 border border-indigo-900/20 px-1 py-0.2 rounded text-[10px]">
                          {log.module}
                        </span>
                        
                        <span className="flex-1 truncate">{log.message}</span>

                        <ChevronRight className={`w-3.5 h-3.5 text-slate-500 shrink-0 self-center transition-all ${
                          isSelected ? "rotate-90 text-indigo-400" : ""
                        }`} />
                      </div>

                      {/* Expandable Trace Details */}
                      {isSelected && (
                        <div className="mx-3 my-1 p-3 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3 shadow-inner text-[10px]">
                          <div className="grid grid-cols-2 gap-2 text-slate-400 border-b border-zinc-900 pb-2">
                            <div>
                              <span className="text-slate-500 font-bold block uppercase text-[8px]">LOG_UUID</span>
                              <span className="font-mono">{log.id}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-bold block uppercase text-[8px]">EXACT_TIMESTAMP</span>
                              <span className="font-mono">{log.timestamp ? new Date(log.timestamp).toISOString() : "Unknown"}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block uppercase text-[8px] mb-1">PAYLOAD DETAIL STACK</span>
                            <pre className="p-3 bg-zinc-900 rounded-lg text-slate-300 overflow-x-auto whitespace-pre-wrap select-text selection:bg-indigo-950 font-mono text-[10px] border border-zinc-800 leading-normal max-h-56">
                              {log.details || "No secondary metadata or stack trace payload enregistered."}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Simulators & Module Health Metrics (4 cols) */}
        <div className="xl:col-span-4 space-y-4">
          
          {/* Module Heatmap Breakdown */}
          <div className="bg-zinc-950/40 p-4 border border-zinc-850 rounded-xl space-y-3 font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block border-b border-zinc-850 pb-2">
              Failure Concentration Mapping
            </span>

            {Object.keys(moduleCounts).length === 0 ? (
              <p className="text-[10px] text-slate-500 italic py-2">
                All module diagnostics registering 100% active health. No errors recorded in database.
              </p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(moduleCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([mod, count]) => {
                    const percentage = Math.min(100, (count / errorCount) * 100);
                    return (
                      <div key={mod} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-indigo-400 font-bold">{mod}</span>
                          <span className="text-red-400 font-bold">{count} {count === 1 ? "failure" : "failures"}</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-red-600 to-amber-500 h-1.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Quick Simulation Dock */}
          <div className="bg-zinc-950/40 p-4 border border-zinc-850 rounded-xl space-y-4 font-sans">
            <div className="border-b border-zinc-850 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider block">
                Fail-Safe Regression Simulators
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Trigger simulated anomalies directly to test database state aggregation and automated alerting metrics.
              </p>
            </div>

            {/* Custom Simulator Form */}
            <div className="space-y-3 font-mono text-[11px]">
              
              {/* Module select */}
              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[9px] font-bold block">Target System Layer</label>
                <select
                  value={simModule}
                  onChange={(e) => setSimModule(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-slate-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600 font-mono"
                >
                  <option value="AIRouter">AI Router Interface</option>
                  <option value="OllamaCommandCenter">Ollama Llama3 Runner</option>
                  <option value="StoryForge">StoryForge Generator</option>
                  <option value="VideoCreator">FFmpeg Factory Engine</option>
                  <option value="BossListers">BossListers Sync Node</option>
                  <option value="DeploymentCenter">Cloud Run Ingress Gateway</option>
                  <option value="EventBusCore">Empire OS Core Event Bus</option>
                </select>
              </div>

              {/* Level & Message */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 space-y-1">
                  <label className="text-slate-400 uppercase text-[9px] font-bold block">Alert Level</label>
                  <select
                    value={simLevel}
                    onChange={(e) => setSimLevel(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-850 text-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-600 font-mono"
                  >
                    <option value="INFO">INFO</option>
                    <option value="WARN">WARN</option>
                    <option value="ERROR">ERROR</option>
                    <option value="DEBUG">DEBUG</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-slate-400 uppercase text-[9px] font-bold block">Anomaly Statement</label>
                  <input
                    type="text"
                    value={simMessage}
                    onChange={(e) => setSimMessage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 text-slate-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              {/* Simulate button */}
              <button
                onClick={handleSimulateLog}
                disabled={simulating}
                className="w-full bg-indigo-600 hover:bg-indigo-550 text-slate-100 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PERSIST SIMULATED FAILURE</span>
              </button>

            </div>

            {/* Quick Presets Grid */}
            <div className="border-t border-zinc-850 pt-3 space-y-2 font-mono">
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Scenario Presets</span>
              
              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                <button
                  onClick={() => triggerQuickSimulation(
                    "ERROR",
                    "BossListers",
                    "Database lock occurred during active Shopify sync.",
                    "Transaction Timeout: SQLITE_BUSY: database is locked.\nAttempting auto-unlock cycle..."
                  )}
                  className="bg-zinc-950 hover:bg-zinc-850/75 border border-zinc-850 text-slate-350 p-2 rounded text-left transition-all cursor-pointer"
                >
                  ⚠️ Shopify Sync Lock
                </button>

                <button
                  onClick={() => triggerQuickSimulation(
                    "WARN",
                    "OllamaCommandCenter",
                    "Local host url (11434) slow lookup latency (2400ms).",
                    "Checking connection robustness over virtual ethernet docker gateway adapter."
                  )}
                  className="bg-zinc-950 hover:bg-zinc-850/75 border border-zinc-850 text-slate-350 p-2 rounded text-left transition-all cursor-pointer"
                >
                  🐌 Ollama Latency
                </button>

                <button
                  onClick={() => triggerQuickSimulation(
                    "ERROR",
                    "DeploymentCenter",
                    "Cloud Run build error: Vite static assets directory not found.",
                    "Build phase exited with code 1. Output directory dist/ was empty."
                  )}
                  className="bg-zinc-950 hover:bg-zinc-850/75 border border-zinc-850 text-slate-350 p-2 rounded text-left transition-all cursor-pointer"
                >
                  🚫 Build Failure
                </button>

                <button
                  onClick={() => triggerQuickSimulation(
                    "INFO",
                    "StoryForge",
                    "Successfully compiled 3 parallel script paths.",
                    "Funnels optimized: Standard-Sweat Equity path selected."
                  )}
                  className="bg-zinc-950 hover:bg-zinc-850/75 border border-zinc-850 text-slate-350 p-2 rounded text-left transition-all cursor-pointer"
                >
                  🚀 StoryForge Succ
                </button>
              </div>
            </div>

            {/* Critical Crash trigger (React Error Boundary Demonstration) */}
            <div className="border-t border-zinc-850 pt-3 bg-red-950/10 border border-red-950/30 p-3 rounded-lg space-y-2 font-sans">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-[10px] font-mono text-red-300 font-bold uppercase">React UI Crash Test</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Trigger a native JavaScript exception inside the dashboard tree. This forces the central Error Boundary to arrest the thread, log the component stack trace to the DB, and reveal the diagnostic recovery panel.
              </p>
              <button
                onClick={() => setTriggerCrash(true)}
                className="w-full bg-red-950/60 hover:bg-red-900/40 text-red-300 py-1.5 rounded border border-red-900/30 text-[10px] font-mono font-bold transition-all cursor-pointer"
              >
                💥 EMIT NATIVE UI CRASH EXCEPTION
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
