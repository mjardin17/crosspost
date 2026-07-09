import React, { useState, useEffect } from "react";
import { Code, Copy, Check, Terminal, Cpu, Sparkles, AlertCircle, RefreshCw, Layers, ShieldCheck, ExternalLink, Clock, Send, Activity, Play } from "lucide-react";

interface Props {
  handleCopy: (text: string, id: string) => void;
  copiedText: string | null;
}

export default function ClaudeDesktopConnectPanel({ handleCopy, copiedText }: Props) {
  const [simulatedPrompt, setSimulatedPrompt] = useState<string>("Analyze the shopify sync lock exception and heal it instantly");
  const [outputConsole, setOutputConsole] = useState<string[]>([]);
  const [runningSim, setRunningSim] = useState<boolean>(false);

  // Dynamic Plugin States
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loadingPlugins, setLoadingPlugins] = useState<boolean>(true);
  const [pluginFormVisible, setPluginFormVisible] = useState<boolean>(false);
  const [newFilename, setNewFilename] = useState<string>("custom_analyzer.js");
  const [newCode, setNewCode] = useState<string>(`module.exports = {
  name: "custom_analyzer",
  description: "A custom Claude plugin that performs specialized analysis.",
  inputSchema: {
    type: "object",
    properties: {
      targetPath: { type: "string", description: "Target directory or file path" }
    },
    required: ["targetPath"]
  },
  async execute(args, helpers) {
    const { targetPath } = args;
    const { fs, path } = helpers;
    
    // Example logic
    return {
      status: "success",
      targetPath,
      exists: fs.existsSync(targetPath)
    };
  }
};`);

  const fetchPlugins = async () => {
    setLoadingPlugins(true);
    try {
      const res = await fetch("/api/plugins");
      const data = await res.json();
      if (data.success) {
        setPlugins(data.plugins || []);
      }
    } catch (err) {
      console.error("Error fetching plugins:", err);
    } finally {
      setLoadingPlugins(false);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  const handleCreatePlugin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/plugins/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: newFilename, code: newCode })
      });
      const data = await res.json();
      if (data.success) {
        setPluginFormVisible(false);
        fetchPlugins();
      } else {
        alert(data.error || "Failed to save plugin");
      }
    } catch (err) {
      console.error("Error creating plugin:", err);
    }
  };

  const handleDeletePlugin = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;
    try {
      const res = await fetch("/api/plugins/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename })
      });
      const data = await res.json();
      if (data.success) {
        fetchPlugins();
      } else {
        alert(data.error || "Failed to delete plugin");
      }
    } catch (err) {
      console.error("Error deleting plugin:", err);
    }
  };

  const mcpConfig = `{
  "mcpServers": {
    "empire-os-sentinel": {
      "command": "node",
      "args": ["${typeof window !== 'undefined' ? '/absolute/path/to/project' : '.'}/empire-mcp.js"],
      "env": {
        "EMPIRE_API_URL": "https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app"
      }
    }
  }
}`;

  const pythonSnippet = `import requests

EMPIRE_URL = "https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app"

# 1. Fetch system anomalies
logs = requests.get(f"{EMPIRE_URL}/api/system/logs").json()
unresolved_errors = [l for l in logs if l["level"] == "ERROR"]

if unresolved_errors:
    print(f"Detected {len(unresolved_errors)} system anomalies!")
    latest_error = unresolved_errors[0]
    
    # 2. Trigger active AI self-healing hotpatch
    print(f"Triggering healing sequence for Log ID: {latest_error['id']}...")
    remediation = requests.post(f"{EMPIRE_URL}/api/system/heal", json={
        "logId": latest_error["id"]
    }).json()
    
    print("Diagnosis Completed:")
    print(remediation.get("diagnosis", "No diagnosis provided."))
else:
    print("System is running optimally! 100% health.")
`;

  const runSimulateMcp = () => {
    setRunningSim(true);
    setOutputConsole([]);
    
    let steps = [];
    const promptLower = simulatedPrompt.toLowerCase();
    if (promptLower.includes("olympus") || promptLower.includes("little") || promptLower.includes("toddler")) {
      steps = [
        "Connecting to Empire OS API: https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app",
        "Claude Desktop sent JSON-RPC: initialize",
        "Empire Bridge replied with version 1.0.0 & 12 tools registered successfully.",
        "Claude Desktop sent JSON-RPC: tools/call { name: 'generate_little_olympus_episode', arguments: { episode: 1, title: 'Baby Zeus Learns to Share His Thunder' } }",
        "Running native sub-process: python3 little_olympus_controller.py --action episode --episode 1",
        "🌥️ Little Olympus Controller Ready (Toddler Gods Edition)",
        "✅ Little Olympus Episode Generated: scene_prompts.LO_EP001.final.json",
        "SUCCESS: prompts/little_olympus/scene_prompts.LO_EP001.final.json",
        "MCP execution completed in 0.72s. Toddler episode assets written."
      ];
    } else if (promptLower.includes("glory") || promptLower.includes("episode") || promptLower.includes("batch")) {
      steps = [
        "Connecting to Empire OS API: https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app",
        "Claude Desktop sent JSON-RPC: initialize",
        "Empire Bridge replied with version 1.0.0 & 12 tools registered successfully.",
        "Claude Desktop sent JSON-RPC: tools/call { name: 'generate_gods_glory_episode', arguments: { episode: 26, title: 'Epic Rise' } }",
        "Running native sub-process: python3 gods_glory_controller.py --action episode --episode 26 --title 'Epic Rise'",
        "🤖 Gods & Glory Controller Ready for Claude",
        "✅ Generated scene_prompts.GG_EP026.final.json",
        "SUCCESS: prompts/gods_glory/scene_prompts.GG_EP026.final.json",
        "MCP execution completed in 0.84s. Scene prompt assets written."
      ];
    } else if (promptLower.includes("crosspost") || promptLower.includes("inventory") || promptLower.includes("queue")) {
      steps = [
        "Connecting to Empire OS API: https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app",
        "Claude Desktop sent JSON-RPC: initialize",
        "Empire Bridge replied with version 1.0.0 & 12 tools registered successfully.",
        "Claude Desktop sent JSON-RPC: tools/call { name: 'get_crossposter_inventory', arguments: { limit: 5 } }",
        "Fetched 5 active items successfully (eBay, Etsy, Shopify integration endpoints active).",
        "Claude Desktop sent JSON-RPC: tools/call { name: 'trigger_crosspost', arguments: { id: 'inv_912', platforms: ['eBay', 'Shopify'] } }",
        "Product cross-posting dispatched. Listings appended to the queue as job_p81ns.",
        "Claude Desktop sent JSON-RPC: tools/call { name: 'process_crossposter_queue' }",
        "Executed background worker. 2 listings successfully posted. Queue cleared.",
        "MCP execution completed in 1.10s. Marketplaces synchronized."
      ];
    } else {
      steps = [
        "Connecting to Empire OS API: https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app",
        "Claude Desktop sent JSON-RPC: initialize",
        "Empire Bridge replied with version 1.0.0 & 12 tools registered successfully.",
        "Claude Desktop sent JSON-RPC: tools/call { name: 'get_system_health_and_logs' }",
        "Found 1 warning node: 'Shopify sync lock occurred during active Shopify sync.'",
        "Claude Desktop sent JSON-RPC: tools/call { name: 'trigger_autonomous_healing', arguments: { logId: 'shpf-9192' } }",
        "AI Diagnostics engaged! Running Gemini code synthesis...",
        "HOTPATCH SUCCESS: sqlite_busy lock cleared, retry counter reset.",
        "MCP execution completed in 1.48s. Pipeline healthy."
      ];
    }

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setOutputConsole(prev => [...prev, `[mcp-bridge] ${step}`]);
        if (idx === steps.length - 1) {
          setRunningSim(false);
        }
      }, idx * 450);
    });
  };

  return (
    <div className="space-y-6 font-sans text-slate-300 animate-fade-in">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-950/20 via-zinc-950/20 to-zinc-950/40 border border-emerald-500/20 p-5 rounded-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Code className="w-24 h-24 text-emerald-400" />
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
            Model Context Protocol Ready
          </span>
        </div>
        <h4 className="text-sm font-mono font-black text-slate-200 uppercase tracking-tight">
          Claude Desktop Integration Hub
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          By hooking Claude Desktop into the Empire OS Sentinel pipeline, Claude can monitor your workspace, database logs, and background tasks in real time. It can execute healing hotfixes, repair code compilers, and restore databases directly from its chat interface.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Config & Code (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Step 1: Claude Desktop config */}
          <div className="bg-zinc-950/50 border border-zinc-850 rounded-xl overflow-hidden font-mono text-xs">
            <div className="bg-zinc-900/80 px-4 py-2.5 border-b border-zinc-850 flex items-center justify-between">
              <span className="text-slate-300 font-bold uppercase text-[10px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                1. CLAUDE DESKTOP CONFIGURATION
              </span>
              <button
                onClick={() => handleCopy(mcpConfig, "config")}
                className="text-slate-400 hover:text-slate-200 transition-all cursor-pointer flex items-center gap-1"
              >
                {copiedText === "config" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[9px] text-emerald-400 font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[9px]">COPY SNIPPET</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="p-4 space-y-3 leading-relaxed">
              <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                Add this block to your local <code className="text-slate-200 bg-zinc-900 px-1 py-0.5 rounded font-mono text-[10px]">claude_desktop_config.json</code> (typically found at <code className="text-slate-200 bg-zinc-900 px-1 py-0.5 rounded font-mono text-[10px]">%APPDATA%/Claude/claude_desktop_config.json</code> on Windows or <code className="text-slate-200 bg-zinc-900 px-1 py-0.5 rounded font-mono text-[10px]">~/Library/Application Support/Claude/claude_desktop_config.json</code> on Mac):
              </p>
              
              <pre className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-lg text-slate-300 overflow-x-auto text-[10.5px] leading-relaxed select-all">
                {mcpConfig}
              </pre>

              <div className="text-[10px] text-slate-500 font-sans italic leading-relaxed">
                💡 Note: Replace <code className="font-mono text-slate-400">/absolute/path/to/project</code> with the actual folder path where you downloaded this project repository.
              </div>
            </div>
          </div>

          {/* Step 2: Custom Python/Shell connect */}
          <div className="bg-zinc-950/50 border border-zinc-850 rounded-xl overflow-hidden font-mono text-xs">
            <div className="bg-zinc-900/80 px-4 py-2.5 border-b border-zinc-850 flex items-center justify-between">
              <span className="text-slate-300 font-bold uppercase text-[10px] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                2. AUTOMATED PYTHON TELEMETRY SCRIPT
              </span>
              <button
                onClick={() => handleCopy(pythonSnippet, "python")}
                className="text-slate-400 hover:text-slate-200 transition-all cursor-pointer flex items-center gap-1"
              >
                {copiedText === "python" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[9px] text-emerald-400 font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[9px]">COPY SNIPPET</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="p-4 space-y-3 leading-relaxed">
              <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                If Claude Desktop executes scripts directly in your pipeline, you can use this simple REST bridge script to fetch, parse, and heal systems on a recurring cron job:
              </p>
              
              <pre className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-lg text-indigo-300/90 overflow-x-auto text-[10.5px] leading-normal font-mono select-all max-h-64">
                {pythonSnippet}
              </pre>
            </div>
          </div>

          {/* Step 3: Programmatic Package Exporter */}
          <div className="bg-zinc-950/50 border border-zinc-850 rounded-xl overflow-hidden font-mono text-xs">
            <div className="bg-zinc-900/80 px-4 py-2.5 border-b border-zinc-850 flex items-center justify-between">
              <span className="text-slate-300 font-bold uppercase text-[10px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-pink-400" />
                3. PROGRAMMATIC PACKAGE EXPORTER (ZIP)
              </span>
            </div>
            
            <div className="p-4 space-y-4 leading-relaxed font-sans">
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Generate and download lightweight, ready-to-run ZIP packages of your codebase or generated series assets directly to your local workspace:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* Option 1: Codebase Package */}
                <div className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-lg flex flex-col justify-between space-y-3 hover:border-zinc-700 transition">
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-200">Full Codebase</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                      Packs the entire repository (excluding node_modules) for sharing or offline backup.
                    </p>
                  </div>
                  <a
                    href="/api/package/create?type=all"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center py-1.5 bg-zinc-850 hover:bg-zinc-700 text-slate-200 text-[10px] font-mono font-bold rounded flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>EXPORT CODE</span>
                  </a>
                </div>

                {/* Option 2: Gods & Glory Package */}
                <div className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-lg flex flex-col justify-between space-y-3 hover:border-zinc-700 transition">
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-200">Gods & Glory</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                      Export all final generated scene prompts and narratives from Gods & Glory.
                    </p>
                  </div>
                  <a
                    href="/api/package/create?type=gods_glory"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-900/40 text-emerald-400 text-[10px] font-mono font-bold rounded flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>EXPORT PROMPTS</span>
                  </a>
                </div>

                {/* Option 3: Little Olympus Package */}
                <div className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-lg flex flex-col justify-between space-y-3 hover:border-zinc-700 transition">
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-200">Little Olympus</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                      Export all toddler lesson plans and prompt assets generated for Little Olympus.
                    </p>
                  </div>
                  <a
                    href="/api/package/create?type=little_olympus"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-900/40 text-indigo-400 text-[10px] font-mono font-bold rounded flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>EXPORT PROMPTS</span>
                  </a>
                </div>

                {/* Option 4: WW Channel Package */}
                <div className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-lg flex flex-col justify-between space-y-3 hover:border-zinc-700 transition">
                  <div>
                    <h5 className="text-[11px] font-mono font-bold text-slate-200">WW Channel</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                      Export all World War historical channel script structures and media prompts.
                    </p>
                  </div>
                  <a
                    href="/api/package/create?type=ww_channel"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-900/40 text-rose-400 text-[10px] font-mono font-bold rounded flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>EXPORT PROMPTS</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Testbed (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* MCP Tools breakdown */}
          <div className="bg-zinc-950/40 p-4 border border-zinc-850 rounded-xl space-y-3 font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block border-b border-zinc-850 pb-2">
              Registered MCP Tools
            </span>
            
            <div className="space-y-3 text-[11px]">
              
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>get_system_health_and_logs</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Returns live error feeds, exception stack traces, and dynamic system metrics.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>trigger_autonomous_healing</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Automatically launches generative AI file patches and schema fixes for a log ID.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>trigger_custom_healing</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Instantly sends external terminal compiler errors or SQLite locks directly to the AI Core.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>create_system_log</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Injects an anomaly statement, warning, or status signal into the telemetry bus.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  <span>generate_gods_glory_episode</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Generate scene prompts and narrative structure for a specific Gods & Glory episode using the self-aware python controller.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>generate_gods_glory_batch</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Generate a batch of Gods & Glory episodes in a range (e.g., episodes 20 to 25) with the self-aware python controller.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>get_crossposter_inventory</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Retrieve active cross-post product inventory, pricing, quantities, and listing statuses across external marketplaces.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>get_crossposter_queue</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Retrieve the active background worker queue tracking product cross-posting activities and execution status.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>trigger_crosspost</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Dispatch and cross-post a specific product inventory item to one or more external marketplaces (eBay, Shopify, Etsy, etc.).
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>process_crossposter_queue</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Manually execute and process pending listings inside the background cross-posting worker queue.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>render_gods_glory_episode</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Render a generated Gods & Glory episode into a video file with specified quality.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>push_gods_glory_to_youtube</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Queue and upload a completed Gods & Glory episode video to YouTube.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>list_gods_glory_ready_episodes</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  List all ready and final generated Gods & Glory episode JSON configurations.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>get_gods_glory_episode_status</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Check the status of a specific Gods & Glory episode code.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>generate_little_olympus_episode</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Generate scene prompts and narrative structure for a specific Little Olympus episode (Toddler Gods Edition).
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>generate_little_olympus_batch</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Generate a batch of Little Olympus episodes in a range (e.g., episodes 1 to 6) with matching lesson prompts.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>create_zip_package</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Generate a ZIP package of the full workspace or specific content types (all, gods_glory, little_olympus, ww_channel).
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>generate_episode_script</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Generate scene prompts and narrative structures from raw input details (battle, key facts).
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>trigger_render</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Trigger the auto_render.py media generator to render a completed episode into MP4.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>trigger_render_all</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Run render_all_45min.sh to sequentially compile all queued video configurations.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>get_render_status</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Scan the renders directory to check which episodes are finalized and calculate their file sizes.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>publish_to_youtube</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Publish a rendered video directly to the YouTube channel with custom titles, tags, and description.
                </p>
              </div>

              <div className="space-y-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>run_money_hunter</span>
                </div>
                <p className="text-slate-400 text-[10px] font-sans leading-relaxed pl-5">
                  Execute the Empire Money Hunter pipeline to scan local arbitrage deals and output short-form video scripts.
                </p>
              </div>

            </div>
          </div>

          {/* Local Simulated MCP Session */}
          <div className="bg-zinc-950/40 p-4 border border-zinc-850 rounded-xl space-y-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider block">
                Simulator: Mock Claude MCP Request
              </span>
              <p className="text-[10px] text-slate-500 mt-1 font-sans">
                Type a prompt to simulate how Claude Desktop resolves system failures in real-time.
              </p>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="space-y-1">
                <label className="text-slate-400 uppercase text-[9px] font-bold block">Claude User Input Prompt</label>
                <input
                  type="text"
                  value={simulatedPrompt}
                  onChange={(e) => setSimulatedPrompt(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-slate-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600 font-mono"
                />
              </div>

              <button
                onClick={runSimulateMcp}
                disabled={runningSim}
                className="w-full bg-emerald-600 hover:bg-emerald-550 text-slate-100 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${runningSim ? "animate-spin" : ""}`} />
                <span>EXECUTE SIMULATED MCP CALL</span>
              </button>

              {outputConsole.length > 0 && (
                <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-[9px] text-emerald-400/90 leading-relaxed space-y-1 select-text">
                  {outputConsole.map((line, idx) => (
                    <div key={idx} className={line.includes("SUCCESS") || line.includes("replied") ? "text-emerald-400 font-bold" : "text-slate-400"}>
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic Plugin Center */}
      <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Sovereign AI Hot-Reloading Plugin Core</span>
            </div>
            <h4 className="text-sm font-mono font-black text-slate-200 uppercase mt-1">
              Claude Dynamic Plugins Hub
            </h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-1">
              Create, hot-reload, and dispatch custom tools instantly. Claude can dynamically program new `.js` files into the `/plugins` directory and call them in the next prompt!
            </p>
          </div>
          <button
            onClick={() => setPluginFormVisible(!pluginFormVisible)}
            className="px-3.5 py-1.5 bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/40 rounded text-xs font-mono font-bold text-indigo-200 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{pluginFormVisible ? "CLOSE DEVELOPER STUDIO" : "NEW PLUGIN STUDIO"}</span>
          </button>
        </div>

        {pluginFormVisible && (
          <form onSubmit={handleCreatePlugin} className="bg-zinc-950 p-4 border border-zinc-850 rounded-xl space-y-4 animate-fade-in font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] font-bold block">PLUGIN FILENAME (must end in .js)</label>
                <input
                  type="text"
                  value={newFilename}
                  onChange={(e) => setNewFilename(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-slate-300 rounded px-3 py-1.5 text-xs outline-none focus:border-indigo-600"
                  required
                />
              </div>
              <div className="flex items-end justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 hover:bg-emerald-550 text-slate-100 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>SAVE & HOT-RELOAD PLUGIN</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[10px] font-bold block">PLUGIN SOURCE CODE (CommonJS Object)</label>
              <textarea
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                rows={12}
                className="w-full bg-zinc-900 border border-zinc-800 text-slate-300 rounded p-3 text-[10.5px] font-mono leading-relaxed outline-none focus:border-indigo-600"
                required
              />
            </div>
          </form>
        )}

        {loadingPlugins ? (
          <div className="flex items-center justify-center py-10 gap-2 font-mono text-xs text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Scanning /plugins workspace...</span>
          </div>
        ) : plugins.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-850 rounded-xl space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h5 className="text-xs font-mono font-bold text-slate-300 uppercase">No Dynamic Plugins Loaded</h5>
            <p className="text-[10px] text-slate-500 max-w-md mx-auto">
              Create a custom tool inside the Studio above or ask Claude to write a `.js` plugin into the <code className="font-mono bg-zinc-900 px-1 py-0.5 text-slate-400 rounded">/plugins</code> directory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plugins.map((plugin) => (
              <div
                key={plugin.filename}
                className={`bg-zinc-900/40 border p-4 rounded-xl flex flex-col justify-between space-y-4 hover:border-zinc-700 transition relative overflow-hidden group ${
                  plugin.isValid ? "border-zinc-850" : "border-rose-950/60 bg-rose-950/5"
                }`}
              >
                {/* Visual indicator glow */}
                <div className={`absolute top-0 left-0 w-full h-0.5 ${plugin.isValid ? "bg-emerald-500/40" : "bg-rose-500/40"}`} />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Cpu className={`w-3.5 h-3.5 ${plugin.isValid ? "text-emerald-400 animate-pulse" : "text-rose-400"}`} />
                      <span className="text-[11px] font-mono font-black text-slate-200 uppercase tracking-tight">
                        {plugin.name}
                      </span>
                    </div>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      plugin.isValid ? "bg-emerald-950 text-emerald-400 border border-emerald-900/40" : "bg-rose-950 text-rose-400 border border-rose-900/40"
                    }`}>
                      {plugin.isValid ? "ACTIVE / VALID" : "INVALID / ERROR"}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    {plugin.description}
                  </p>

                  {plugin.error && (
                    <div className="bg-rose-950/20 border border-rose-900/20 rounded p-2 text-[9px] font-mono text-rose-400 leading-normal max-h-24 overflow-y-auto">
                      <strong>Error:</strong> {plugin.error}
                    </div>
                  )}

                  {plugin.inputSchema?.properties && (
                    <div className="space-y-1 pt-1 border-t border-zinc-900/40">
                      <span className="text-[8px] font-mono font-bold text-slate-500 block uppercase">Expected Arguments</span>
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(plugin.inputSchema.properties).map(prop => {
                          const propDef = plugin.inputSchema.properties[prop];
                          const isRequired = plugin.inputSchema.required?.includes(prop);
                          return (
                            <span key={prop} className="text-[9px] font-mono bg-zinc-950/60 px-1.5 py-0.5 rounded text-slate-400 border border-zinc-900/80">
                              {prop}
                              <span className="text-slate-500 font-normal">:{propDef.type}</span>
                              {isRequired && <span className="text-rose-500 font-bold ml-0.5">*</span>}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-zinc-900/40 pt-2.5">
                  <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    {plugin.filename}
                  </span>
                  <button
                    onClick={() => handleDeletePlugin(plugin.filename)}
                    className="text-[9px] font-mono font-bold text-rose-400/80 hover:text-rose-400 bg-rose-950/10 hover:bg-rose-950/30 px-2 py-1 rounded transition cursor-pointer font-bold"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
