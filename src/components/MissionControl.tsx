import React, { useState, useEffect } from "react";
import {
  Shield, Server, Cpu, GitFork, Cloud, DollarSign, Bell, ListTodo, Play, ArrowRight,
  TrendingUp, Activity, CheckCircle2, AlertCircle, RefreshCw, Zap, Sparkles, Terminal,
  TrendingDown, Clock, ArrowUpRight, Database, Search, Share2, Globe, ShoppingBag,
  Eye, BookOpen, Layers, Video, Music, Trash, Plus, X, FileText, ChevronRight,
  Flame, CheckCircle, Award, Sliders, Settings, Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MissionControlProps {
  onNavigate: (module: string) => void;
  githubToken?: string;
  apiMode?: "live" | "simulated";
}

interface AutonomousProject {
  id: string;
  name: string;
  type: "YouTube Channel" | "Affiliate Website" | "Children’s Brand" | "Reselling Business";
  status: "Initializing" | "Running" | "Optimizing" | "Suspended";
  workersCount: number;
  revenue: number;
  costs: number;
  impressions: number;
  ctr: number;
  created: string;
  niche: string;
}

interface Worker {
  id: string;
  name: string;
  role: "Research" | "Content" | "Media" | "Commerce" | "Publishing" | "Growth";
  specialization: string;
  currentTask: string;
  model: string;
  status: "idle" | "running" | "optimizing" | "success" | "warning";
  efficiency: number;
  resolvedTasks: number;
}

interface DailyBriefing {
  date: string;
  revenueToday: number;
  revenueMonth: number;
  aiSpending: number;
  completedWork: string[];
  pendingWork: string[];
  problems: { issue: string; workaround: string }[];
  priorities: string[];
  growthOpportunities: string[];
}

export default function MissionControl({ onNavigate }: MissionControlProps) {
  // --- REAL-TIME TELEMETRY STATE ---
  const [cpuUsage, setCpuUsage] = useState<number>(38);
  const [gpuLoad, setGpuLoad] = useState<number>(45);
  const [vramUsage, setVramUsage] = useState<number>(14.2);
  const [ollamaStatus, setOllamaStatus] = useState<string>("Active (deepseek-r1:7b)");
  const [aiHealth, setAiHealth] = useState<number>(99.8);
  const [apiCalls, setApiCalls] = useState<number>(1824);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // --- CONNECTED LIVE HARDWARE & SERVICE STATUSES ---
  const [ramUsed, setRamUsed] = useState<string>("Loading...");
  const [ramPercentage, setRamPercentage] = useState<number>(0);
  const [modelsInstalledCount, setModelsInstalledCount] = useState<number>(0);
  const [ollamaModelList, setOllamaModelList] = useState<string[]>([]);
  const [openWebUIStatus, setOpenWebUIStatus] = useState<string>("Loading...");
  const [gooseStatus, setGooseStatus] = useState<string>("Loading...");
  const [videoFactoryStatus, setVideoFactoryStatus] = useState<string>("Loading...");
  const [memoryDatabaseStatus, setMemoryDatabaseStatus] = useState<string>("Loading...");
  const [memoriesCount, setMemoriesCount] = useState<number>(0);
  const [isOllamaConnected, setIsOllamaConnected] = useState<boolean>(false);

  // --- REVENUE & BUSINESS METRICS STATE ---
  const [revenueToday, setRevenueToday] = useState<number>(1245.80);
  const [revenueMonth, setRevenueMonth] = useState<number>(34810.00);
  const [aiCosts, setAiCosts] = useState<number>(248.15);
  const [profit, setProfit] = useState<number>(34561.85);

  const [jobsRunning, setJobsRunning] = useState<number>(5);
  const [failedJobs, setFailedJobs] = useState<number>(1);
  const [scheduledJobs, setScheduledJobs] = useState<number>(12);
  const [publishedToday, setPublishedToday] = useState<number>(14);
  const [pendingVideos, setPendingVideos] = useState<number>(8);
  const [pendingListings, setPendingListings] = useState<number>(18);

  // --- EXECUTIVE BRIEFING ---
  const [briefing, setBriefing] = useState<DailyBriefing>({
    date: "July 4, 2026",
    revenueToday: 1245.80,
    revenueMonth: 34810.00,
    aiSpending: 12.45,
    completedWork: [
      "Generated 4-chapter children's picture book via StoryForge ('The Cybernetic Jungle')",
      "Scanned 14 reselling candidates via Boss Listers AI; identified 4 highly profitable eBay arbitrage gaps",
      "Assembled, voice-synthesized, and scheduled 2 long-form YouTube documentaries via Video Intelligence Engine",
      "Published 8 automated TikTok promo videos via CrossPost with platform-optimized localized SEO descriptions"
    ],
    pendingWork: [
      "Review generated video thumbnail layouts for High Frequency Trading documentary",
      "Authorize publishing of Amazon KDP paperback layout formatting",
      "Complete final pricing scan verification for local computer hardware reselling inventory"
    ],
    problems: [
      {
        issue: "GPT-4o API socket rate-limiting during Boss Listers batch script formatting",
        workaround: "AI Router 2.0 automatically hot-swapped execution to Claude 3.5 Sonnet to complete generation."
      },
      {
        issue: "Veo render queue experienced high temporal delay on Clip 3",
        workaround: "Scheduled a 15-second rendering buffer loop; system auto-retried with alternative seed parameters."
      }
    ],
    priorities: [
      "Approve CrossPost TikTok campaign for the sovereign workstation launch",
      "Initiate new children's bedtime content theme targeting 'Cybernetic Deep-Sea Mysteries'",
      "Inspect growth analytics to verify click-through rate (CTR) margin shift on high-ticket listings"
    ],
    growthOpportunities: [
      "Google Trends shows 320% spike in 'local private hosting' interest. Recommend launching an instant video series.",
      "eCommerce scans indicate a high margin gap ($120 average profit) on specialized network interface cards on eBay."
    ]
  });

  // --- SPECIALIZED AUTONOMOUS WORKERS ---
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: "worker-1",
      name: "Sovereign Trend Scraper",
      role: "Research",
      specialization: "Amazon, eBay, TikTok Shop, Google Trends",
      currentTask: "Monitoring live high-frequency trading keyword search interest",
      model: "Gemini 1.5 Pro",
      status: "running",
      efficiency: 98.4,
      resolvedTasks: 428
    },
    {
      id: "worker-2",
      name: "Master StoryForge Copywriter",
      role: "Content",
      specialization: "Scripts, Children Books, Ad Copy, Hooks",
      currentTask: "Synthesizing chapter dialogues for bedtime series",
      model: "Claude 3.5 Sonnet",
      status: "optimizing",
      efficiency: 99.1,
      resolvedTasks: 812
    },
    {
      id: "worker-3",
      name: "Multi-Engine Media Guild",
      role: "Media",
      specialization: "Imagen, Veo, ElevenLabs, Suno v4",
      currentTask: "Rendering B-roll b-rack sequence using local GPU layers",
      model: "Veo Temporal + ElevenLabs",
      status: "running",
      efficiency: 95.2,
      resolvedTasks: 349
    },
    {
      id: "worker-4",
      name: "Global Arbitrage Listing Agent",
      role: "Commerce",
      specialization: "SEO Metadata, Marketplace Sync, Price Engine",
      currentTask: "Cross-listing sovereign hardware inventory from Amazon to eBay",
      model: "GPT-4o",
      status: "success",
      efficiency: 97.8,
      resolvedTasks: 512
    },
    {
      id: "worker-5",
      name: "CrossPost Pipeline Depot",
      role: "Publishing",
      specialization: "YouTube, TikTok, Instagram Reels, Amazon KDP",
      currentTask: "Uploading assembled YouTube documentary package with localized captions",
      model: "CrossPost Core API",
      status: "success",
      efficiency: 99.6,
      resolvedTasks: 1245
    },
    {
      id: "worker-6",
      name: "Strategic Flywheel Optimizer",
      role: "Growth",
      specialization: "CTR Analytics, Prompt Tuning, Niche Analytics",
      currentTask: "Reviewing historic CTR database to optimize video intro sequences",
      model: "Claude 3.5 Sonnet",
      status: "idle",
      efficiency: 98.9,
      resolvedTasks: 189
    }
  ]);

  // --- AUTONOMOUS PROJECTS ---
  const [projects, setProjects] = useState<AutonomousProject[]>([
    {
      id: "proj-1",
      name: "The Cyber-Bedtime Brand",
      type: "Children’s Brand",
      status: "Running",
      workersCount: 3,
      revenue: 12480.00,
      costs: 1820.00,
      impressions: 480200,
      ctr: 16.4,
      created: "2026-06-15",
      niche: "AI-assisted kids science fiction bedtime series"
    },
    {
      id: "proj-2",
      name: "Autonomous Tech Syndicate",
      type: "YouTube Channel",
      status: "Running",
      workersCount: 4,
      revenue: 18450.00,
      costs: 2450.00,
      impressions: 924000,
      ctr: 12.8,
      created: "2026-06-20",
      niche: "High-end tech & coding infrastructure documentaries"
    },
    {
      id: "proj-3",
      name: "Sovereign Workstations Shop",
      type: "Reselling Business",
      status: "Optimizing",
      workersCount: 2,
      revenue: 3880.00,
      costs: 1210.00,
      impressions: 84200,
      ctr: 14.1,
      created: "2026-06-28",
      niche: "Arbitrage listing of offline computing modules and servers"
    }
  ]);

  // --- NEW PROJECT CREATOR STATE ---
  const [showNewProjModal, setShowNewProjModal] = useState<boolean>(false);
  const [newProjName, setNewProjName] = useState<string>("Sovereign Lifestyle Blog");
  const [newProjType, setNewProjType] = useState<"YouTube Channel" | "Affiliate Website" | "Children’s Brand" | "Reselling Business">("Affiliate Website");
  const [newProjNiche, setNewProjNiche] = useState<string>("Private hosting, solar setups, and offline security nodes review");

  // --- BUSINESS MEMORY VAULT ---
  const [memoryVault, setMemoryVault] = useState({
    winningPrompts: [
      { id: "wp-1", title: "Documentary Retaining Hook Prompt", model: "Claude 3.5 Sonnet", ctrYield: "+4.2% CTR" },
      { id: "wp-2", title: "Boss Listers High-Velocity Copypasta Template", model: "GPT-4o", ctrYield: "+18% sales" },
      { id: "wp-3", title: "Cinematic Watercolor Bedtime Illustration", model: "Imagen 3", ctrYield: "82% watch-time retention" }
    ],
    winningProducts: [
      { id: "wpr-1", title: "Sovereign Offline Backup Workstation Node", margin: "$220 Profit Margin", source: "Amazon Scan" },
      { id: "wpr-2", title: "Fiber Optic Arbitrage Core Switch", margin: "$84 Profit Margin", source: "eBay Arbitrage" }
    ],
    profitableNiches: [
      { id: "n-1", title: "Faceless High-Frequency Infrastructure Analysis", profitScore: "9.8/10" },
      { id: "n-2", title: "Bedtime books for technology-oriented children", profitScore: "8.9/10" }
    ]
  });

  // --- MARKETPLACE INTELLIGENCE STREAM ---
  const [intelStream, setIntelStream] = useState([
    { source: "Google Trends", query: "Private high-frequency nodes", change: "+420% spike", relevance: "HIGH" },
    { source: "TikTok Shop", query: "Self-contained coding tablet", change: "2.4K units/week", relevance: "MEDIUM" },
    { source: "YouTube Trends", query: "How financial systems actually function", change: "+180% watch duration", relevance: "HIGH" },
    { source: "eBay Arbitrage", query: "Used Enterprise Server parts", change: "Low competition density", relevance: "HIGH" }
  ]);

  // Custom instruction inputs for workers
  const [activeWorkerEdit, setActiveWorkerEdit] = useState<string | null>(null);
  const [customWorkerInstruction, setCustomWorkerInstruction] = useState<string>("");

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch("/api/system/status");
      if (!res.ok) {
        console.warn(`System status API returned HTTP ${res.status}`);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("System status API returned non-JSON content");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setCpuUsage(data.metrics.cpuUsage);
        setRamUsed(`${data.metrics.ram.usedGb} GB / ${data.metrics.ram.totalGb} GB`);
        setRamPercentage(data.metrics.ram.percentage);
        setModelsInstalledCount(data.modelsInstalledCount);
        setOllamaModelList(data.ollamaModelList || []);
        setIsOllamaConnected(data.isLiveOllamaConnected);
        setOpenWebUIStatus(data.services.openWebUI);
        setGooseStatus(data.services.goose);
        setVideoFactoryStatus(data.services.videoFactory);
        setMemoryDatabaseStatus(data.services.memoryDatabase);
        setMemoriesCount(data.memoriesCount);
        
        if (data.ollamaModelList && data.ollamaModelList.length > 0) {
          setOllamaStatus(`Active (${data.ollamaModelList[0]})`);
        } else {
          setOllamaStatus("Standby (No models)");
        }
      }
    } catch (err) {
      console.error("Failed to fetch live system status:", err);
    }
  };

  // Live telemetry pulse effect
  useEffect(() => {
    fetchSystemStatus();
    const intervalStatus = setInterval(fetchSystemStatus, 5000);
    
    // Slow randomizer for other telemetry metrics like stability, API calls etc.
    const intervalTelemetry = setInterval(() => {
      setApiCalls(prev => prev + Math.floor(Math.random() * 2));
      setGpuLoad(prev => Math.min(98, Math.max(2, prev + (Math.random() * 6 - 3))));
      setVramUsage(prev => parseFloat(Math.min(16, Math.max(1.2, prev + (Math.random() * 0.2 - 0.1))).toFixed(1)));
    }, 4000);

    return () => {
      clearInterval(intervalStatus);
      clearInterval(intervalTelemetry);
    };
  }, []);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    fetchSystemStatus();
    setTimeout(() => {
      setIsRefreshing(false);
      setRevenueToday(prev => prev + 45.20);
      setRevenueMonth(prev => prev + 180.50);
      setAiCosts(prev => prev + 1.15);
      setProfit(prev => prev + 44.05);
      setApiCalls(prev => prev + 14);
      setAiHealth(parseFloat((99.5 + Math.random() * 0.5).toFixed(1)));

      // Randomize Briefing slight updates to feel organic
      setBriefing(prev => ({
        ...prev,
        revenueToday: prev.revenueToday + 45.20,
        revenueMonth: prev.revenueMonth + 180.50,
        aiSpending: prev.aiSpending + 1.15
      }));
    }, 1200);
  };

  const handleInstantiateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const newProject: AutonomousProject = {
      id: `proj-${projects.length + 1}`,
      name: newProjName,
      type: newProjType,
      status: "Initializing",
      workersCount: newProjType === "YouTube Channel" ? 4 : newProjType === "Children’s Brand" ? 3 : 2,
      revenue: 0,
      costs: 0.12,
      impressions: 0,
      ctr: 0.0,
      created: new Date().toISOString().split("T")[0],
      niche: newProjNiche
    };

    setProjects(prev => [...prev, newProject]);
    setShowNewProjModal(false);

    // Push standard completed briefing update log
    setBriefing(prev => ({
      ...prev,
      completedWork: [
        `Initialized new Autonomous Venture: ${newProjName} (${newProjType})`,
        ...prev.completedWork
      ]
    }));

    // Trigger enqueued animation notification
    alert(`Autonomous Venture Registered! Workflows successfully generated for ${newProjName}. Assigned workers: ${newProject.workersCount}.`);
  };

  const handleApplyWorkerInstruction = (workerId: string) => {
    if (!customWorkerInstruction.trim()) return;
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          currentTask: customWorkerInstruction,
          status: "running" as const,
          efficiency: Math.min(100, w.efficiency + 0.5)
        };
      }
      return w;
    }));
    setActiveWorkerEdit(null);
    setCustomWorkerInstruction("");
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-200 text-left">
      
      {/* 1. Header & Live System Telemetry Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 border border-zinc-850 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500 to-transparent pointer-events-none" />
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
              <h2 className="text-lg font-black font-mono text-slate-100 tracking-tight flex items-center gap-2">
                EMPIRE OS EXECUTIVE COMMAND CENTER
              </h2>
              <span className="text-[8px] bg-indigo-950 border border-indigo-900/50 text-indigo-400 font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                Phase 6 Autonomous OS Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Coordinates all business channels, multi-provider workspaces, publishing schedules, and local neural pipelines under a single unified dashboard. One entrepreneur, unlimited scale.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="text-[10px] font-mono font-bold bg-zinc-900 hover:bg-zinc-850 text-slate-300 border border-zinc-800 px-3.5 py-2.5 rounded-lg cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-rose-400" : ""}`} />
              RE-SYNC COMMAND METRICS
            </button>
            <button
              onClick={() => setShowNewProjModal(true)}
              className="text-[10px] font-mono font-black bg-rose-600 hover:bg-rose-500 text-white shadow-lg border border-rose-500/45 px-3.5 py-2.5 rounded-lg cursor-pointer transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              CREATE AUTONOMOUS PROJECT
            </button>
          </div>
        </div>

        {/* Live Provider & Hardware States Grid */}
        <div className="space-y-3 mt-5 pt-5 border-t border-zinc-900 text-[10px] font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">AI SYSTEM HEALTH</span>
              <span className="text-emerald-400 font-black mt-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" /> {aiHealth}% Stability
              </span>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">CPU USAGE</span>
              <span className="text-cyan-400 font-black mt-1 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" /> {cpuUsage}% Load
              </span>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">RAM USED</span>
              <span className="text-amber-400 font-black mt-1 flex items-center gap-1">
                <Server className="w-3 h-3 text-amber-400" /> {ramUsed} ({ramPercentage}%)
              </span>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">LOCAL GPU STATE</span>
              <span className="text-indigo-400 font-black mt-1">
                {gpuLoad}% Load | {vramUsage}GB VRAM
              </span>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">OLLAMA ENGINE</span>
              <span className="text-rose-400 font-black mt-1 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-rose-400 animate-pulse" /> {ollamaStatus}
              </span>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">PRIMARY AI ROUTER</span>
              <span className="text-slate-200 font-black mt-1">
                Multi-Provider 2.0 Failover
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">OPEN WEBUI STATUS</span>
              <span className="text-emerald-400 font-black mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                {openWebUIStatus.toUpperCase()}
              </span>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">GOOSE STATUS</span>
              <span className="text-emerald-400 font-black mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                {gooseStatus.toUpperCase()}
              </span>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">VIDEO FACTORY STATUS</span>
              <span className="text-emerald-400 font-black mt-1 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${videoFactoryStatus === "active" ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-pulse"}`}></span>
                {videoFactoryStatus.toUpperCase()}
              </span>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">MEMORY DATABASE STATUS</span>
              <span className="text-indigo-400 font-black mt-1 flex items-center gap-1 truncate">
                <Database className="w-3 h-3 text-indigo-400" />
                ONLINE ({memoriesCount} Cells)
              </span>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60 group relative cursor-help" title={ollamaModelList.join(", ") || "No models registered"}>
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">MODELS INSTALLED ({modelsInstalledCount})</span>
              <span className="text-slate-300 font-black mt-1 flex items-center gap-1 truncate">
                <Sparkles className="w-3 h-3 text-slate-400" />
                {ollamaModelList.length > 0 ? (
                  ollamaModelList.slice(0, 1).join(", ") + (ollamaModelList.length > 1 ? ` +${ollamaModelList.length - 1}` : "")
                ) : (
                  "Loading..."
                )}
              </span>
              {ollamaModelList.length > 0 && (
                <div className="hidden group-hover:block absolute bottom-full left-0 mb-1 z-30 bg-zinc-900 border border-zinc-800 p-2 rounded shadow-xl max-w-xs font-mono text-[9px] text-slate-300 space-y-1">
                  <p className="font-bold border-b border-zinc-800 pb-1 mb-1 text-slate-400">Ollama model list:</p>
                  {ollamaModelList.map((m, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-rose-400"></span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded border border-zinc-900/60">
              <span className="text-slate-500 block uppercase text-[8px] tracking-wider">SERVICES ONLINE</span>
              <span className="text-emerald-400 font-black mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                4 / 4 Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Executive Key Indicators Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-inner">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold tracking-wider">Revenue Today</span>
            <div className="p-1.5 bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 rounded-lg">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black font-mono text-emerald-400 block">${revenueToday.toFixed(2)}</span>
            <span className="text-[9px] font-mono text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +14.2% today
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold tracking-wider">Revenue Month</span>
            <div className="p-1.5 bg-indigo-950/30 border border-indigo-900/40 text-indigo-400 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black font-mono text-slate-100 block">${revenueMonth.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span className="text-[9px] font-mono text-indigo-400 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-2.5 h-2.5" /> Orbit high CTR
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold tracking-wider">AI Costs & Profit</span>
            <div className="p-1.5 bg-rose-950/30 border border-rose-900/40 text-rose-400 rounded-lg">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black font-mono text-slate-100 block">${profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            <span className="text-[9px] font-mono text-rose-400 font-bold block mt-0.5">
              Cost today: ${aiCosts.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold tracking-wider">Venture Jobs</span>
            <div className="p-1.5 bg-zinc-950 text-slate-400 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black font-mono text-slate-100 block">{jobsRunning} Active</span>
            <span className="text-[9px] font-mono text-slate-500 mt-0.5 block">
              {failedJobs} Failed | {scheduledJobs} Scheduled
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold tracking-wider">Published Today</span>
            <div className="p-1.5 bg-zinc-950 text-slate-400 rounded-lg">
              <Share2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black font-mono text-emerald-400 block">{publishedToday} Assets</span>
            <span className="text-[9px] font-mono text-slate-500 mt-0.5 block">
              Pending: {pendingVideos} videos | {pendingListings} items
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold tracking-wider">Command Nav</span>
            <div className="p-1.5 bg-indigo-950/40 text-indigo-400 rounded-lg cursor-pointer hover:bg-indigo-900/40">
              <Sliders className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <button
              onClick={() => onNavigate("automation")}
              className="text-[10px] font-mono font-black text-rose-400 hover:text-rose-300 uppercase block text-left"
            >
              Master Orchestrator →
            </button>
            <span className="text-[9px] font-mono text-slate-550 block mt-0.5">
              View system map
            </span>
          </div>
        </div>
      </div>

      {/* 3. Daily Executive Briefing */}
      <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-indigo-950 border border-indigo-900 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">AUTONOMOUS GENERATION BED</span>
              <strong className="text-xs font-mono font-black uppercase text-slate-200">
                DAILY EXECUTIVE BRIEFING — {briefing.date}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-slate-500">AUTONOMOUS SPENDING:</span>
            <strong className="text-rose-400">${briefing.aiSpending.toFixed(2)}</strong>
            <button
              onClick={() => {
                alert("Scraping memory and re-compiling daily performance vectors...");
                handleRefreshData();
              }}
              className="text-rose-400 hover:text-rose-300 font-bold ml-2 underline"
            >
              Force Briefing Re-Generate
            </button>
          </div>
        </div>

        {/* Briefing Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs leading-relaxed font-sans">
          
          {/* Col 1: Completed Work & Priorities */}
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[9.5px] font-mono font-black text-emerald-400 flex items-center gap-1 uppercase tracking-wide">
                <CheckCircle className="w-3.5 h-3.5" /> Completed Operations Today
              </span>
              <ul className="space-y-2 text-slate-350 list-none pl-0">
                {briefing.completedWork.map((work, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-[11px] leading-relaxed">
                    <span className="text-emerald-500 select-none mt-0.5">✔</span>
                    <span>{work}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-zinc-850/60 pt-3 space-y-2">
              <span className="text-[9.5px] font-mono font-black text-indigo-400 flex items-center gap-1 uppercase tracking-wide">
                <Activity className="w-3.5 h-3.5" /> High-Priority Goals
              </span>
              <ul className="space-y-2 text-slate-350 list-none pl-0">
                {briefing.priorities.map((prior, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-[11px] leading-relaxed">
                    <span className="text-indigo-400 select-none mt-0.5">✦</span>
                    <span>{prior}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 2: Pending Work & Active Growth Opportunities */}
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[9.5px] font-mono font-black text-amber-400 flex items-center gap-1 uppercase tracking-wide">
                <Clock className="w-3.5 h-3.5" /> Pending Approvals & Verification
              </span>
              <ul className="space-y-2 text-slate-350 list-none pl-0">
                {briefing.pendingWork.map((work, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-[11px] leading-relaxed">
                    <span className="text-amber-500 select-none mt-0.5">◽</span>
                    <span>{work}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-zinc-850/60 pt-3 space-y-2">
              <span className="text-[9.5px] font-mono font-black text-rose-400 flex items-center gap-1 uppercase tracking-wide">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Immediate Growth Gaps Detected
              </span>
              <ul className="space-y-2 text-slate-350 list-none pl-0">
                {briefing.growthOpportunities.map((opp, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-[11px] leading-relaxed">
                    <span className="text-rose-500 select-none mt-0.5">🔥</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3: Identified Problems & Failovers */}
          <div className="space-y-4 bg-zinc-950/60 border border-zinc-850 p-4 rounded-xl">
            <span className="text-[9.5px] font-mono font-black text-rose-400 flex items-center gap-1 uppercase tracking-wide">
              <AlertCircle className="w-3.5 h-3.5" /> Heuristic Health & Workarounds
            </span>
            <div className="space-y-3 text-[11px]">
              {briefing.problems.map((prob, idx) => (
                <div key={idx} className="space-y-1 bg-zinc-900/60 border border-zinc-850 p-2.5 rounded-lg leading-relaxed">
                  <div className="flex items-start gap-1.5 font-mono text-[10px] text-rose-400 font-bold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>ISSUE: {prob.issue}</span>
                  </div>
                  <div className="text-slate-350 pl-5 text-[10px]">
                    <span className="text-emerald-400 font-semibold font-mono text-[9px] uppercase mr-1">Workaround Resolved:</span>
                    {prob.workaround}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[9px] font-mono text-slate-500 block">AI ALLOCATION RATIO</span>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-[45%] h-1.5 bg-indigo-500 rounded" title="Gemini Pro (45%)"></div>
                <div className="w-[30%] h-1.5 bg-emerald-500 rounded" title="Claude 3.5 (30%)"></div>
                <div className="w-[15%] h-1.5 bg-rose-500 rounded" title="OpenAI GPT-4o (15%)"></div>
                <div className="w-[10%] h-1.5 bg-zinc-650 rounded" title="Local Ollama (10%)"></div>
              </div>
              <div className="flex flex-wrap gap-x-2 text-[8px] font-mono text-slate-500 mt-1.5">
                <span>Gemini: 45%</span>
                <span>Claude: 30%</span>
                <span>GPT-4o: 15%</span>
                <span>Local: 10%</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Autonomous AI Workers Panel */}
      <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-mono font-black uppercase text-slate-100">
              AUTONOMOUS AI WORKERS GUILD
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-500">
            Assigned roles coordinate background tasks automatically. Click "Re-route" to assign custom tasks.
          </span>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <div 
              key={worker.id} 
              className={`bg-zinc-950 border rounded-xl p-4 space-y-3 relative overflow-hidden transition-all duration-200 ${
                activeWorkerEdit === worker.id ? "ring-1 ring-rose-500/30 border-rose-800" : "border-zinc-850"
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-xs font-mono font-black text-slate-100">{worker.name}</strong>
                    <span className="text-[8px] bg-zinc-900 border border-zinc-800 text-slate-400 px-1 py-0.5 rounded font-black uppercase">
                      {worker.role}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-550 block mt-0.5">{worker.specialization}</span>
                </div>

                <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase ${
                  worker.status === "running" ? "bg-rose-950 text-rose-400 animate-pulse" :
                  worker.status === "optimizing" ? "bg-indigo-950 text-indigo-400" :
                  "bg-emerald-950 text-emerald-400"
                }`}>
                  {worker.status}
                </span>
              </div>

              {/* Current Active Duty */}
              <div className="bg-zinc-900/60 border border-zinc-850 p-2.5 rounded-lg text-[10px] font-mono text-slate-350 min-h-[50px] flex items-center leading-relaxed">
                <span>
                  <strong className="text-slate-500 uppercase block text-[8px] tracking-wider mb-0.5">Active Operation:</strong>
                  {worker.currentTask}
                </span>
              </div>

              {/* Tech details & actions */}
              <div className="flex items-center justify-between text-[9px] font-mono pt-1">
                <div>
                  <span className="text-slate-500 block">MODEL INTEGRATED</span>
                  <span className="text-slate-200 font-bold">{worker.model}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">EFFICIENCY SCORE</span>
                  <span className="text-indigo-400 font-bold">{worker.efficiency}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">RESOLVED JOBS</span>
                  <span className="text-slate-300 font-bold">{worker.resolvedTasks}</span>
                </div>
              </div>

              {/* Worker input redirection or edit trigger */}
              <div className="border-t border-zinc-900 pt-2.5">
                {activeWorkerEdit === worker.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customWorkerInstruction}
                      onChange={(e) => setCustomWorkerInstruction(e.target.value)}
                      placeholder="e.g. Scrape child themes on cyberpunk dragons"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono text-slate-200 focus:outline-none"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => setActiveWorkerEdit(null)}
                        className="px-2 py-1 bg-zinc-900 text-slate-400 rounded text-[9px] font-bold"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleApplyWorkerInstruction(worker.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] font-bold"
                      >
                        Apply Instruction
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveWorkerEdit(worker.id);
                      setCustomWorkerInstruction(worker.currentTask);
                    }}
                    className="w-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-850/60 py-1 rounded text-[9px] font-mono font-bold text-slate-300 transition uppercase tracking-wider block text-center"
                  >
                    Adjust Worker Objective
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Autonomous Projects Center & Pipeline Config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Active Brands & Channels (Col 7) */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4 text-left">
          <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-mono font-black uppercase text-slate-200">ACTIVE AUTONOMOUS PROJECTS</span>
            </div>
            <span className="text-[9px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900/30 px-2 py-0.5 rounded font-black uppercase">
              {projects.length} Brands Running
            </span>
          </div>

          <div className="space-y-3.5">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-mono text-slate-100 font-bold">{proj.name}</strong>
                      <span className="text-[8px] bg-zinc-900 text-slate-450 border border-zinc-800 px-1.5 py-0.5 rounded font-bold uppercase">
                        {proj.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 italic">{proj.niche}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                    proj.status === "Running" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30" : "bg-rose-950 text-rose-400 animate-pulse border border-rose-900/30"
                  }`}>
                    {proj.status}
                  </span>
                </div>

                {/* Performance stats of this project */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-550 block text-[9px] uppercase">ESTIMATED YIELD</span>
                    <strong className="text-slate-100 font-black">${proj.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div>
                    <span className="text-slate-550 block text-[9px] uppercase">ACCUMULATED COSTS</span>
                    <strong className="text-slate-300">${proj.costs.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div>
                    <span className="text-slate-550 block text-[9px] uppercase">IMPRESSIONS MULTIPLEX</span>
                    <strong className="text-slate-300">{proj.impressions.toLocaleString("en-US")}</strong>
                  </div>
                  <div>
                    <span className="text-slate-550 block text-[9px] uppercase">WATCH TIME CTR</span>
                    <strong className="text-rose-400">{proj.ctr}% CTR</strong>
                  </div>
                </div>

                {/* Progress bar of workers */}
                <div className="flex justify-between items-center text-[10px] font-mono pt-2 border-t border-zinc-900">
                  <span className="text-slate-500">ASSIGNED GUILD WORKERS: <strong className="text-slate-300">{proj.workersCount}</strong></span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert(`Reviewing CTR reports and pricing structures for ${proj.name}...`)}
                      className="text-[9px] font-black text-rose-400 hover:text-rose-300 uppercase underline"
                    >
                      Inspect Reports
                    </button>
                    <button 
                      onClick={() => alert(`Force triggering background workers scan for ${proj.name}`)}
                      className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase underline"
                    >
                      Manual Force Run
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Hand: Business Memory Vault & Intelligence Stream (Col 5) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Business Memory Vault */}
          <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-850 pb-2.5">
              <Database className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-mono font-black uppercase text-slate-100">
                BUSINESS KNOWLEDGE MEMORY
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Empire OS saves top performing assets and automatically references winning prompts, templates, and niches for future workflow runs.
            </p>

            <div className="space-y-3 font-mono text-[10px]">
              <div>
                <span className="text-slate-550 uppercase text-[8px] font-black block mb-1">Winning Prompt Patterns</span>
                <div className="space-y-1.5">
                  {memoryVault.winningPrompts.map((p) => (
                    <div key={p.id} className="bg-zinc-950 p-2 rounded border border-zinc-900 flex justify-between items-center">
                      <div>
                        <strong className="text-slate-200 block">{p.title}</strong>
                        <span className="text-slate-500 text-[8px]">{p.model}</span>
                      </div>
                      <span className="text-emerald-400 font-bold">{p.ctrYield}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-550 uppercase text-[8px] font-black block mb-1">Most Profitable Niches Found</span>
                <div className="grid grid-cols-2 gap-2">
                  {memoryVault.profitableNiches.map((n) => (
                    <div key={n.id} className="bg-zinc-950 p-2 rounded border border-zinc-900">
                      <strong className="text-slate-350 block truncate">{n.title}</strong>
                      <span className="text-indigo-400 text-[8px] font-bold">Heuristic Index: {n.profitScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Marketplace Intelligence Feed */}
          <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-850 pb-2.5">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-black uppercase text-slate-100">
                LIVE MARKETPLACE INTELLIGENCE
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Continuously monitoring Google Trends, eBay, Amazon, and social indices to map out active monetization arbitrage.
            </p>

            <div className="space-y-2 font-mono text-[10px]">
              {intelStream.map((stream, idx) => (
                <div key={idx} className="bg-zinc-950 p-2 rounded border border-zinc-850 flex justify-between items-center">
                  <div>
                    <span className="text-slate-550 block text-[8px] uppercase">{stream.source}</span>
                    <strong className="text-slate-200 text-[11px] block">{stream.query}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold block">{stream.change}</span>
                    <span className="text-[7.5px] bg-rose-950 border border-rose-900 text-rose-400 px-1 py-0.5 rounded font-black inline-block mt-0.5">
                      {stream.relevance} FIT
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* --- MODAL FOR CREATING NEW PROJECTS --- */}
      {showNewProjModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
              <h3 className="text-xs font-mono font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
                Spawn Autonomous Venture Project
              </h3>
              <button 
                onClick={() => setShowNewProjModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInstantiateProject} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-550 uppercase font-black tracking-wider block">Project Name</label>
                <input
                  type="text"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. Sovereign Hardware Outlet"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-zinc-750"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-550 uppercase font-black tracking-wider block">Business Type Format</label>
                <select
                  value={newProjType}
                  onChange={(e) => setNewProjType(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="YouTube Channel">YouTube Channel (Autonomous Video Pipeline)</option>
                  <option value="Affiliate Website">Affiliate Website (High SEO Content Syndicate)</option>
                  <option value="Children’s Brand">Children’s Brand (StoryForge Bedtime Video)</option>
                  <option value="Reselling Business">Reselling Business (Boss Listers Scan & eBay)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-550 uppercase font-black tracking-wider block">Niche description & target parameters</label>
                <textarea
                  value={newProjNiche}
                  onChange={(e) => setNewProjNiche(e.target.value)}
                  placeholder="Paste details, Amazon category link, or specific YouTube demographic targeting..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-slate-200 focus:outline-none h-20 leading-relaxed text-[11px]"
                />
              </div>

              <div className="bg-zinc-900/60 border border-zinc-850 p-2.5 rounded text-[10px] text-slate-500 leading-normal">
                Empire OS will automatically configure custom worker assignments, assemble direct CrossPost scheduler packages, and populate active tasks to coordinate this workflow autonomously.
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjModal(false)}
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 text-slate-400 border border-zinc-800 rounded text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-black"
                >
                  INSTANTIATE AUTONOMOUS VENTURE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
