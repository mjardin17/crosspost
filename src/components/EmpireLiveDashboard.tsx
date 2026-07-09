import React, { useState, useEffect } from "react";
import {
  Terminal, Server, Cpu, Play, Shield, RefreshCw, CheckCircle2, AlertTriangle, 
  Bot, Calendar, Copy, Check, FileText, ArrowRight, Video, Cloud, ExternalLink,
  Activity, Circle, Radio, Sparkles
} from "lucide-react";

interface Episode {
  id: string;
  name: string;
  filename: string;
  exists: boolean;
  size_mb: number;
  status: string;
  last_modified: string | null;
}

interface BotState {
  id: string;
  name: string;
  role: string;
  health: number;
  status: string;
  lastHeartbeat: string;
  logs: string[];
}

interface AdPost {
  id: number;
  day: string;
  platform: string;
  time: string;
  status: "Published" | "Scheduled" | "Draft";
  title: string;
  niche: string;
  engagement?: number;
}

export default function EmpireLiveDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Live State
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [bots, setBots] = useState<BotState[]>([]);
  const [scheduleSummary, setScheduleSummary] = useState({ published: 0, scheduled: 0, drafts: 0 });
  const [adsSchedule, setAdsSchedule] = useState<AdPost[]>([]);
  const [claudeMd, setClaudeMd] = useState<string>("");
  const [agentMemory, setAgentMemory] = useState<string>("");
  const [handoffBlock, setHandoffBlock] = useState<string>("");

  // UI Interactive States
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [scheduleFilter, setScheduleFilter] = useState<string>("All");
  const [platformFilter, setPlatformFilter] = useState<string>("All");
  const [copiedHandoff, setCopiedHandoff] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM] Connection to live Empire OS API channel verified.",
    "[SYSTEM] Ingress: Active on port 3000."
  ]);
  const [executingUploader, setExecutingUploader] = useState<boolean>(false);
  const [executingRender, setExecutingRender] = useState<boolean>(false);

  // Fetch the current state from server
  const fetchSystemState = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await fetch("/api/live-dashboard/state");
      if (!res.ok) throw new Error("Could not retrieve system telemetry state.");
      const data = await res.json();
      if (data.success) {
        setEpisodes(data.episodes);
        setBots(data.bots);
        setScheduleSummary(data.schedule_summary);
        setAdsSchedule(data.ads_schedule);
        setClaudeMd(data.claude_md);
        setAgentMemory(data.agent_memory);
        setHandoffBlock(data.handoff_block);
      } else {
        throw new Error(data.error || "Unknown server state error.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred while loading system state.");
      setTerminalLogs(prev => [`[ERROR] State fetch failed: ${err?.message}`, ...prev]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystemState();
    
    // Auto-poll state every 20 seconds to keep metrics updated
    const interval = setInterval(() => {
      fetchSystemState(true);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Trigger channel_uploader.py via backend
  const handleRunUploader = async () => {
    if (executingUploader) return;
    setExecutingUploader(true);
    setTerminalLogs(prev => ["[COMMAND] Initiating: python channel_uploader.py --channel gg --verify", ...prev]);

    try {
      const res = await fetch("/api/live-dashboard/run-uploader", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setTerminalLogs(prev => [
          `[SUCCESS] channel_uploader execution completed.`,
          ...data.logs.map((log: string) => `[UPLOADER] ${log}`).reverse(),
          ...prev
        ]);
        // Refresh state
        await fetchSystemState(true);
      } else {
        throw new Error(data.error || "Script failed.");
      }
    } catch (err: any) {
      setTerminalLogs(prev => [
        `[FAILURE] Verification trigger crashed: ${err?.message}`,
        ...prev
      ]);
    } finally {
      setExecutingUploader(false);
    }
  };

  // Trigger render_ep006.bat via backend
  const handleRenderEP006 = async () => {
    if (executingRender) return;
    setExecutingRender(true);
    setTerminalLogs(prev => ["[COMMAND] Triggered sequential build: render_ep006.bat", ...prev]);

    try {
      const res = await fetch("/api/live-dashboard/render-ep006", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setTerminalLogs(prev => [
          `[SUCCESS] render_ep006.bat built sequentially! EP006_final.mp4 saved on disk.`,
          ...data.logs.map((log: string) => `[RENDER ENGINE] ${log}`).reverse(),
          ...prev
        ]);
        // Force refresh state immediately to trigger UI update (EP006 turning Green)
        await fetchSystemState(true);
      } else {
        throw new Error(data.error || "Render script reported failure.");
      }
    } catch (err: any) {
      setTerminalLogs(prev => [
        `[FAILURE] Render compilation crashed: ${err?.message}`,
        ...prev
      ]);
    } finally {
      setExecutingRender(false);
    }
  };

  // Copy Handoff block to Clipboard
  const handleCopyHandoff = () => {
    navigator.clipboard.writeText(handoffBlock).then(() => {
      setCopiedHandoff(true);
      setTerminalLogs(prev => ["[SYSTEM] Copied AGENT HAND-OFF block to host clipboard.", ...prev]);
      setTimeout(() => setCopiedHandoff(false), 2500);
    });
  };

  // Filter ads schedule list
  const filteredAds = adsSchedule.filter((ad) => {
    const statusMatch = scheduleFilter === "All" || ad.status === scheduleFilter;
    const platformMatch = platformFilter === "All" || ad.platform.toLowerCase() === platformFilter.toLowerCase();
    return statusMatch && platformMatch;
  });

  return (
    <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-6 space-y-8 animate-fade-in font-sans">
      
      {/* 1. Dashboard Top Hub Header */}
      <div className="border-b border-zinc-850 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded">
              Empire Live System
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Handshake established
            </span>
          </div>
          <h2 className="text-base font-mono font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-400" />
            Sovereign Command Console
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Live infrastructure dashboard reporting on rendered video assets, active self-healing bots, weekly social scheduling, and autonomous handoffs.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchSystemState()}
            disabled={refreshing || loading}
            className="p-2 bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 text-slate-350 rounded-lg transition-all text-xs font-mono font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
            <span>{refreshing ? "SYNCING..." : "SYNC STATE"}</span>
          </button>
          <div className="bg-zinc-950 border border-zinc-850 text-[10px] font-mono px-3.5 py-2 rounded-lg flex items-center gap-2 text-slate-400">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span>PORT: <strong className="text-emerald-400">3000</strong></span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-4 font-mono text-xs text-zinc-500">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <span>Synchronizing live file structures & system states...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-950/20 border border-rose-900/35 rounded-lg text-rose-400 space-y-4 font-sans">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
            <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
            <span>Ingress Telemetry Error</span>
          </div>
          <p className="text-xs leading-relaxed">{error}</p>
          <button
            onClick={() => fetchSystemState()}
            className="bg-rose-950 hover:bg-rose-900 border border-rose-900 text-rose-200 font-mono text-xs py-1.5 px-3 rounded"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SUB-GRID: Video Pipeline, Council, Actions (8 cols on XL) */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* WIDGET 1: Pipeline status panel (Episode Status) */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4.5 h-4.5 text-zinc-400" />
                  <span className="text-xs font-mono font-black text-slate-200 uppercase tracking-tight">
                    Pipeline Render Status Panel
                  </span>
                </div>
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/50 border border-indigo-900/30 px-2 py-0.5 rounded">
                  renders/ Folder Scan
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className={`p-3.5 rounded-lg border flex flex-col justify-between gap-3.5 transition-all ${
                      ep.exists
                        ? "bg-emerald-950/10 border-emerald-900/30 text-emerald-400"
                        : "bg-rose-950/10 border-rose-900/30 text-rose-400"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-xs font-mono tracking-tight text-slate-100 uppercase">{ep.id}</strong>
                          <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded ${
                            ep.exists
                              ? "bg-emerald-950 border border-emerald-900 text-emerald-400"
                              : "bg-rose-950 border border-rose-900 text-rose-400"
                          }`}>
                            {ep.exists ? "RENDERED" : "PENDING"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans line-clamp-1">{ep.name}</p>
                      </div>
                      <Circle className={`w-3 h-3 ${ep.exists ? "fill-emerald-500 text-emerald-500" : "fill-rose-500 text-rose-500 animate-pulse"}`} />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 border-t border-zinc-900/40 pt-2.5">
                      <span className="truncate max-w-[150px]">{ep.filename}</span>
                      <strong className="text-slate-350">{ep.exists ? `${ep.size_mb.toFixed(1)} MB` : "0.0 MB"}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WIDGET 6: One button: Render EP006 Action Hub */}
            <div className="bg-gradient-to-b from-zinc-950 to-zinc-950/80 border border-zinc-850 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                  <span className="text-xs font-mono font-black text-slate-200 uppercase tracking-tight">
                    Sovereign Render Module
                  </span>
                </div>
                <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-950 border border-indigo-900/40 px-2 py-0.5 rounded">
                  FFmpeg Core
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-5 items-center justify-between bg-zinc-900/30 p-4 rounded-lg border border-zinc-850/50">
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Target Selection: EP006</span>
                  </div>
                  <h4 className="text-xs font-mono font-bold text-slate-200">Episode 6: Autonomous Systems & AI Architecture</h4>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Runs the real-time execution script <code className="text-indigo-400 font-mono font-bold bg-zinc-950 px-1 py-0.5 rounded">render_ep006.bat</code> inside the container environment. Re-synthesizes speech streams, resolves video assets on the workspace, and exports the final MP4 file directly onto disk.
                  </p>
                </div>

                <button
                  onClick={handleRenderEP006}
                  disabled={executingRender || executingUploader}
                  className={`w-full md:w-auto px-5 py-3 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    episodes.find(e => e.id === "EP006")?.exists
                      ? "bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-950/50"
                      : "bg-indigo-650 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 cursor-pointer active:scale-95"
                  }`}
                >
                  <Play className={`w-4 h-4 ${executingRender ? "animate-spin" : ""}`} />
                  <span>
                    {executingRender ? "RENDERING..." : episodes.find(e => e.id === "EP006")?.exists ? "RE-RENDER EP006" : "RENDER EP006 NOW"}
                  </span>
                </button>
              </div>
            </div>

            {/* WIDGET 3: Council status panel (9 self-healing bots) */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4.5 h-4.5 text-zinc-400" />
                  <span className="text-xs font-mono font-black text-slate-200 uppercase tracking-tight">
                    Sovereign Council Bot Health Monitor
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500">
                  9 Self-Healing Agents Live
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bots.map((bot) => (
                  <div
                    key={bot.id}
                    onClick={() => setSelectedBotId(selectedBotId === bot.id ? null : bot.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedBotId === bot.id
                        ? "bg-indigo-950/20 border-indigo-500/50 shadow-md"
                        : "bg-zinc-900/40 border-zinc-850 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-mono font-bold text-zinc-500 block uppercase">
                        {bot.role}
                      </span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>

                    <h4 className="text-xs font-mono font-black text-slate-100 uppercase tracking-tight mt-1 truncate">
                      {bot.name}
                    </h4>

                    <div className="flex justify-between items-center text-[10px] font-mono mt-3 text-slate-400">
                      <span>Status: <strong className="text-emerald-400 text-[9px]">{bot.status}</strong></span>
                      <span className={`font-bold ${bot.health >= 98 ? "text-emerald-400" : "text-amber-400"}`}>
                        {bot.health}% HP
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expandable sub-logs panel for selected bot */}
              {selectedBotId && (() => {
                const b = bots.find(bot => bot.id === selectedBotId);
                if (!b) return null;
                return (
                  <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-850 space-y-3.5 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono font-black text-indigo-400 uppercase tracking-wider block">
                          Internal Diagnostic Logs
                        </span>
                        <h5 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-tight">
                          {b.name} ({b.role})
                        </h5>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">
                        Heartbeat: {b.lastHeartbeat}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-350 space-y-1.5 bg-zinc-950 p-3 rounded border border-zinc-850/60 max-h-32 overflow-y-auto">
                      {b.logs.map((log, index) => (
                        <div key={index} className="leading-relaxed">
                          <span className="text-indigo-400 select-none mr-1.5">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* WIDGET 4: Weekly Ad Schedule grid (56 posts) */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-zinc-900 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-zinc-400" />
                  <span className="text-xs font-mono font-black text-slate-200 uppercase tracking-tight">
                    Weekly Advertising Schedule Viewer
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded">
                  56 Posts Loaded
                </span>
              </div>

              {/* Status and Platform Summary Bar */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-mono bg-zinc-900/30 p-2 rounded border border-zinc-850/50">
                <div className="bg-zinc-950 p-2 rounded border border-zinc-850/40">
                  <span className="text-zinc-500 block uppercase text-[8px]">Published</span>
                  <span className="text-sm font-bold text-emerald-400">{scheduleSummary.published}</span>
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-850/40">
                  <span className="text-zinc-500 block uppercase text-[8px]">Scheduled</span>
                  <span className="text-sm font-bold text-indigo-400">{scheduleSummary.scheduled}</span>
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-850/40">
                  <span className="text-zinc-500 block uppercase text-[8px]">Drafts</span>
                  <span className="text-sm font-bold text-slate-450">{scheduleSummary.drafts}</span>
                </div>
              </div>

              {/* Search / Filter Control */}
              <div className="flex flex-wrap gap-2.5 items-center justify-between text-xs pt-1.5">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase mr-1">Status:</span>
                  {["All", "Published", "Scheduled", "Draft"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setScheduleFilter(status)}
                      className={`px-2.5 py-1 rounded font-mono text-[9px] font-bold cursor-pointer transition-all ${
                        scheduleFilter === status
                          ? "bg-indigo-600 text-white shadow"
                          : "bg-zinc-900 text-zinc-400 border border-zinc-850 hover:bg-zinc-850"
                      }`}
                    >
                      {status.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase mr-1">Channel:</span>
                  {["All", "YouTube", "TikTok", "Instagram", "Twitter", "LinkedIn", "Facebook"].map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setPlatformFilter(plat)}
                      className={`px-2 py-0.5 rounded font-mono text-[8px] font-bold cursor-pointer transition-all ${
                        platformFilter === plat
                          ? "bg-slate-200 text-slate-950"
                          : "bg-zinc-900 text-zinc-500 border border-zinc-850 hover:bg-zinc-850"
                      }`}
                    >
                      {plat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive Schedule Grid list */}
              <div className="border border-zinc-850/60 rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-zinc-950/40">
                <table className="w-full text-left text-[10px] font-mono">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[8px] border-b border-zinc-850 sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3">Day</th>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Platform</th>
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {filteredAds.map((ad) => (
                      <tr key={ad.id} className="hover:bg-zinc-900/50 transition-colors text-slate-300">
                        <td className="py-2 px-3 font-bold text-slate-200">{ad.day}</td>
                        <td className="py-2 px-3 text-zinc-500">{ad.time}</td>
                        <td className="py-2 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-tight ${
                            ad.platform === "YouTube" ? "bg-red-950/30 text-red-400 border border-red-900/20" :
                            ad.platform === "TikTok" ? "bg-cyan-950/30 text-cyan-400 border border-cyan-900/20" :
                            ad.platform === "Instagram" ? "bg-pink-950/30 text-pink-400 border border-pink-900/20" :
                            ad.platform === "Twitter" ? "bg-indigo-950/30 text-indigo-400 border border-indigo-900/20" :
                            ad.platform === "LinkedIn" ? "bg-sky-950/30 text-sky-400 border border-sky-900/20" :
                            "bg-blue-950/30 text-blue-400 border border-blue-900/20"
                          }`}>
                            {ad.platform}
                          </span>
                        </td>
                        <td className="py-2 px-3 truncate max-w-[150px] sm:max-w-[280px]" title={ad.title}>
                          {ad.title}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            ad.status === "Published" ? "text-emerald-400" :
                            ad.status === "Scheduled" ? "text-indigo-400" :
                            "text-slate-500"
                          }`}>
                            <span className={`h-1 w-1 rounded-full ${
                              ad.status === "Published" ? "bg-emerald-400" :
                              ad.status === "Scheduled" ? "bg-indigo-400" :
                              "bg-slate-500"
                            }`} />
                            {ad.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredAds.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-500 text-xs italic">
                          No scheduled posts match the selected filter combination.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR PANEL: Upload Queue, Telemetry terminal, Handoff (4 cols on XL) */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* WIDGET 2: Upload queue controller */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4.5 h-4.5 text-indigo-400" />
                  <span className="text-xs font-mono font-black text-slate-200 uppercase tracking-tight">
                    Multiplatform Upload Queue
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500">
                  channel_uploader.py
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-zinc-900/50 p-3 rounded border border-zinc-850 text-[11px] space-y-2 font-sans">
                  <span className="text-[8px] font-mono font-black text-indigo-400 uppercase tracking-wider block">
                    Queue Configuration Parameters
                  </span>
                  <div className="space-y-1 text-slate-350">
                    <p className="flex justify-between">
                      <span>Active Channel Target:</span>
                      <strong className="text-slate-100 font-mono">gg (Gods Glory)</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Validation Flag:</span>
                      <strong className="text-amber-400 font-mono">--verify</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Queue Inbound State:</span>
                      <strong className="text-emerald-400 font-mono">STANDBY_OK</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRunUploader}
                  disabled={executingUploader || executingRender}
                  className="w-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-slate-100 font-mono font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${executingUploader ? "animate-spin text-indigo-400" : ""}`} />
                  <span>
                    {executingUploader ? "VERIFYING UPLOADER..." : "RUN VERIFICATION & UPLOAD"}
                  </span>
                </button>
              </div>
            </div>

            {/* WIDGET 5: Handoff block generator */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-zinc-400" />
                  <span className="text-xs font-mono font-black text-slate-200 uppercase tracking-tight">
                    Handoff Block Generator
                  </span>
                </div>
                <button
                  onClick={handleCopyHandoff}
                  className="text-[9px] font-mono text-indigo-400 hover:underline hover:text-indigo-300 transition-all cursor-pointer"
                >
                  {copiedHandoff ? "Copied!" : "Copy Code"}
                </button>
              </div>

              <div className="space-y-3.5">
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  The Sovereign Hand-off Block is compiled dynamically in real-time by inspecting file states on disk, CLAUDE.md status logs, and council sub-agent parameters.
                </p>

                <div className="relative group">
                  <textarea
                    readOnly
                    value={handoffBlock}
                    className="w-full h-44 bg-zinc-950 border border-zinc-850 rounded-lg p-3 text-[9px] font-mono text-emerald-400 focus:outline-none resize-none leading-normal font-medium shadow-inner"
                  />
                  
                  <button
                    onClick={handleCopyHandoff}
                    className="absolute bottom-3 right-3 p-1.5 rounded-md bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer shadow"
                    title="Copy Handoff Block"
                  >
                    {copiedHandoff ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* DYNAMIC TELEMETRY TERMINAL (Console logs from scripts) */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-3">
              <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-wider block border-b border-zinc-900 pb-1.5">
                Terminal Telemetry Feed
              </span>
              <div className="h-44 bg-zinc-950 font-mono text-[9px] text-slate-450 p-3 rounded border border-zinc-850/60 overflow-y-auto space-y-1.5 shadow-inner">
                {terminalLogs.map((log, index) => (
                  <div key={index} className="leading-normal break-all">
                    <span className="text-indigo-500 mr-1.5 font-bold select-none">&gt;&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
