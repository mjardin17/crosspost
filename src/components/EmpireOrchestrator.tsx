import React, { useState, useEffect } from "react";
import { 
  Workflow, Zap, Play, RefreshCw, Cpu, Database, BarChart2, Share2, 
  Settings, Layers, Clock, Activity, PlayCircle, Plus, Trash2, Copy, 
  Check, Sliders, Volume2, Edit3, Send, AlertTriangle, ShieldCheck, 
  Award, BookOpen, Star, FileText, ChevronRight, Eye, Sparkles, 
  DollarSign, TrendingUp, HelpCircle, Network, ListChecks, Tv, 
  Headphones, Radio, Video, Layers2, Shield, Calendar, Search, Filter, 
  FolderOpen, History, ThumbsUp, ArrowUpRight, Flame, CheckCircle2, X,
  Download, Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types definition
interface Job {
  id: string;
  name: string;
  type: string;
  status: "queued" | "running" | "waiting" | "retrying" | "completed" | "failed" | "canceled";
  progress: number;
  provider: string;
  cost: number;
  runtime: string;
  timeStarted?: string;
  logs: string[];
}

interface WorkflowNode {
  id: string;
  type: "research" | "script" | "images" | "video" | "voice" | "music" | "crosspost" | "listers" | "storyforge" | "delay";
  label: string;
  provider: string;
  status: "idle" | "active" | "success" | "error";
  x: number;
  y: number;
}

interface Asset {
  id: string;
  name: string;
  type: "script" | "image" | "video" | "voice" | "music" | "thumbnail" | "listing" | "book" | "metadata";
  size: string;
  version: string;
  tags: string[];
  created: string;
  url?: string;
}

interface PerformanceMetric {
  id: string;
  name: string;
  module: string;
  views: number;
  ctr: number;
  retention: number;
  roi: number;
  watchTime: string;
  revenue: number;
  bestHook: string;
  bestModelCombo: string;
}

export default function EmpireOrchestrator() {
  const [activeTab, setActiveTab] = useState<"orchestrator" | "jobs" | "workflow" | "assets" | "router" | "analytics">("orchestrator");

  // Dynamic system status
  const [systemUptime, setSystemUptime] = useState<string>("12d 4h 32m");
  const [apiCallsCount, setApiCallsCount] = useState<number>(4829);
  const [gpuLoad, setGpuLoad] = useState<number>(42);
  const [vramUsage, setVramUsage] = useState<number>(14.8);
  const [healthScore, setHealthScore] = useState<number>(99.4);
  const [accumulatedCost, setAccumulatedCost] = useState<number>(1.242);

  // Active inputs
  const [projectName, setProjectName] = useState<string>("Autonomous AI SaaS Documentary");
  const [seedInput, setSeedInput] = useState<string>("Explain how sub-millisecond high-frequency trading arbitrage loops are built on top of AWS Local Zones.");
  const [videoFormat, setVideoFormat] = useState<string>("YouTube Long Form (16:9)");
  const [targetAudience, setTargetAudience] = useState<string>("Finance Professionals & Tech Enthusiasts");

  // Router Mappings with failover support
  const [routerConfig, setRouterConfig] = useState([
    { stage: "Research & Grounding", primary: "Gemini 1.5 Pro", failover: "Gemini 1.5 Flash", costPer1k: 0.007 },
    { stage: "Script & Dialogue", primary: "Claude 3.5 Sonnet", failover: "GPT-4o", costPer1k: 0.015 },
    { stage: "Visual Scene Layout", primary: "GPT-4o", failover: "Claude 3.5 Haiku", costPer1k: 0.012 },
    { stage: "Image Generation", primary: "Imagen 3 (Cinematic)", failover: "Flux.1 Pro Node", costPer1k: 0.030 },
    { stage: "Video Generation", primary: "Veo Generative Node", failover: "Runway Gen-3 Pro", costPer1k: 0.080 },
    { stage: "Voice Synthesis", primary: "ElevenLabs (Investigative BBC)", failover: "OpenAI Audio Engine", costPer1k: 0.024 },
    { stage: "Background Music", primary: "Suno AI v4", failover: "Udio Pro Client", costPer1k: 0.015 },
    { stage: "Social Publishing Pack", primary: "Claude 3.5 Sonnet", failover: "Llama 3.1 70B", costPer1k: 0.004 }
  ]);

  // Asset Search / Filter State
  const [assetSearch, setAssetSearch] = useState<string>("");
  const [assetFilter, setAssetFilter] = useState<string>("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Background Jobs state
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "job-8371",
      name: "Sovereign Node Affiliate Promo (HFT Arbitrage)",
      type: "Affiliate Video Syndicate",
      status: "running",
      progress: 62,
      provider: "Claude 3.5 Sonnet + Veo",
      cost: 0.384,
      runtime: "1m 45s",
      timeStarted: "1m ago",
      logs: [
        "[07:55:01] [ORCH_SYS] Registering incoming product ID for 'Sovereign Node Workstation'...",
        "[07:55:03] [RESEARCH_GEMINI] Crawled specs, identified key hook: 'Private self-hosted secure nodes'",
        "[07:55:12] [WRITER_CLAUDE] Screenplay draft written. High watch-time retention trigger mapped to first 3 seconds.",
        "[07:55:25] [VOICE_ELEVEN] Narration voiceover WAV compiled. Rhythmic pacing aligned perfectly.",
        "[07:55:48] [VIDEO_VEO] Rendering Scene 2/5 (FPV drone swoop of mainframe server rack) in 1080p...",
        "[07:56:10] [VIDEO_VEO] Video render progressing. Frame analysis matching character parameters."
      ]
    },
    {
      id: "job-8372",
      name: "StoryForge Children Book: Leo and Neon Panther",
      type: "StoryForge Media Pipeline",
      status: "completed",
      progress: 100,
      provider: "Gemini 1.5 Pro + Suno",
      cost: 0.281,
      runtime: "2m 14s",
      timeStarted: "5m ago",
      logs: [
        "[07:49:12] [STORYFORGE_ENG] Loading Child details: Leo, Age 6, Theme: Cybernetic Jungle.",
        "[07:49:18] [WRITER_CLAUDE] Book chapters generated (The Whispering Circuits). Beautiful bedtime pacing.",
        "[07:49:45] [IMAGE_IMAGEN] Generated 8 high-contrast watercolor story illustrations.",
        "[07:50:30] [VOICE_ELEVEN] Narrator Voice synthesized using warm grandfather voiceover engine.",
        "[07:51:00] [AUDIO_MASTERING] Complete audio bed and soundscape mixed with Suno space-synth lofi track.",
        "[07:51:26] [KDP_BUNDLER] Assembled Amazon Kindle Direct Publishing print-ready PDF and promotional assets."
      ]
    },
    {
      id: "job-8373",
      name: "CrossPost: Weekly High-CTR TikTok Blast",
      type: "Continuous SEO Arbitrage",
      status: "queued",
      progress: 0,
      provider: "Claude 3.5 Sonnet",
      cost: 0.0,
      runtime: "0s",
      logs: [
        "[07:56:00] [ORCH_SYS] Enqueued task for autonomous cross-posting sequence.",
        "[07:56:00] [ORCH_SYS] Waiting for thread slot partition."
      ]
    },
    {
      id: "job-8374",
      name: "Boss Listers: Amazon Scanner Arbitrage Copy",
      type: "eCommerce Fast-Moat",
      status: "failed",
      progress: 45,
      provider: "GPT-4o (Primary)",
      cost: 0.052,
      runtime: "24s",
      logs: [
        "[07:40:02] [SCANNER] Scanning Barcode: 978-0132350884...",
        "[07:40:05] [MARKET_ANALYZER] Comparing competitor listings. Detected 4 duplicate Amazon items.",
        "[07:40:12] [GPT-4o] Writing optimized listing templates...",
        "[07:40:26] [GPT-4O_PRIMARY] Error: Rate limit or network timeout on OpenAI socket.",
        "[07:40:27] [ORCH_SYS] Alert: GPT-4o mapping failed on writing stage.",
        "[07:40:27] [FAILOVER_ENGINE] Executing dynamic failover routing to: Claude 3.5 Sonnet...",
        "[07:40:28] [ORCH_SYS] Operation failed due to manual cancellation request or database connection reset."
      ]
    }
  ]);

  // Performance analytics metric records (Global Memory CTR tracker)
  const [analyticsData, setAnalyticsData] = useState<PerformanceMetric[]>([
    { id: "p-01", name: "The Cybernetic Jungle Bedtime Short", module: "StoryForge Media Pipeline", views: 248100, ctr: 16.4, retention: 78.2, roi: 340, watchTime: "12,400h", revenue: 840.50, bestHook: "Your child's favorite animal has a secret...", bestModelCombo: "Claude 3.5 + Imagen 3 + ElevenLabs" },
    { id: "p-02", name: "Fiber Optic Arbitrage Loop Explained", module: "Autonomous Video Syndicate", views: 184500, ctr: 12.8, retention: 64.9, roi: 190, watchTime: "8,950h", revenue: 492.00, bestHook: "A single millisecond of lag costs Wall Street a trillion dollars.", bestModelCombo: "Gemini 1.5 Pro + Veo + Suno" },
    { id: "p-03", name: "Sovereign Workstation eCommerce Scan", module: "eCommerce Fast-Moat", views: 94200, ctr: 14.1, retention: 58.4, roi: 540, watchTime: "3,120h", revenue: 1250.00, bestHook: "Why tech giants want this offline node banned.", bestModelCombo: "Claude 3.5 + Flux.1 + CrossPost" }
  ]);

  // Asset Vault Storage database
  const [assetsList, setAssetsList] = useState<Asset[]>([
    { id: "ast-001", name: "fiber_arbitrage_screenplay.md", type: "script", size: "18.4 KB", version: "v2.1", tags: ["HFT", "arbitrage", "script"], created: "10 mins ago" },
    { id: "ast-002", name: "leo_neon_panther_bedtime.wav", type: "voice", size: "14.2 MB", version: "v1.2", tags: ["Leo", "panther", "ElevenLabs"], created: "20 mins ago" },
    { id: "ast-003", name: "cyber_jungle_cover_art.png", type: "image", size: "3.2 MB", version: "v1.0", tags: ["watercolor", "panther", "thumbnail"], created: "25 mins ago" },
    { id: "ast-004", name: "server_room_fpv_clip.mp4", type: "video", size: "28.5 MB", version: "v1.0", tags: ["Server", "Veo", "B-roll"], created: "5 mins ago" },
    { id: "ast-005", name: "arbitrage_lofi_drone.mp3", type: "music", size: "8.1 MB", version: "v1.0", tags: ["Suno", "ambient", "soundtrack"], created: "12 mins ago" },
    { id: "ast-006", name: "kindle_print_layout_formatted.pdf", type: "book", size: "4.8 MB", version: "v3.0", tags: ["KDP", "print-ready", "bedtime"], created: "1 hour ago" },
    { id: "ast-007", name: "sovereign_node_ebay_listing.json", type: "listing", size: "2.4 KB", version: "v1.1", tags: ["eBay", "Amazon", "SaaS"], created: "1 hour ago" },
    { id: "ast-008", name: "crosspost_tiktok_meta.json", type: "metadata", size: "1.2 KB", version: "v1.0", tags: ["TikTok", "SEO", "hashtags"], created: "2 mins ago" }
  ]);

  // Workflow Builder Nodes
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([
    { id: "node-1", type: "research", label: "Autonomous Grounding Research", provider: "Gemini 1.5 Pro", status: "success", x: 40, y: 150 },
    { id: "node-2", type: "script", label: "CTR-Optimized Screenplay Writer", provider: "Claude 3.5 Sonnet", status: "success", x: 260, y: 150 },
    { id: "node-3", type: "voice", label: "Narrator Cadence Synthesis", provider: "ElevenLabs", status: "success", x: 480, y: 70 },
    { id: "node-4", type: "images", label: "Cinematic Scene AI Illustrator", provider: "Imagen 3 (Cinematic)", status: "success", x: 480, y: 230 },
    { id: "node-5", type: "video", label: "Veo Temporal Animation Render", provider: "Veo Generative Node", status: "active", x: 700, y: 230 },
    { id: "node-6", type: "music", label: "Epic Audio Soundtrack Generator", provider: "Suno AI v4", status: "idle", x: 700, y: 70 },
    { id: "node-7", type: "crosspost", label: "Direct CrossPost Platform Depot", provider: "CrossPost Core", status: "idle", x: 920, y: 150 }
  ]);

  const [activeWorkflowPreset, setActiveWorkflowPreset] = useState<string>("Autonomous Video Syndicate");

  // Load a preset template into the drag-and-drop workflow visualizer
  const loadPresetWorkflow = (preset: string) => {
    setActiveWorkflowPreset(preset);
    if (preset === "Autonomous Video Syndicate") {
      setWorkflowNodes([
        { id: "node-1", type: "research", label: "Autonomous Grounding Research", provider: "Gemini 1.5 Pro", status: "success", x: 40, y: 150 },
        { id: "node-2", type: "script", label: "CTR-Optimized Screenplay Writer", provider: "Claude 3.5 Sonnet", status: "success", x: 260, y: 150 },
        { id: "node-3", type: "voice", label: "Narrator Cadence Synthesis", provider: "ElevenLabs", status: "success", x: 480, y: 70 },
        { id: "node-4", type: "images", label: "Cinematic Scene AI Illustrator", provider: "Imagen 3 (Cinematic)", status: "success", x: 480, y: 230 },
        { id: "node-5", type: "video", label: "Veo Temporal Animation Render", provider: "Veo Generative Node", status: "active", x: 700, y: 230 },
        { id: "node-6", type: "music", label: "Epic Audio Soundtrack Generator", provider: "Suno AI v4", status: "idle", x: 700, y: 70 },
        { id: "node-7", type: "crosspost", label: "Direct CrossPost Platform Depot", provider: "CrossPost Core", status: "idle", x: 920, y: 150 }
      ]);
    } else if (preset === "eCommerce Fast-Moat") {
      setWorkflowNodes([
        { id: "node-1", type: "listers", label: "Boss Listers Product Scan", provider: "Sovereign Barcode Reader", status: "success", x: 60, y: 150 },
        { id: "node-2", type: "research", label: "Marketplace Index Pricing Analysis", provider: "Gemini 1.5 Flash", status: "success", x: 280, y: 150 },
        { id: "node-3", type: "script", label: "Amazon/eBay Copywriter Engine", provider: "Claude 3.5 Sonnet", status: "success", x: 500, y: 150 },
        { id: "node-4", type: "video", label: "Affiliate Promo Script Generator", provider: "ChatGPT 4o", status: "idle", x: 720, y: 70 },
        { id: "node-5", type: "crosspost", label: "Multi-Store Direct Marketplace Publish", provider: "CrossPost Core", status: "idle", x: 720, y: 230 }
      ]);
    } else if (preset === "StoryForge Media Pipeline") {
      setWorkflowNodes([
        { id: "node-1", type: "storyforge", label: "StoryForge Children Book Logic", provider: "Children Writer Node", status: "success", x: 60, y: 150 },
        { id: "node-2", type: "images", label: "AI Kid Story Illustrator", provider: "Imagen 3 (Cinematic)", status: "success", x: 280, y: 150 },
        { id: "node-3", type: "voice", label: "Bedtime Audiobook Narrator", provider: "ElevenLabs (Grandfather)", status: "success", x: 500, y: 150 },
        { id: "node-4", type: "music", label: "Soothing Synth Music Background", provider: "Suno AI v4", status: "idle", x: 720, y: 150 },
        { id: "node-5", type: "crosspost", label: "Kindle Direct Publishing (KDP) Pack", provider: "Amazon Publisher API", status: "idle", x: 940, y: 150 }
      ]);
    } else {
      // Continuous SEO Arbitrage
      setWorkflowNodes([
        { id: "node-1", type: "research", label: "Trending Keyword Scraper", provider: "Gemini 1.5 Flash", status: "success", x: 60, y: 150 },
        { id: "node-2", type: "script", label: "Long-Form Documentary Screenplay", provider: "Claude 3.5 Sonnet", status: "success", x: 280, y: 150 },
        { id: "node-3", type: "video", label: "Interactive Scene Composition", provider: "Veo Generative Node", status: "success", x: 500, y: 150 },
        { id: "node-4", type: "voice", label: "Deep Vocal Authority Synth", provider: "ElevenLabs", status: "active", x: 720, y: 150 },
        { id: "node-5", type: "crosspost", label: "Automated YouTube / TikTok Scheduler", provider: "CrossPost Core", status: "idle", x: 940, y: 150 }
      ]);
    }
  };

  // State for adding custom nodes
  const [showAddNodeModal, setShowAddNodeModal] = useState<boolean>(false);
  const [customNodeLabel, setCustomNodeLabel] = useState<string>("Brand Watermark Overlay");
  const [customNodeType, setCustomNodeType] = useState<"research" | "script" | "images" | "video" | "voice" | "music" | "crosspost">("images");
  const [customNodeProvider, setCustomNodeProvider] = useState<string>("Imagen 3 (Cinematic)");

  const handleAddCustomNode = () => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now().toString().substr(9, 4)}`,
      type: customNodeType,
      label: customNodeLabel,
      provider: customNodeProvider,
      status: "idle",
      x: 350 + Math.random() * 200,
      y: 100 + Math.random() * 150
    };
    setWorkflowNodes(prev => [...prev, newNode]);
    setShowAddNodeModal(false);
  };

  // Run full pipeline via ONE-CLICK CREATOR
  const [oneClickProgress, setOneClickProgress] = useState<number>(-1);
  const [isProcessingOneClick, setIsProcessingOneClick] = useState<boolean>(false);
  const [oneClickLogs, setOneClickLogs] = useState<string[]>([]);

  const runOneClickOrchestration = () => {
    setIsProcessingOneClick(true);
    setOneClickProgress(0);
    setOneClickLogs(["[08:04:01] [ORCHESTRATOR] Starting One-Click Sovereign Pipeline Campaign..."]);

    const steps = [
      { p: 5, log: "[08:04:03] [RESEARCH] Initiating multi-channel topic crawl for High Frequency Trading. Querying Wall Street infrastructure nodes..." },
      { p: 12, log: "[08:04:06] [RESEARCH] Grounding verified. Built background indices. System latency models successfully mapped." },
      { p: 18, log: "[08:04:09] [SCRIPT] Claude 3.5 Sonnet writing full long-form narration screenplay with custom dynamic hooks." },
      { p: 25, log: "[08:04:12] [SCRIPT] Created short-form TikTok & Instagram Reels script branches for SEO split-testing." },
      { p: 32, log: "[08:04:15] [CREATIVE] Breaking narration into 6 physical visual scenes. Compiling cinematic lighting coordinates." },
      { p: 38, log: "[08:04:18] [CREATIVE] Synthesized 12 high-resolution cinematic Image prompts formatted for Imagen 3 and Midjourney." },
      { p: 44, log: "[08:04:21] [CREATIVE] Formulating physical camera movement, dolly-zooms, lens specifications, and Veo temporal video prompt variables." },
      { p: 52, log: "[08:04:24] [ASSETS] ElevenLabs generating BBC-style investigative vocal narration. Emphasizing Wall Street latency jargon." },
      { p: 58, log: "[08:04:27] [ASSETS] Suno AI v4 composing custom dark electronic lofi synth soundtrack at 110 BPM." },
      { p: 66, log: "[08:04:30] [ASSETS] Scene Builder generated server rack FPV B-rolls. Merging audio beds and vocal dialogues." },
      { p: 72, log: "[08:04:33] [PACKAGE] Generating 5 split-test Thumbnails. Main title synthesized: 'How fiber optic arbitrage loops steal trillions'." },
      { p: 80, log: "[08:04:36] [PACKAGE] Formulating SEO keyword descriptions, viral hashtag matrix, and dynamic subtitles." },
      { p: 88, log: "[08:04:39] [CROSSPOST] Assembling master JSON manifest. Formatting direct API bundles for YouTube, TikTok, Reels, X, and Pinterest." },
      { p: 95, log: "[08:04:42] [CROSSPOST] Scheduling publications for daily prime time slots. Submitting meta indexing tags." },
      { p: 100, log: "[08:04:45] [MEM_SYS] Complete campaign archived in Asset Vault. Global memory updated: CTR probability up 1.8% based on historic Wall Street topics." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setIsProcessingOneClick(false);
        setApiCallsCount(prev => prev + 18);
        setAccumulatedCost(prev => prev + 0.428);
        setGpuLoad(0);
        // Add newly completed job
        const newJob: Job = {
          id: `job-${Date.now().toString().substr(9, 4)}`,
          name: `${projectName} (Autonomous Pack)`,
          type: activeWorkflowPreset,
          status: "completed",
          progress: 100,
          provider: "Multiplexed OS Cluster",
          cost: 0.428,
          runtime: "44s",
          timeStarted: "Just now",
          logs: [...oneClickLogs, ...steps.map(s => s.log)]
        };
        setJobs(prev => [newJob, ...prev]);

        // Add to Asset Vault
        const newAsset: Asset = {
          id: `ast-${Date.now().toString().substr(9, 3)}`,
          name: `${projectName.toLowerCase().replace(/\s+/g, "_")}_master_package.json`,
          type: "metadata",
          size: "84.2 KB",
          version: "v1.0",
          tags: ["one-click", "autonomous", "compiled"],
          created: "Just now"
        };
        setAssetsList(prev => [newAsset, ...prev]);

        alert("Autonomous Multi-Step Campaign Completed and Enqueued for CrossPost Publishing!");
        return;
      }

      setOneClickProgress(steps[currentStep].p);
      setOneClickLogs(prev => [...prev, steps[currentStep].log]);
      setGpuLoad(Math.floor(80 + Math.random() * 15));
      setVramUsage(parseFloat((12 + Math.random() * 3).toFixed(1)));
      setAccumulatedCost(prev => parseFloat((prev + 0.02 + Math.random() * 0.01).toFixed(3)));

      currentStep++;
    }, 900);
  };

  // Filtered Assets list
  const filteredAssets = assetsList.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(assetSearch.toLowerCase()) || 
                          asset.tags.some(tag => tag.toLowerCase().includes(assetSearch.toLowerCase()));
    const matchesFilter = assetFilter === "all" || asset.type === assetFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 md:p-6 space-y-6 font-sans text-slate-200 animate-fadeIn relative overflow-hidden text-left">
      
      {/* Absolute Ambient Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-950/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Orchestration Header */}
      <div className="border-b border-zinc-850 pb-5">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-950/40 border border-indigo-900/50 rounded-xl flex items-center justify-center shadow-inner relative">
              <Workflow className="w-6 h-6 text-indigo-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-mono font-black text-slate-100 uppercase tracking-tight">
                  Empire OS Orchestrator
                </h3>
                <span className="text-[9px] font-mono font-black text-indigo-400 bg-indigo-950/50 border border-indigo-900/30 px-2 py-0.5 rounded tracking-widest uppercase">
                  Central Nervous System v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-normal max-w-2xl font-sans">
                The master AI orchestration platform coordinating CrossPost, StoryForge, Boss Listers AI, and Video Intelligence. Execute multi-step pipelines, customize provider mappings, view live background jobs, inspect assets, and optimize CTR dually.
              </p>
            </div>
          </div>

          {/* Quick Realtime Telemetry Stats */}
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-850 p-2.5 rounded-lg text-[10px] font-mono shrink-0 w-full xl:w-auto overflow-x-auto">
            <div>
              <span className="text-slate-500 block uppercase">STABILITY SCORE</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {healthScore}%
              </span>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <span className="text-slate-500 block uppercase">GPU LOAD CLUSTER</span>
              <span className="text-indigo-400 font-bold">{gpuLoad}%</span>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <span className="text-slate-500 block uppercase">VRAM OCCUPIED</span>
              <span className="text-rose-400 font-bold">{vramUsage} GB</span>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <span className="text-slate-500 block uppercase">ACCUMULATED COST</span>
              <span className="text-slate-200 font-bold">${accumulatedCost.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-zinc-900 mt-6 gap-1">
          {[
            { id: "orchestrator", label: "Master Orchestrator", icon: Zap },
            { id: "jobs", label: "Enterprise Job Queue", icon: Clock },
            { id: "workflow", label: "Workflow Builder", icon: Workflow },
            { id: "assets", label: "Unified Asset Vault", icon: Database },
            { id: "router", label: "AI Router 2.0", icon: Cpu },
            { id: "analytics", label: "Global Performance CTR", icon: BarChart2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 font-mono text-[10px] font-bold rounded-t border-t border-x transition-all cursor-pointer ${
                  isActive 
                    ? "bg-zinc-900 border-zinc-850 text-rose-400 shadow-[inset_0_1px_4px_rgba(244,63,94,0.05)] font-black" 
                    : "bg-transparent border-transparent text-slate-450 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Workspace Render */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.12 }}
          className="space-y-6"
        >
          {/* TAB 1: MASTER ORCHESTRATOR */}
          {activeTab === "orchestrator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: One-Click Campaign Builder (Col Span 7) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                    <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase text-slate-200">AUTONOMOUS CAMPAIGN ENGINE</span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Project Campaign Title</label>
                        <input
                          type="text"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="e.g. Wall Street fiber loop documentary"
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-zinc-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Active Workflow Template</label>
                        <select
                          value={activeWorkflowPreset}
                          onChange={(e) => loadPresetWorkflow(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
                        >
                          <option value="Autonomous Video Syndicate">Autonomous Video Syndicate</option>
                          <option value="eCommerce Fast-Moat">eCommerce Fast-Moat (Boss Listers Scan)</option>
                          <option value="StoryForge Media Pipeline">StoryForge Bedtime Video Pipeline</option>
                          <option value="Continuous SEO Arbitrage">Continuous SEO Arbitrage Channel</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Seed Parameter / Raw Content Input</label>
                      <textarea
                        value={seedInput}
                        onChange={(e) => setSeedInput(e.target.value)}
                        placeholder="Paste a raw product barcode, StoryForge character concept, URL link, or documentary focus..."
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-zinc-800 min-h-[100px] focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800 leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Video Format Constraint</label>
                        <select
                          value={videoFormat}
                          onChange={(e) => setVideoFormat(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
                        >
                          <option value="YouTube Long Form (16:9)">YouTube Long Form (16:9)</option>
                          <option value="TikTok/YouTube Shorts (9:16)">TikTok/YouTube Shorts (9:16)</option>
                          <option value="Instagram Reels (9:16)">Instagram Reels (9:16)</option>
                          <option value="Amazon/eBay Product Video">Amazon/eBay Product Videos</option>
                          <option value="KDP Kids Animated Presentation">KDP Kids Animated Book Promo</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Target Audience Demographics</label>
                        <input
                          type="text"
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          placeholder="e.g. Children aged 5-8, eBay prospective buyers"
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-zinc-700"
                        />
                      </div>
                    </div>

                    <button
                      onClick={runOneClickOrchestration}
                      disabled={isProcessingOneClick || !seedInput.trim()}
                      className="w-full bg-gradient-to-r from-indigo-650 to-rose-650 hover:from-indigo-600 hover:to-rose-600 text-white font-mono text-xs font-black py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer tracking-widest"
                    >
                      {isProcessingOneClick ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>EXECUTING AUTONOMOUS CAMPAIGN ({oneClickProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 text-white" />
                          <span>LAUNCH 15-STEP ONE-CLICK CAMPAIGN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Progressive Logger Frame */}
                {oneClickLogs.length > 0 && (
                  <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-b border-zinc-900 pb-2">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> LIVE LOG PIPELINE STREAM
                      </span>
                      <span>{oneClickLogs.length} nodes resolved</span>
                    </div>
                    <div className="max-h-[140px] overflow-y-auto font-mono text-[9.5px] text-zinc-400 space-y-1 pr-1 scrollbar-thin">
                      {oneClickLogs.map((log, idx) => (
                        <div key={idx} className="leading-normal font-medium py-0.5 border-b border-zinc-900/20 last:border-0">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Operational Stats & Mini Queue (Col Span 5) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Integration Health Matrix */}
                <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-850 pb-2.5">
                    <Layers className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-mono font-bold uppercase text-slate-200">INTEGRATED MODULE HEURISTICS</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "CrossPost Gateway", status: "Operational", statusColor: "text-emerald-400", metrics: "12 channels synced, queue healthy" },
                      { name: "StoryForge Bedtime Engine", status: "Operational", statusColor: "text-emerald-400", metrics: "v1.2 active, PDF compiler loaded" },
                      { name: "Boss Listers Scan Core", status: "Standby", statusColor: "text-amber-400", metrics: "OCR listener online, barcode v4" },
                      { name: "Video Intelligence render Node", status: "Rendering", statusColor: "text-rose-400 animate-pulse", metrics: "Veo cluster reserved, VRAM active" }
                    ].map((mod, i) => (
                      <div key={i} className="bg-zinc-950 p-2.5 rounded border border-zinc-850 flex justify-between items-center text-[10px] font-mono">
                        <div>
                          <strong className="text-slate-200 block">{mod.name}</strong>
                          <span className="text-slate-500 text-[9px]">{mod.metrics}</span>
                        </div>
                        <span className={`font-black uppercase ${mod.statusColor}`}>{mod.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Queue Summary card */}
                <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-mono font-bold uppercase text-slate-200">ACTIVE TASK SLOTS</span>
                    </div>
                    <button onClick={() => setActiveTab("jobs")} className="text-[10px] text-rose-400 hover:text-rose-300 font-mono">
                      View Queue →
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs font-mono">
                    {jobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="bg-zinc-950/80 p-2.5 rounded border border-zinc-850 space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <strong className="text-slate-200 truncate max-w-[200px]">{job.name}</strong>
                          <span className={`font-bold px-1 rounded uppercase text-[8px] ${
                            job.status === "running" ? "bg-rose-950 text-rose-400 animate-pulse" :
                            job.status === "completed" ? "bg-emerald-950 text-emerald-400" :
                            "bg-zinc-900 text-slate-500"
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${job.status === 'failed' ? 'bg-rose-600' : 'bg-indigo-500'}`} 
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ENTERPRISE BACKGROUND JOBS */}
          {activeTab === "jobs" && (
            <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-mono font-bold uppercase text-slate-200">ENTERPRISE BACKGROUND JOB QUEUE</span>
                </div>
                <div className="flex gap-2 text-[9px] font-mono text-slate-500">
                  <span>QUEUED: <strong>{jobs.filter(j=>j.status==='queued').length}</strong></span>
                  <span>RUNNING: <strong className="text-rose-400 animate-pulse">{jobs.filter(j=>j.status==='running').length}</strong></span>
                  <span>COMPLETED: <strong className="text-emerald-400">{jobs.filter(j=>j.status==='completed').length}</strong></span>
                  <span>FAILED: <strong className="text-rose-500">{jobs.filter(j=>j.status==='failed').length}</strong></span>
                </div>
              </div>

              <div className="space-y-4 text-xs font-mono">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-900 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-slate-100 font-bold">{job.name}</strong>
                          <span className="text-[9px] bg-zinc-900 text-slate-500 px-1.5 py-0.5 rounded font-black">
                            {job.id.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] text-indigo-400 font-bold mt-0.5 block">{job.type}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[10px]">
                        <div>
                          <span className="text-slate-550 mr-1">COST:</span>
                          <span className="text-slate-300 font-bold">${job.cost.toFixed(3)}</span>
                        </div>
                        <div>
                          <span className="text-slate-550 mr-1">RUNTIME:</span>
                          <span className="text-slate-300 font-bold">{job.runtime}</span>
                        </div>
                        <div>
                          <span className="text-slate-550 mr-1">PROVIDER:</span>
                          <span className="text-rose-400 font-bold">{job.provider}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          job.status === "completed" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30" :
                          job.status === "running" ? "bg-rose-950 text-rose-400 border border-rose-900/30 animate-pulse" :
                          job.status === "failed" ? "bg-rose-950/40 text-rose-500 border border-rose-900/30" :
                          "bg-zinc-900 text-slate-500 border border-zinc-800"
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Logs */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      <div className="lg:col-span-4 flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>TASK PROGRESSURATION</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${job.status === 'failed' ? 'bg-rose-600' : 'bg-indigo-500'}`}
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {job.status === "running" && (
                          <div className="bg-zinc-900/50 p-2 rounded border border-zinc-850/40 text-[9px] text-slate-500 flex items-center gap-1.5">
                            <RefreshCw className="w-3 h-3 animate-spin text-rose-400" />
                            <span>Job actively scaling computing clusters. Estimated completion in 12 seconds.</span>
                          </div>
                        )}
                        {job.status === "completed" && (
                          <div className="bg-zinc-900/50 p-2 rounded border border-zinc-850/40 text-[9px] text-emerald-500 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Direct metadata payload delivered and queued across 5 target channels.</span>
                          </div>
                        )}
                      </div>

                      {/* Job specific terminal logs */}
                      <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-[9.5px] leading-relaxed font-mono">
                        <div className="flex justify-between text-[9px] text-slate-550 mb-1.5 pb-1 border-b border-zinc-900">
                          <span>EXECUTION STEPS HISTORY LOG</span>
                          <span>Thread PID: {job.id}</span>
                        </div>
                        <div className="max-h-[90px] overflow-y-auto space-y-1 scrollbar-thin pr-1 text-zinc-400">
                          {job.logs.map((log, i) => (
                            <div key={i}>{log}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATION WORKFLOW BUILDER */}
          {activeTab === "workflow" && (
            <div className="space-y-6">
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-3">
                  <div className="flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase text-slate-200">INTERACTIVE DRAG-AND-DROP AUTOMATION BUILDER</span>
                  </div>

                  {/* Preset workflows */}
                  <div className="flex gap-1 bg-zinc-950 border border-zinc-800 p-1 rounded text-[9.5px] font-mono">
                    {[
                      "Autonomous Video Syndicate",
                      "eCommerce Fast-Moat",
                      "StoryForge Media Pipeline",
                      "Continuous SEO Arbitrage"
                    ].map((p) => (
                      <button
                        key={p}
                        onClick={() => loadPresetWorkflow(p)}
                        className={`px-2 py-1 rounded cursor-pointer ${
                          activeWorkflowPreset === p ? "bg-indigo-950 border border-indigo-900 text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {p.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Visually configure and inspect the exact execution stream. Connect steps from initial Boss Listers barcodes or children bedtime parameters through multi-stage AI generators to automatic CrossPost dispatch packages.
                </p>

                {/* Workflow Canvas Simulation */}
                <div className="relative bg-zinc-950 border border-zinc-850 rounded-xl min-h-[300px] overflow-hidden p-6 flex items-center justify-center">
                  
                  {/* Grid Lines background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>

                  <div className="relative w-full overflow-x-auto min-h-[220px]">
                    
                    {/* Visual Connection Vector lines */}
                    <div className="absolute inset-0 pointer-events-none hidden md:block">
                      <svg className="w-full h-full" style={{ minWidth: "1000px" }}>
                        <g stroke="#312e81" strokeWidth="2" fill="none" strokeDasharray="4 2">
                          {workflowNodes.map((node, index) => {
                            if (index === workflowNodes.length - 1) return null;
                            const nextNode = workflowNodes[index + 1];
                            return (
                              <path 
                                key={index} 
                                d={`M ${node.x + 180} ${node.y + 35} C ${(node.x + nextNode.x) / 2 + 100} ${node.y + 35}, ${(node.x + nextNode.x) / 2 - 100} ${nextNode.y + 35}, ${nextNode.x} ${nextNode.y + 35}`} 
                                className="stroke-indigo-800/80 animate-pulse"
                              />
                            );
                          })}
                        </g>
                      </svg>
                    </div>

                    <div className="flex gap-6 items-center min-w-[1000px] justify-between relative py-6">
                      {workflowNodes.map((node, i) => {
                        const isSuccess = node.status === "success";
                        const isActive = node.status === "active";
                        const isIdle = node.status === "idle";
                        
                        return (
                          <div 
                            key={node.id}
                            className={`p-3.5 border rounded-xl shadow-lg w-[190px] text-xs font-mono select-none relative transition-all ${
                              isActive 
                                ? "bg-rose-950/30 border-rose-700 text-rose-300 ring-1 ring-rose-500/15" 
                                : isSuccess 
                                  ? "bg-zinc-900 border-zinc-800 text-slate-200" 
                                  : "bg-zinc-950 border-zinc-900 text-slate-600"
                            }`}
                          >
                            <div className="flex justify-between items-center text-[8px] text-slate-550 border-b border-zinc-900 pb-1.5 mb-1.5">
                              <span className="uppercase font-bold">{node.type}</span>
                              <span className={`font-bold uppercase ${isActive ? 'text-rose-400 animate-pulse' : isSuccess ? 'text-emerald-400' : 'text-zinc-650'}`}>
                                {node.status}
                              </span>
                            </div>

                            <strong className="block text-[11px] leading-tight font-bold text-slate-100">{node.label}</strong>
                            
                            <div className="mt-2.5 pt-1.5 border-t border-zinc-900/60 flex justify-between items-center text-[9px]">
                              <span className="text-slate-550">PROVIDER:</span>
                              <span className="text-indigo-400 font-bold">{node.provider}</span>
                            </div>

                            {/* Node action hooks */}
                            <button 
                              onClick={() => {
                                setWorkflowNodes(prev => prev.filter(n => n.id !== node.id));
                              }}
                              className="absolute -top-1.5 -right-1.5 bg-zinc-950 border border-zinc-850 text-slate-500 hover:text-rose-400 p-1 rounded-full opacity-0 hover:opacity-100 transition"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add visual flow actions */}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      onClick={() => setShowAddNodeModal(true)}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-slate-350 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-indigo-400" />
                      <span>ADD WORKFLOW NODE</span>
                    </button>
                    <button
                      onClick={() => alert("Workflow modifications synced and locked inside local config.json!")}
                      className="bg-indigo-650 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>LOCK FLOW DIRECTIVES</span>
                    </button>
                  </div>
                </div>

                {/* Workflow preset configurations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-xl space-y-2 text-left">
                    <strong className="text-xs font-mono text-indigo-400 block">SYSTEM CONSTRUCT NOTE:</strong>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Empire OS Orchestrator uses a fully synchronous Stage-Gate state engine. This guarantees zero downstream generation execution unless upstream research grounded data blocks evaluate cleanly.
                    </p>
                  </div>
                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-xl space-y-2 text-left">
                    <strong className="text-xs font-mono text-rose-400 block">FAILOVER DIRECTIVE ENGINE:</strong>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Each node monitors dynamic endpoint latency parameters. If an API times out twice, the task automatically branches routing to the predefined local Ollama framework or alternate commercial LLMs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UNIFIED ASSET VAULT */}
          {activeTab === "assets" && (
            <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-850 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase text-slate-200">EMPIRE SYSTEM MEMORY ASSET VAULT</span>
                </div>

                {/* Interactive Filtering and Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search assets by tag or name..."
                      value={assetSearch}
                      onChange={(e) => setAssetSearch(e.target.value)}
                      className="bg-zinc-950 border border-zinc-850 rounded-lg pl-8 pr-3 py-1.5 text-[10.5px] font-mono text-slate-200 focus:outline-none focus:border-zinc-750"
                    />
                  </div>

                  <select
                    value={assetFilter}
                    onChange={(e) => setAssetFilter(e.target.value)}
                    className="bg-zinc-950 border border-zinc-850 rounded-lg p-1.5 text-[10.5px] font-mono text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Category Types</option>
                    <option value="script">Scripts</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="voice">Voiceovers</option>
                    <option value="music">Soundtracks</option>
                    <option value="book">Illustrated Books</option>
                    <option value="listing">Listings</option>
                  </select>
                </div>
              </div>

              {/* Grid of Assets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {filteredAssets.map((asset) => {
                  return (
                    <div 
                      key={asset.id} 
                      onClick={() => setSelectedAsset(asset)}
                      className="bg-zinc-950 border border-zinc-850 rounded-xl p-3.5 space-y-3 cursor-pointer hover:border-indigo-900 hover:bg-zinc-900/30 transition text-left"
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[8.5px] font-mono font-black px-1.5 py-0.5 rounded border uppercase ${
                          asset.type === "script" ? "bg-amber-950 text-amber-400 border-amber-900/30" :
                          asset.type === "image" ? "bg-rose-950 text-rose-400 border-rose-900/30" :
                          asset.type === "video" ? "bg-cyan-950 text-cyan-400 border-cyan-900/30" :
                          asset.type === "voice" ? "bg-emerald-950 text-emerald-400 border-emerald-900/30" :
                          "bg-indigo-950 text-indigo-400 border-indigo-900/30"
                        }`}>
                          {asset.type}
                        </span>
                        <span className="text-[9px] font-mono text-slate-550">{asset.version}</span>
                      </div>

                      <strong className="block text-xs font-mono font-bold text-slate-200 truncate mt-1">
                        {asset.name}
                      </strong>

                      <div className="flex flex-wrap gap-1">
                        {asset.tags.map((t, idx) => (
                          <span key={idx} className="bg-zinc-900 text-[8.5px] text-slate-400 font-mono px-1 py-0.2 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-[9px] font-mono text-slate-500">
                        <span>SIZE: {asset.size}</span>
                        <span>{asset.created}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: AI ROUTER 2.0 CONTROL BOARD */}
          {activeTab === "router" && (
            <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase text-slate-200">INTELLIGENT AI ROUTING CONTROLLER 2.0</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase bg-zinc-950 px-2.5 py-0.5 border border-zinc-850 rounded">
                  FAILOVER SOCKETS: ACTIVE
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Configure deep semantic routing coordinates and predefine dynamic alternate endpoints. If an API provider goes offline, the Empire OS Orchestrator seamlessly redirects execution parameters without data loss.
              </p>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-850 text-slate-550 uppercase font-mono text-[9px]">
                      <th className="py-2.5 px-3 font-bold">Execution Stage</th>
                      <th className="py-2.5 px-3 font-bold text-indigo-400">Primary Model API</th>
                      <th className="py-2.5 px-3 font-bold text-rose-400">Failover Model API</th>
                      <th className="py-2.5 px-3 font-bold text-right">Cost Per 1k Token</th>
                      <th className="py-2.5 px-3 font-bold text-right">Network Ping</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-slate-300 font-mono text-[11px]">
                    {routerConfig.map((cfg, idx) => (
                      <tr key={idx} className="hover:bg-zinc-950/40 transition">
                        <td className="py-2.5 px-3 font-bold text-slate-200">{cfg.stage}</td>
                        <td className="py-2.5 px-3">
                          <select 
                            value={cfg.primary}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRouterConfig(prev => prev.map((item, i) => i === idx ? { ...item, primary: val } : item));
                            }}
                            className="bg-zinc-950 border border-zinc-850 rounded p-1 text-[10.5px] font-mono text-slate-300 focus:outline-none w-[170px]"
                          >
                            <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                            <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                            <option value="GPT-4o">GPT-4o</option>
                            <option value="Ollama (DeepSeek-R1)">Ollama (DeepSeek-R1)</option>
                            <option value="Imagen 3 (Cinematic)">Imagen 3 (Cinematic)</option>
                            <option value="Veo Generative Node">Veo Generative Node</option>
                            <option value="ElevenLabs (Investigative BBC)">ElevenLabs (Investigative BBC)</option>
                            <option value="Suno AI v4">Suno AI v4</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3">
                          <select 
                            value={cfg.failover}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRouterConfig(prev => prev.map((item, i) => i === idx ? { ...item, failover: val } : item));
                            }}
                            className="bg-zinc-950 border border-zinc-850 rounded p-1 text-[10.5px] font-mono text-rose-400 focus:outline-none w-[170px]"
                          >
                            <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
                            <option value="Claude 3.5 Haiku">Claude 3.5 Haiku</option>
                            <option value="Ollama (Llama 3.1)">Ollama (Llama 3.1)</option>
                            <option value="GPT-4o Mini">GPT-4o Mini</option>
                            <option value="Flux.1 Pro Node">Flux.1 Pro Node</option>
                            <option value="Runway Gen-3 Pro">Runway Gen-3 Pro</option>
                            <option value="OpenAI Audio Engine">OpenAI Audio Engine</option>
                            <option value="Udio Pro Client">Udio Pro Client</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-400">${cfg.costPer1k.toFixed(3)}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">14ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: GLOBAL PERFORMANCE ANALYTICS & CTR TRACKER */}
          {activeTab === "analytics" && (
            <div className="space-y-6 text-left">
              
              {/* Analytics Top Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-4">
                  <span className="text-[9.5px] font-mono text-slate-500 uppercase block font-bold">SYNDICATE IMPRESSIONS</span>
                  <div className="text-xl font-mono font-black text-slate-100 mt-1">526,800</div>
                  <p className="text-[8.5px] text-slate-550 font-mono mt-0.5">ACROSS 12 LIVE CAMPAIGNS</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-4">
                  <span className="text-[9.5px] font-mono text-slate-500 uppercase block font-bold">AVERAGE CONVERSION CTR</span>
                  <div className="text-xl font-mono font-black text-emerald-400 mt-1">14.43%</div>
                  <p className="text-[8.5px] text-slate-550 font-mono mt-0.5">INDUSTRY AVERAGE: 4.8%</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-4">
                  <span className="text-[9.5px] font-mono text-slate-500 uppercase block font-bold">WATCH-TIME RETENTION</span>
                  <div className="text-xl font-mono font-black text-indigo-400 mt-1">67.16%</div>
                  <p className="text-[8.5px] text-slate-550 font-mono mt-0.5">ESTIMATED COMPREHENSIVE SCALE</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-4">
                  <span className="text-[9.5px] font-mono text-slate-500 uppercase block font-bold">TOTAL REVENUE (ROI)</span>
                  <div className="text-xl font-mono font-black text-rose-400 mt-1">$2,582.50</div>
                  <p className="text-[8.5px] text-slate-550 font-mono mt-0.5">AVERAGE MUTUAL ROI: 356%</p>
                </div>
              </div>

              {/* Comprehensive Campaign ROI Table */}
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">AUTONOMOUS BUSINESS METRIC ARCHIVES</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 border border-emerald-900/30 rounded uppercase">
                    CTR Matrix Updated Live
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-850 text-slate-550 uppercase font-mono text-[9px]">
                        <th className="py-2.5 px-3 font-bold">Campaign Entity</th>
                        <th className="py-2.5 px-3 font-bold">Pipeline Target</th>
                        <th className="py-2.5 px-3 font-bold text-right">Views</th>
                        <th className="py-2.5 px-3 font-bold text-right">CTR %</th>
                        <th className="py-2.5 px-3 font-bold text-right">Retention</th>
                        <th className="py-2.5 px-3 font-bold text-right">ROI %</th>
                        <th className="py-2.5 px-3 font-bold text-right">Net Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-slate-300 font-mono text-[11px]">
                      {analyticsData.map((data) => (
                        <tr key={data.id} className="hover:bg-zinc-950/40 transition">
                          <td className="py-3 px-3 font-bold text-slate-100">{data.name}</td>
                          <td className="py-3 px-3 text-indigo-400 font-bold">{data.module}</td>
                          <td className="py-3 px-3 text-right text-slate-300">{data.views.toLocaleString()}</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-bold">{data.ctr}%</td>
                          <td className="py-3 px-3 text-right text-slate-300">{data.retention}%</td>
                          <td className="py-3 px-3 text-right text-rose-400 font-bold">{data.roi}%</td>
                          <td className="py-3 px-3 text-right text-slate-100 font-bold">${data.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actionable Cognitive recommendations */}
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-zinc-850 pb-2.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold uppercase text-slate-200">GLOBAL ECOSYSTEM MEMORY COGNITIVE INSIGHTS</span>
                </div>

                <div className="space-y-2 text-xs leading-relaxed font-sans text-slate-400">
                  <div className="flex gap-2 items-start bg-zinc-950 p-3 rounded-lg border border-zinc-850">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block font-mono text-[11.5px]">ROUTING INSIGHT: Claude 3.5 Sonnet Scripting Dominance</strong>
                      <span className="text-[11px]">Based on historic metrics from Leo bedding children stories and HFT loops, scripts written by <span className="text-indigo-400 font-bold font-mono">Claude 3.5 Sonnet</span> achieve an average of <strong>4.2% higher retention watch-time</strong> than alternate GPT models. Recommended to lock Sonnet as primary Writing routing agent.</span>
                    </div>
                  </div>

                  <div className="flex gap-2 items-start bg-zinc-950 p-3 rounded-lg border border-zinc-850">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block font-mono text-[11.5px]">HOOK TUNING: Latency and Wall-street Semantic Triggering</strong>
                      <span className="text-[11px]">Keywords associated with 'Wall Street Secrets', 'Lag Trillions', and 'Private Mainframe Hardware' score <strong>74% higher conversion click-through rate CTR</strong> on vertical video layouts. Campaign generator has automatically enqueued these keywords as priority hook parameters.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* MODAL 1: ADD CUSTOM NODE */}
      {showAddNodeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
              <strong className="text-xs font-mono font-bold text-slate-200">ADD CUSTOM PIPELINE STEP</strong>
              <button onClick={() => setShowAddNodeModal(false)} className="text-slate-500 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 block">NODE LABEL NAME</label>
                <input 
                  type="text" 
                  value={customNodeLabel} 
                  onChange={(e) => setCustomNodeLabel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 text-slate-200" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 block">COGNITIVE CATEGORY TYPE</label>
                <select
                  value={customNodeType}
                  onChange={(e) => setCustomNodeType(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-850 p-1.5 rounded text-slate-300"
                >
                  <option value="research">Grounding Research</option>
                  <option value="script">Dialogue Scripting</option>
                  <option value="images">Image Composition</option>
                  <option value="video">Veo Video Generator</option>
                  <option value="voice">Voiceover Audio</option>
                  <option value="music">Background Soundtrack</option>
                  <option value="crosspost">CrossPost Dispatch</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 block">AI MODEL PROVIDER</label>
                <select
                  value={customNodeProvider}
                  onChange={(e) => setCustomNodeProvider(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 p-1.5 rounded text-slate-300"
                >
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                  <option value="GPT-4o Pro">GPT-4o Pro</option>
                  <option value="Veo Generative Node">Veo Generative Node</option>
                  <option value="ElevenLabs Master">ElevenLabs Master</option>
                  <option value="Ollama (DeepSeek-R1)">Ollama (DeepSeek-R1)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleAddCustomNode}
              className="w-full bg-indigo-650 hover:bg-indigo-600 text-white font-mono text-xs font-bold py-2 rounded-lg"
            >
              Add Node to Active Flow
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSET DETAIL PREVIEW */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
              <span className="text-[9.5px] font-mono font-black text-rose-400 bg-rose-950 border border-rose-900/30 px-2 py-0.5 rounded">
                {selectedAsset.type.toUpperCase()} PREVIEW
              </span>
              <button onClick={() => setSelectedAsset(null)} className="text-slate-500 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <strong className="text-sm font-bold text-slate-100 block">{selectedAsset.name}</strong>
                <span className="text-indigo-400 text-[10px] font-bold">Memory ID: #{selectedAsset.id}</span>
              </div>

              {/* Dynamic asset content placeholder depending on type */}
              <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-3.5 text-[10.5px] leading-relaxed text-zinc-300 min-h-[120px]">
                {selectedAsset.type === "script" && (
                  <div className="space-y-2">
                    <span className="text-slate-500 text-[8.5px] block font-bold">NARRATOR INGRESS SCREENPLAY</span>
                    <p className="italic">"Under the pitch black asphalt, millimetres from exchange transponders, secret lines carry trillions of microtransactions. They call it high-frequency arbitrage..."</p>
                  </div>
                )}
                {selectedAsset.type === "image" && (
                  <div className="flex flex-col items-center justify-center gap-2 py-2">
                    <ImageIcon className="w-12 h-12 text-indigo-400 animate-pulse" />
                    <span className="text-[9px] text-slate-500">Watercolored watercolor texture story image, 3.2 MB, 1024x1024 PNG</span>
                  </div>
                )}
                {selectedAsset.type === "video" && (
                  <div className="flex flex-col items-center justify-center gap-2 py-2">
                    <Video className="w-12 h-12 text-rose-400 animate-pulse" />
                    <span className="text-[9px] text-slate-500">Veo Anim rendered server rack FPV dolly, 28.5 MB, 1080p MP4</span>
                  </div>
                )}
                {selectedAsset.type === "voice" && (
                  <div className="flex flex-col items-center justify-center gap-2 py-2">
                    <Volume2 className="w-12 h-12 text-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-slate-500">ElevenLabs speech synthesized BBC investigative narrator, 14.2 MB WAV</span>
                  </div>
                )}
                {selectedAsset.type !== "script" && selectedAsset.type !== "image" && selectedAsset.type !== "video" && selectedAsset.type !== "voice" && (
                  <div>
                    <span className="text-slate-550 text-[9px] block uppercase">{selectedAsset.type} Payload</span>
                    <p className="text-slate-400">Structured system metadata, platform indexing hashes, schedule time slots, and API formatting matrices for publication.</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-[10px] bg-zinc-950 p-2.5 rounded border border-zinc-850">
                <div>
                  <span className="text-slate-500 block">Revision Revision</span>
                  <span className="text-slate-200 font-bold">{selectedAsset.version}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Storage Size</span>
                  <span className="text-slate-200 font-bold">{selectedAsset.size}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  alert("Downloading offline copy of asset to system local sandbox...");
                  setSelectedAsset(null);
                }}
                className="flex-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-slate-300 font-mono text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Download</span>
              </button>
              <button 
                onClick={() => {
                  alert("Assembling and preparing direct CrossPost upload...");
                  setSelectedAsset(null);
                }}
                className="flex-1 bg-indigo-650 hover:bg-indigo-600 text-white font-mono text-xs font-bold py-2 rounded-lg flex justify-center items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>CrossPost Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
