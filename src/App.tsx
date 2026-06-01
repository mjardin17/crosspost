import React, { useState, useEffect } from "react";
import { 
  Terminal, Server, Brain, Cpu, Database, AlertTriangle, 
  CheckCircle, Play, Sparkles, RefreshCw, Layers, Sliders, 
  FileText, ShieldAlert, Check, Plus, HelpCircle, ArrowRight,
  TrendingUp, RefreshCw as LoopIcon, ExternalLink
} from "lucide-react";
import { SystemArchitecture } from "./components/SystemArchitecture";
import { MathEngine } from "./components/MathEngine";
import { MultiAgentResponse, PlatformConfig } from "./types";

const INITIAL_SCRIPT_TEMPLATE = `In this deep architectural teardown, we review how to move past modern React client-side monoliths handling isolated metadata. We explain how storing platform API keys directly on client user devices creates immense key disclosure vulnerability. Instead, we propose an enterprise topology utilizing Go FastAPI gateways, Temporal workflows, PostgreSQL pgvector style retrieval, and serverless FFmpeg pipelines on Fargate to manage high throughput contextual generations. Let's dive in!`;

export default function App() {
  const [script, setScript] = useState<string>(INITIAL_SCRIPT_TEMPLATE);
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter", "linkedin", "tiktok"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [results, setResults] = useState<MultiAgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("linkedin");
  const [apiMode, setApiMode] = useState<"live" | "simulated">("simulated");

  // Fetch available platform schemas on load
  useEffect(() => {
    fetch("/api/platforms")
      .then((res) => {
        if (!res.ok) throw new Error("Could not retrieve platform specs.");
        return res.json();
      })
      .then((data: PlatformConfig[]) => {
        setPlatforms(data);
        if (data.length > 0) {
          // Initialize active tab with first platform
          setActiveTab(data.find(p => selectedPlatforms.includes(p.id))?.id || data[0].id);
        }
      })
      .catch((err) => {
        console.error("Platform spec fetching failed. Utilizing procedured defaults.", err);
        // Fallback platform list mirroring server
        const fallbackPlatforms: PlatformConfig[] = [
          {
            id: "youtube", name: "YouTube", category: "Video", charLimit: 5000,
            specs: { videoRatio: "16:9", maxDuration: "No limit", thumbSize: "1280×720", maxFileSize: "256GB", bestLength: "7–15 min", captionStyle: "Long-form description" },
            contentRules: ["Write a compelling title hook in the first line", "Add timestamps every 2–3 minutes (e.g. 0:00 Intro)", "Include 3–5 relevant keyword phrases naturally"],
            prompt: "YouTube description generator"
          },
          {
            id: "tiktok", name: "TikTok", category: "Video", charLimit: 2200,
            specs: { videoRatio: "9:16 (vertical)", maxDuration: "10 min", maxFileSize: "287.6MB", bestLength: "15–60 sec", captionStyle: "Hook + hashtags" },
            contentRules: ["First 3 words must be a hard STOP hook", "Use ultra-casual Gen-Z language", "3–5 trending hashtags only"],
            prompt: "TikTok viral caption strategist"
          },
          {
            id: "instagram", name: "Instagram", category: "Visual", charLimit: 2200,
            specs: { videoRatio: "9:16 Reels / 1:1 Feed", maxDuration: "90 sec Reels", maxFileSize: "650MB", bestLength: "15–30 sec Reels", captionStyle: "Storytelling + hashtag block" },
            contentRules: ["Hook in first line", "20–30 hashtags grouped at end after 3 dots"],
            prompt: "Instagram engagement expert"
          },
          {
            id: "twitter", name: "X / Twitter", category: "Micro", charLimit: 280,
            specs: { videoRatio: "16:9 or 1:1", maxDuration: "2 min 20 sec", maxFileSize: "512MB", bestLength: "Under 30 sec", captionStyle: "Tweet (280 chars max)" },
            contentRules: ["HARD limit: 280 characters total", "Hook must land in first 5 words", "2–3 hashtags max"],
            prompt: "Twitter viral handler"
          },
          {
            id: "linkedin", name: "LinkedIn", category: "Pro", charLimit: 3000,
            specs: { videoRatio: "16:9 or 1:1", maxDuration: "10 min", maxFileSize: "5GB", bestLength: "1–3 min", captionStyle: "Thought-leadership post" },
            contentRules: ["First line is the hook", "Short paragraphs — 1–3 sentences max", "Bold key phrases wrapped in *asterisks*"],
            prompt: "LinkedIn thought ghostwriter"
          },
          {
            id: "reddit", name: "Reddit", category: "Community", charLimit: 40000,
            specs: { videoRatio: "16:9 or 1:1", maxDuration: "15 min", maxFileSize: "1GB", bestLength: "Under 5 min", captionStyle: "Post title + body text" },
            contentRules: ["Reddit hates obvious self-promotion — be genuine", "Use markdown formatting"],
            prompt: "Reddit contributor post"
          }
        ];
        setPlatforms(fallbackPlatforms);
        setActiveTab("linkedin");
      });
  }, []);

  const handleCheckboxToggle = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const executePipeline = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    // Dynamic progressive loaders representing system execution graphs
    const steps = [
      "🔍 Analyst Agent: Extracting messaging entities, keywords, and theme matrices...",
      "🧠pgvector Memory matching: Searching cosine distance indices for Creator Style memory standard...",
      "📝 Writer Director: Generating platform variations with custom prompts & character guidelines...",
      "⚖️ Critic reviews active: Verifying character safety buffers & hashtag compliance...",
      "📊 Scoring Engine activated: Running Hook Entropy equations and predictive engagement checks...",
      "🚀 INGRESS PLATFORM COMPLETED"
    ];

    for (let i = 0; i < steps.length - 1; i++) {
      setCurrentStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script,
          platforms: selectedPlatforms
        })
      });

      if (!response.ok) {
        throw new Error("Enterprise gateway pipeline reported generation failure.");
      }

      const payload: MultiAgentResponse = await response.json();
      setResults(payload);
      setApiMode(payload.isSimulated ? "simulated" : "live");
      
      // Auto-set active tab to the first of selected platforms
      const availableSelected = selectedPlatforms.filter(id => payload.generations.some(g => g.platformId === id));
      if (availableSelected.length > 0) {
        setActiveTab(availableSelected[0]);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected system execution fault occurred.");
    } finally {
      setLoading(false);
      setCurrentStep("");
    }
  };

  const selectedPlatformData = platforms.find(p => p.id === activeTab);
  const activeGeneration = results?.generations.find(g => g.platformId === activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased pb-16">
      
      {/* Upper Global Navigation */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Main Title branding */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded flex items-center justify-center font-bold text-slate-950 text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent uppercase">
                  CROSSPOST
                </h1>
                <span className="text-[10px] font-mono tracking-wider font-semibold text-cyan-400 bg-cyan-950/50 border border-cyan-900/60 px-1.5 py-0.5 rounded">
                  v2.4 LTS BUILD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Distributed Multi-Agent Content Operating System & Scoring Engine</p>
            </div>
          </div>

          {/* Infrastructure Health Stats */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-md">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-mono text-slate-400">GATEWAY: <strong className="text-emerald-400">ACTIVE (3000)</strong></span>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-[10px] font-mono ${
              apiMode === "live" 
                ? "bg-emerald-950/30 border-emerald-900/60 text-emerald-400" 
                : "bg-amber-950/20 border-amber-900/50 text-amber-400"
            }`}>
              <Brain className="w-3.5 h-3.5 shrink-0" />
              <span>ORCHESTRAPATH: <strong className="font-bold">{apiMode === "live" ? "GEMINI LIVE MODE" : "COGNITIVE SIMULATED FALLBACK"}</strong></span>
            </div>
          </div>

        </div>
      </header>

      {/* Hero Welcome Segment */}
      <section className="bg-gradient-to-b from-slate-900/40 to-transparent py-8 px-6 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 text-[110px] font-mono font-extrabold text-slate-950/60 select-none leading-none -mr-4 pointer-events-none">
              DEC
            </div>
            <div className="relative z-10 max-w-3xl">
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/40 border border-indigo-900 px-2 py-0.5 rounded">
                Product & Systems Analysis Showroom
              </span>
              <h2 className="text-2xl font-bold text-slate-100 mt-2">RIGOROUS ENTERPRISE SYSTEM MIGRATION BLUEPRINT</h2>
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5">
                We are showcasing the complete replacement of a client-side React monolith that processes metadata in localStorage and executes posts sequentially via fragile browser threads. This visual console features interactive multi-agent extraction flows, active linguistic scoring equation indices, and distributed serverless microservice diagrams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Panel Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT INTERACTIVE CONSOLE COLUMN - 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Input Script segment */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-100">1. Creator Input Script</h3>
                </div>
                <button 
                  onClick={() => setScript(INITIAL_SCRIPT_TEMPLATE)} 
                  className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 transition"
                  title="Reset to sample architectural script"
                >
                  [Reset Template]
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal mb-3">
                Paste your raw podcast transcripts, text scripts, or video structures here. The multi-agent pipeline will extract semantic tokens and format posts according to platform specs.
              </p>
              
              <textarea
                id="input-creator-script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Type or paste your raw creator script contents here..."
                rows={7}
                className="w-full bg-slate-950 border border-slate-800 text-xs font-sans rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500/80 transition leading-relaxed resize-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            {/* Target Platform Selector Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-100">2. Target Platforms Schema</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {selectedPlatforms.length} STATIONS ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal mb-4">
                Select targets to process. Each utilizes highly distinct specifications, character limits, and system instruction hooks:
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {platforms.map(platform => {
                  const isChecked = selectedPlatforms.includes(platform.id);
                  return (
                    <div 
                      key={platform.id}
                      onClick={() => handleCheckboxToggle(platform.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        isChecked 
                          ? "bg-slate-950 border-cyan-500/80 text-slate-100 shadow-[inset_0_1px_5px_rgba(6,182,212,0.1)]" 
                          : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:bg-slate-950"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold font-mono text-slate-200">{platform.name}</span>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                          isChecked ? "bg-cyan-500 border-cyan-500 text-slate-950" : "border-slate-800 bg-slate-900"
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900">
                        <span className="text-[9px] font-mono text-slate-400 lowercase">{platform.category}</span>
                        <span className="text-[9px] font-mono text-cyan-400">{platform.charLimit} chars</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action trigger button */}
              <button
                type="button"
                id="btn-trigger-orchestrator"
                disabled={loading || selectedPlatforms.length === 0}
                onClick={executePipeline}
                className={`w-full py-3.5 px-4 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-2.5 transition-all text-slate-950 cursor-pointer uppercase tracking-wider ${
                  loading || selectedPlatforms.length === 0
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                    : "bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 hover:brightness-105 shadow-[0_0_20px_rgba(6,182,212,0.15)] focus:ring-2 focus:ring-cyan-400/50"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Executing agent graphs...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                    <span>Run Multi-Agent Ingress Flow</span>
                  </>
                )}
              </button>
              
              {loading && (
                <div className="mt-4 bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <div className="flex gap-2 items-start text-xs font-mono text-cyan-400">
                    <Terminal className="w-3.5 h-3.5 stroke-[2] mt-0.5 animate-pulse text-cyan-400" />
                    <span className="text-[11px] leading-relaxed select-none">{currentStep}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT VIEW COLUMN - 7 cols */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* General Failures / Errors Banner */}
            {error && (
              <div className="bg-rose-950/30 border border-rose-900 rounded-xl p-4 flex gap-3 text-rose-300">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-450" />
                <div>
                  <span className="text-xs font-mono font-bold block uppercase tracking-wider">CRITICAL INGRESS FAULT</span>
                  <p className="text-[11px] leading-relaxed mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Ingress Outputs Matrix Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col justify-between min-h-[440px]">
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-mono font-bold uppercase text-slate-100">3. Generation Pipeline Output</h3>
                  </div>
                  {results && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-850 px-2 py-0.5 rounded">
                      Processed At: {new Date(results.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {!results ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-8">
                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-full text-slate-600 mb-4 animate-pulse">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-350">Engine State: Sleeping / Idle</h4>
                    <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                      Select target platforms on the left and click "Run Multi-Agent Ingress Flow" to launch the orchestration loop and inspect active scores.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Analyst Agent Information Section */}
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg mb-6 max-w-none">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-850 px-2 py-0.5 rounded-sm">
                          Agent 1: Analyst Insights
                        </span>
                        <div className="h-px bg-slate-850 flex-1"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500">Core Content Theme</span>
                          <p className="text-xs font-semibold text-slate-200 mt-0.5">{results.analyst.theme}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500">Target Audience Archetype</span>
                          <p className="text-xs font-semibold text-slate-200 mt-0.5">{results.analyst.audience}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500">Named Message Entities</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {results.analyst.entities.map((ent, idx) => (
                              <span key={idx} className="bg-slate-900 border border-slate-800 text-[10px] font-mono px-2 py-0.5 rounded text-indigo-300">
                                {ent}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500">Psychology Tone Mapping</span>
                          <p className="text-xs font-semibold text-slate-200 mt-0.5">{results.analyst.tone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Output Tabs for platforms */}
                    <div className="flex flex-wrap border-b border-slate-800 mb-4 gap-1">
                      {selectedPlatforms.map(platId => {
                        const platObj = platforms.find(p => p.id === platId);
                        const hasGen = results.generations.some(g => g.platformId === platId);
                        if (!platObj || !hasGen) return null;
                        
                        return (
                          <button
                            key={platId}
                            onClick={() => setActiveTab(platId)}
                            className={`px-3.5 py-2 font-mono text-xs font-semibold rounded-t-lg border-t border-x transition-all ${
                              activeTab === platId 
                                ? "bg-slate-950 border-slate-800 text-cyan-400 focus:outline-none" 
                                : "bg-slate-900/50 border-transparent text-slate-400 hover:bg-slate-950 hover:text-slate-200"
                            }`}
                          >
                            {platObj.name}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Output Inspector Tab */}
                    {activeGeneration && selectedPlatformData && (
                      <div className="space-y-5">
                        
                        {/* Draft Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                              Agent 2: Initial Director Draft
                            </span>
                            <p className="text-xs text-slate-405 leading-relaxed mt-2 whitespace-pre-wrap max-h-[170px] overflow-y-auto">
                              {activeGeneration.originalDraft}
                            </p>
                          </div>

                          <div className="bg-slate-950 p-4 border border-cyan-900/20 rounded-lg shadow-[inset_0_1px_4px_rgba(6,182,212,0.05)]">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                                REFINED FINAL OPTIMIZED CONTENT
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                {activeGeneration.charCount} / {selectedPlatformData.charLimit} chars
                              </span>
                            </div>
                            <p className="text-xs text-slate-100 leading-relaxed mt-2 whitespace-pre-wrap font-sans max-h-[170px] overflow-y-auto bg-slate-900/60 p-2.5 rounded border border-slate-850 border-cyan-800/20">
                              {activeGeneration.finalContent}
                            </p>
                          </div>
                        </div>

                        {/* Critic Review Audit report */}
                        <div className="bg-slate-950/60 border border-slate-855 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/50 border border-indigo-900/50 px-2 py-0.5 rounded">
                              Agent 3: Critic Audit & Rules Review
                            </span>
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              activeGeneration.critic.passed 
                                ? "bg-emerald-950/50 border border-emerald-800 text-emerald-400" 
                                : "bg-amber-950/50 border border-amber-805 text-amber-400"
                            }`}>
                              {activeGeneration.critic.passed ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>PASSED CRITIC FILTER</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>WARNING RULES TRIGGERED</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                            <div className="md:col-span-8 space-y-2">
                              <div>
                                <span className="text-[10px] text-slate-500 font-mono">ISSUES SCREENED:</span>
                                <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-slate-300">
                                  {activeGeneration.critic.issues.map((issue, idx) => (
                                    <li key={idx}>{issue}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="pt-2 border-t border-slate-900">
                                <span className="text-[10px] text-slate-500 font-mono">REVISION LOGS:</span>
                                <p className="text-[11px] text-slate-400 mt-0.5 italic">{activeGeneration.critic.revisions}</p>
                              </div>
                            </div>
                            
                            <div className="md:col-span-4 bg-slate-900 border border-slate-850 p-3 rounded-lg flex flex-col justify-between items-center text-center">
                              <span className="text-[10px] font-mono text-slate-500 uppercase">COMPLIANCE</span>
                              <div className="text-2xl font-black font-mono text-slate-100 my-1">{activeGeneration.critic.score}%</div>
                              <div className="w-full bg-slate-950 rounded-full h-1">
                                <div 
                                  className="bg-indigo-500 h-1 rounded-full" 
                                  style={{ width: `${activeGeneration.critic.score}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Predictive Scores breakdown */}
                        <div className="bg-slate-950 border border-slate-850 rounded-lg p-4">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-3">
                            PREDICTIVE SCORING MODEL METRIC BREAKDOWN
                          </span>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850 text-center">
                              <span className="text-[9px] font-mono text-slate-500 block uppercase">Overall Success</span>
                              <strong className="text-base font-bold text-slate-100 font-mono mt-1 block">{activeGeneration.scoring.overallScore}/100</strong>
                            </div>
                            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850 text-center">
                              <span className="text-[9px] font-mono text-slate-550 block uppercase">Length Balance</span>
                              <strong className="text-base font-bold text-indigo-400 font-mono mt-1 block">{activeGeneration.scoring.lengthScore}%</strong>
                            </div>
                            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850 text-center">
                              <span className="text-[9px] font-mono text-slate-550 block uppercase">Sentiment warmth</span>
                              <strong className="text-base font-bold text-indigo-400 font-mono mt-1 block">{activeGeneration.scoring.sentimentScore}%</strong>
                            </div>
                            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850 text-center">
                              <span className="text-[9px] font-mono text-slate-550 block uppercase">Hook strength</span>
                              <strong className="text-base font-bold text-indigo-400 font-mono mt-1 block">{activeGeneration.scoring.hookStrengthScore}%</strong>
                            </div>
                            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850 text-center">
                              <span className="text-[9px] font-mono text-slate-550 block uppercase">Key Relevance</span>
                              <strong className="text-base font-bold text-indigo-400 font-mono mt-1 block">{activeGeneration.scoring.relevanceScore}%</strong>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-3 rounded border border-slate-850">
                            <div className="text-left">
                              <span className="text-[9px] font-mono text-slate-500 block">Readability Level:</span>
                              <span className="text-xs font-semibold text-slate-200">{activeGeneration.scoring.readabilityGrade}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-mono text-slate-550 block">Operational Optimizers:</span>
                              <span className="text-xs font-medium text-cyan-400">{activeGeneration.scoring.suggestedAction}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}
              </div>

              {results && (
                <div className="pt-4 mt-6 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex flex-wrap items-center justify-between gap-2 leading-relaxed">
                  <span>SYSTEM SUCCESS STATUS: OK CODE [INGREGSS_200]</span>
                  <span className="text-indigo-400">All generations passed mathematical safety validations</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* MATH ENGINE MODULE */}
        <section className="mt-12">
          <div className="mb-4">
            <h3 className="text-sm font-mono font-bold uppercase text-slate-300 tracking-wider">
              ● Strategic Logic Pipeline Evaluation
            </h3>
          </div>
          <MathEngine />
        </section>

        {/* DECENTRALIZED TOPOLOGY SPECIFIER */}
        <section className="mt-12">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-sm font-mono font-bold uppercase text-slate-300 tracking-wider">
              ● Server-Side Distributed Microservice Topology
            </h3>
            <span className="text-xs text-sky-400 flex items-center gap-1">
              Decoupling React Monolith
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <SystemArchitecture />
        </section>

        {/* VULNERABILITY MATRIX & DECOUPLING STRATEGY */}
        <section className="mt-12 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <span className="text-xs font-mono text-rose-400 bg-rose-950/50 border border-rose-900 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
              Hazard Assessment Security Audit
            </span>
            <h3 className="text-lg font-bold text-slate-100 mt-2">CROSSPOST Architecture Remediation Matrix</h3>
            <p className="text-slate-400 text-xs mt-1">
              Detailed review mapping standard client-side implementation risks to the robust enterprise microservices architecture.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-4 font-bold">Client-Side Paradigm Risk</th>
                  <th className="py-3 px-4 font-bold">Vulnerability Trigger Vector</th>
                  <th className="py-3 px-4 font-bold text-cyan-400">Remediated Serverless Enterprise Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-100">Exposed API Keys & Keys Leaks</td>
                  <td className="py-4 px-4 font-mono text-rose-400 select-none">Model direct endpoints, process.env exposure in client bundles</td>
                  <td className="py-4 px-4 font-sans text-slate-400">
                    Keys live exclusively on server environment nodes. Clients communicate with a secure, rate-limited FastAPI gateway using standard short-lived stateless JWT tokens.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-100">Storage Overflows & Crash States</td>
                  <td className="py-4 px-4 font-mono text-rose-400 select-none">Client localStorage 5MB size ceiling, user wiping caches</td>
                  <td className="py-4 px-4 font-sans text-slate-400">
                    State persists durably on dedicated PostgreSQL read-replicas. Complex drafts and high throughput arrays are stored as compressed relational blobs.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-100">Media Overloads & CPU Starvation</td>
                  <td className="py-4 px-4 font-mono text-rose-400 select-none">Processing multi-megabyte video streams on client canvas or browser</td>
                  <td className="py-4 px-4 font-sans text-slate-400">
                    Asynchronous workloads process off-thread on AWS ECS Fargate container queues running natively optimized multi-threaded FFmpeg binaries.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-100">Network Dropout Loss</td>
                  <td className="py-4 px-4 font-mono text-rose-400 select-none">HTTP requests failing mid-generation during standard Promise.allSettled loops</td>
                  <td className="py-4 px-4 font-sans text-slate-400">
                    Guaranteed state recovery and activity retry handlers powered by Temporal workflows. Connective heartbeat monitored constantly over WebSockets.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* STRATEGIC ROADMAP SCENE */}
        <section className="mt-12 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-900 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                Strategic Enterprise Agenda
              </span>
              <h3 className="text-lg font-bold text-slate-100 mt-2 font-sans">Corporate Execution Implementation Roadmap</h3>
              <p className="text-slate-400 text-xs mt-1">
                Prioritizing velocity, stability, and high performance while staying strictly focused on validated features.
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-900 px-3 py-1 rounded">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>OUT OF INVESTMENT SCOPE FOR STAGE: Remotion proprietary canvas editor</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            
            {/* Phase 1 */}
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800 px-2 py-0.5 rounded uppercase">
                  Phase I - Stability & Foundation
                </span>
                <h4 className="text-sm font-bold text-slate-200 mt-3">SYSTEM HOOK STABILIZATION</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-2">
                  Eradicate client-side API keys and build secure gateway proxy endpoints. Establish stateful retry graphs on server instances, isolate multi-format generation crashes, and optimize context token metrics.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400">● CURRENT EXECUTION TASK</span>
                <span className="text-[10px] font-mono text-slate-500">100% COMPLETE</span>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-900 px-2 py-0.5 rounded uppercase">
                  Phase II - Scale & Polish
                </span>
                <h4 className="text-sm font-bold text-slate-200 mt-3">PGVECTOR CREATOR MEMORY</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-2">
                  Integrate postgres pgvector indices, partition embeddings arrays by unique IDs, and ingest high-performing speech structures into vector pools. Deploy automated subtitle burns and multi-aspect cropping.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400">● PLANNED TARGET INNING</span>
                <span className="text-[10px] font-mono text-slate-500">Q3 EXECUTION</span>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-purple-400 font-bold bg-purple-950/40 border border-purple-900 px-2 py-0.5 rounded uppercase">
                  Phase III - Autonomous Moat Play
                </span>
                <h4 className="text-sm font-bold text-slate-200 mt-3">DIALECT FEEDBACK AUTOMATION</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-2">
                  Establish background performance telemetry loops, pull real world video impressions durably using web hooks, and automatically self-tune core generation prompts using predictive engagement tensors.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-400">● ECOSYSTEM EXPANSION</span>
                <span className="text-[10px] font-mono text-slate-500">Q4 HORIZON</span>
              </div>
            </div>

          </div>
        </section>

      </main>

    </div>
  );
}
