import React, { useState } from "react";
import { Code, Copy, Check, Terminal, Cpu, Sparkles, AlertCircle, RefreshCw, Layers, ShieldCheck, ExternalLink } from "lucide-react";

interface Props {
  handleCopy: (text: string, id: string) => void;
  copiedText: string | null;
}

export default function ClaudeDesktopConnectPanel({ handleCopy, copiedText }: Props) {
  const [simulatedPrompt, setSimulatedPrompt] = useState<string>("Analyze the shopify sync lock exception and heal it instantly");
  const [outputConsole, setOutputConsole] = useState<string[]>([]);
  const [runningSim, setRunningSim] = useState<boolean>(false);

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
    const steps = [
      "Connecting to Empire OS API: https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app",
      "Claude Desktop sent JSON-RPC: initialize",
      "Empire Bridge replied with version 1.0.0 & 4 tools registered successfully.",
      "Claude Desktop sent JSON-RPC: tools/call { name: 'get_system_health_and_logs' }",
      "Found 1 warning node: 'Shopify sync lock occurred during active Shopify sync.'",
      "Claude Desktop sent JSON-RPC: tools/call { name: 'trigger_autonomous_healing', arguments: { logId: 'shpf-9192' } }",
      "AI Diagnostics engaged! Running Gemini code synthesis...",
      "HOTPATCH SUCCESS: sqlite_busy lock cleared, retry counter reset.",
      "MCP execution completed in 1.48s. Pipeline healthy."
    ];

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

    </div>
  );
}
