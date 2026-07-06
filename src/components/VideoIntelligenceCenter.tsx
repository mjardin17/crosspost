import React, { useState, useEffect } from "react";
import { 
  Video, Sparkles, RefreshCw, Layers, FileText, Play, Mic, Film, Cpu, 
  MessageSquare, Image as ImageIcon, Globe, CheckCircle, AlertTriangle, 
  ArrowRight, PlayCircle, Download, Copy, Check, ChevronRight, CornerDownRight, 
  RotateCcw, Sliders, Volume2, Trash2, Edit3, Send, Database, Coins, 
  Settings, Zap, BarChart2, Share2, Users, Flame, Scissors, Plus, Eye, Award,
  BookOpen, Star, Calendar, Clock, X, ListTodo, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import VideoCreator from "./VideoCreator";

// --- TYPES ---
interface Scene {
  sceneNumber: number;
  narration: string;
  imagePrompt: string;
  videoPrompt: string;
  cameraMovement: string;
  lighting: string;
  mood: string;
  duration: string;
  soundFx: string;
  transition: string;
}

interface VideoProject {
  id: string;
  name: string;
  pipeline: "History Documentary" | "Kids Story" | "Product Review" | "YouTube Short" | "TikTok" | "Marketing Video";
  topic: string;
  status: "Draft" | "Generating" | "Completed" | "Published";
  progress: number;
  created: string;
  cost: number;
  
  // 12-stage generated outputs
  research?: string;
  outline?: string;
  script?: string;
  narrationVoice?: string;
  narrationStyle?: string;
  scenes?: Scene[];
  thumbnailConcept?: string;
  thumbnailOverlay?: string;
  thumbnailColor?: string;
  titles?: string[];
  description?: string;
  tags?: string[];
  captions?: string;
}

interface ProjectRecord {
  id: string;
  topic: string;
  format: string;
  ctr: number;
  retention: number;
  bestHook: string;
  provider: string;
  workflowSpeed: string;
}

export default function VideoIntelligenceCenter() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"projects" | "workspace" | "router" | "timeline" | "memory">("projects");

  // System Health Telemetry
  const [vramLoad, setVramLoad] = useState<number>(11.8);
  const [pipelineHealth, setPipelineHealth] = useState<number>(99.2);
  const [gpuLoad, setGpuLoad] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [logTerminal, setLogTerminal] = useState<string[]>([]);
  const [generationStepIndex, setGenerationStepIndex] = useState<number>(-1);

  // AI Router Mappings
  const [routerMappings, setRouterMappings] = useState<Record<string, string>>({
    research: "Gemini 1.5 Flash",
    outline: "Claude 3.5 Sonnet",
    script: "Claude 3.5 Sonnet",
    narration: "ElevenLabs (Narrator BBC)",
    scene_list: "Ollama (DeepSeek-R1)",
    image_prompts: "Imagen 3 (Cinematic)",
    video_prompts: "Veo Generative Node",
    thumbnail: "Flux.1 Pro Node",
    title: "Claude 3.5 Sonnet",
    description: "Gemini 1.5 Flash",
    tags: "ChatGPT 4o",
    captions: "Whisper Large v3"
  });

  // State: Projects Directory
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    return [
      {
        id: "vid-proj-1",
        name: "The Shadow Grid: High-Frequency Arbitrage",
        pipeline: "History Documentary",
        topic: "How Wall Street spent billions laying dead-straight fiber cables through mountains to shave 3 milliseconds of speed.",
        status: "Completed",
        progress: 100,
        created: "2026-07-02",
        cost: 0.82,
        research: `### Niche Intel: The Shadow Grid Latency Arbitrage
- **Target Audience:** Technology and financial history enthusiasts.
- **Competitor Performance:** High CTR average (14.2%) due to high mystery factor.
- **Core Insights:** The straightest optical path from Chicago to New Jersey costs $300M and cuts directly through mountain walls.
- **Algorithmic Hook:** "A single millisecond of delay costs traders a hundred million. This is how they conquered geography."`,
        outline: `### Act I: The Straight Line (00:00 - 02:00)
- **Visuals:** Aerial dark hills, mapped red lasers cutting a direct vector.
- **Narrative:** The mysterious corporate purchase of dead-straight land lines.

### Act II: Drilling the Alleghanies (02:00 - 06:00)
- **Visuals:** Heavy drilling machines, fiber filaments, glowing servers.
- **Narrative:** Why the fiber route must avoid bending for rivers or highways. Speed of light limits.

### Act III: The Laser Future (06:00 - 10:00)
- **Visuals:** Microwave towers, satellites, atmospheric light rays.
- **Narrative:** The transition from glass fiber back to air-to-air laser relays.`,
        script: `[HOOK]
What if a single millisecond of lag could cost you a hundred million dollars? Deep beneath the mountains of Pennsylvania lies a dark cable of glass. It doesn't follow roads, cities, or topography. It was drilled in a dead-straight path through solid granite, costing three hundred million dollars. All to shave off three milliseconds of latency.

[BODY ACT I]
To financial bots, speed is everything. They trade millions of shares in microseconds, capturing fraction-of-a-penny gaps in prices. But light has a speed limit, and inside standard glass fiber, light moves 30% slower than through empty space. A shorter path is literally worth more than gold. Spread Networks spent hundreds of millions buying private land in a laser-straight line, refusing to curve around any obstacles.

[BODY ACT II]
In 2010, the secret project went live. Traders paid spreads up to $300,000 a month to plug in. Their round-trip speed was 13.1 milliseconds. To average people, this is invisible. To trading algorithms, it was a license to print money. 

[OUTRO]
Today, glass is too slow. Microwave transponders transmit light directly through the sky. The grid is physical, and the war is silent. Subscribe to Empire OS for more decoded technology teardowns.`,
        narrationVoice: "Investigative British Narrator (BBC)",
        narrationStyle: "Authoritative / Suspenseful",
        scenes: [
          {
            sceneNumber: 1,
            narration: "What if a single millisecond of lag could cost you a hundred million dollars?",
            imagePrompt: "Extremely close up shot of glowing neon cyan fiber optic filaments in dark concrete underground cable trays, cinematic backlighting, 8k resolution, deep focus.",
            videoPrompt: "Dolly-in camera passing glowing physical fiber glass rods, intense speed lights shooting down the cables, 60fps, photorealistic.",
            cameraMovement: "Dolly zoom",
            lighting: "Cyan and charcoal deep shadows",
            mood: "Suspenseful",
            duration: "5.0s",
            soundFx: "Deep sub-bass swell, digital ping",
            transition: "Flicker flash cut"
          },
          {
            sceneNumber: 2,
            narration: "Deep beneath the mountains of Pennsylvania lies a dark cable of glass.",
            imagePrompt: "Epic aerial view of Pennsylvania forests during morning fog with a razor-thin cleared straight path heading over mountain ridges, dramatic lens flare.",
            videoPrompt: "Drone panning down from misty morning clouds to reveal a straight clear scar running through dense forests.",
            cameraMovement: "Drone rotational tilt",
            lighting: "Warm dawn golden hour lighting",
            mood: "Epic / Grand",
            duration: "6.0s",
            soundFx: "Distal wind swoosh, string synthesizer swell",
            transition: "Whip pan"
          }
        ],
        thumbnailConcept: "Pennsylvania topo map styled in obsidian black, sliced with a glowing neon red laser line, bold high-contrast text overlay.",
        thumbnailOverlay: "THE $300M SECRET LINE",
        thumbnailColor: "Neon Red & Obsidian Black",
        titles: [
          "The $300 Million Straight Cable Wall Street Kept Secret",
          "Why Traders Spent Billions to Drill Holes Through Mountains",
          "The Speed-Of-Light War Hidden Under Your Feet"
        ],
        description: "Beneath the quiet hills of Pennsylvania lies a thick tube of glass that high-frequency trading bots spent $300 million drilling, all to shave 3 milliseconds of delay. This is the story of Spread Networks.\n\nTimestamps:\n0:00 - Introduction\n2:15 - Latency War\n5:40 - Straight Line Blueprint\n\n#HFT #FinanceSecrets #DocuFactory #EmpireOS",
        tags: ["High Frequency Trading", "Wall Street", "Arbitrage Secrets", "Computer Science", "Fiber Optics", "DocuFactory"],
        captions: "[00:00] What if a single millisecond\n[00:02] of lag could cost you a hundred million dollars?\n[00:05] Beneath the hills lies a glass cable.\n[00:08] It doesn't curve."
      },
      {
        id: "vid-proj-2",
        name: "Sovereign Workstation Node Teardown",
        pipeline: "Product Review",
        topic: "Unboxing and security scan of the offline private local server workstation v4.",
        status: "Draft",
        progress: 0,
        created: "2026-07-04",
        cost: 0
      }
    ];
  });

  // Selected Project
  const [selectedProjectId, setSelectedProjectId] = useState<string>("vid-proj-1");
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Workspace active tab (the generated deliverables sub-tabs)
  const [workspaceSubTab, setWorkspaceSubTab] = useState<"research" | "outline" | "script" | "narration" | "scenes" | "thumbnail" | "titles" | "package">("research");

  // Create Project Modal States
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newProjName, setNewProjName] = useState<string>("The Forgotten Cyber-Jungle");
  const [newProjPipeline, setNewProjPipeline] = useState<"History Documentary" | "Kids Story" | "Product Review" | "YouTube Short" | "TikTok" | "Marketing Video">("Kids Story");
  const [newProjTopic, setNewProjTopic] = useState<string>("A neon panther named Leo rescues a stranded drone in a technology-overgrown rainforest.");

  // CrossPost Scheduler Modal States
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [publishChannels, setPublishChannels] = useState<string[]>(["youtube", "tiktok"]);
  const [publishScheduleDate, setPublishScheduleDate] = useState<string>("2026-07-05T18:00");
  const [publishTitle, setPublishTitle] = useState<string>("");
  const [publishDesc, setPublishDesc] = useState<string>("");

  // Copy indicator
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  // Heuristic memory lists (reused from earlier CTR logs)
  const [memoryRecords, setMemoryRecords] = useState<ProjectRecord[]>([
    { id: "rec_01", topic: "The Secret Web: Darknet Nodes", format: "YouTube Long Form", ctr: 14.8, retention: 62.4, bestHook: "Did you know a millisecond of lag costs a trillion dollars?", provider: "Claude 3.5 Sonnet", workflowSpeed: "1.4s/gate" },
    { id: "rec_02", topic: "Why Retro Keyboards are Expensive", format: "TikTok", ctr: 18.2, retention: 74.1, bestHook: "This clicky keyboard has a military secret...", provider: "Gemini 1.5 Pro", workflowSpeed: "0.8s/gate" },
    { id: "rec_03", topic: "The Space Elevator Hoax", format: "Instagram Reels", ctr: 12.1, retention: 54.8, bestHook: "NASA's forgotten blueprint will terrify you.", provider: "Ollama (Llama 3)", workflowSpeed: "2.3s/gate" }
  ]);

  // Handle Create Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjTopic.trim()) return;

    const newProject: VideoProject = {
      id: `vid-proj-${projects.length + 1}`,
      name: newProjName,
      pipeline: newProjPipeline,
      topic: newProjTopic,
      status: "Draft",
      progress: 0,
      created: new Date().toISOString().split("T")[0],
      cost: 0
    };

    setProjects(prev => [...prev, newProject]);
    setSelectedProjectId(newProject.id);
    setShowCreateModal(false);
    setActiveTab("workspace");
    setWorkspaceSubTab("research");

    // Reset modals
    setNewProjName("");
    setNewProjTopic("");
  };

  // Live progressive simulation for 12 generation stages!
  const executeStageGatePipeline = () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setGpuLoad(88);
    setLogTerminal([]);

    const log = (msg: string) => {
      setLogTerminal(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log(`Initializing Multi-Agent Pipeline for Project: "${selectedProject.name}"...`);
    log(`Format Target mapped: ${selectedProject.pipeline}`);
    log(`Configuring custom AI Router failover thresholds...`);

    const stagesKeys = [
      "research",
      "outline",
      "script",
      "narration",
      "scene_list",
      "image_prompts",
      "video_prompts",
      "thumbnail",
      "title",
      "description",
      "tags",
      "captions"
    ];

    let currentStageIndex = 0;
    setGenerationStepIndex(0);

    const interval = setInterval(() => {
      if (currentStageIndex >= stagesKeys.length) {
        clearInterval(interval);
        setIsGenerating(false);
        setGpuLoad(0);
        setGenerationStepIndex(-1);

        // Generate theme-appropriate mock content dynamically based on the project focus!
        const generatedData = assembleDynamicContent(selectedProject.topic, selectedProject.pipeline);
        
        setProjects(prev => prev.map(p => {
          if (p.id === selectedProject.id) {
            return {
              ...p,
              status: "Completed",
              progress: 100,
              cost: parseFloat((0.4 + Math.random() * 0.5).toFixed(2)),
              ...generatedData
            };
          }
          return p;
        }));

        log(`✔ MULTIPLEX SUCCESS: Full video deliverable package compiled successfully.`);
        log(`Registered all assets into Memory Store.`);
        return;
      }

      const activeStage = stagesKeys[currentStageIndex];
      const modelAssigned = routerMappings[activeStage] || "Gemini 1.5 Pro";
      
      log(`[STAGE ${currentStageIndex + 1}/12] Executing "${activeStage.toUpperCase()}" via ${modelAssigned}...`);
      
      // Update project progress live
      const nextProgress = Math.floor(((currentStageIndex + 1) / stagesKeys.length) * 100);
      setProjects(prev => prev.map(p => {
        if (p.id === selectedProject.id) {
          return { ...p, status: "Generating", progress: nextProgress };
        }
        return p;
      }));

      // Fluctuate telemetry values
      setVramLoad(parseFloat((10 + Math.random() * 4).toFixed(1)));
      setPipelineHealth(parseFloat((98.5 + Math.random() * 1.4).toFixed(1)));
      setGpuLoad(Math.floor(78 + Math.random() * 20));

      currentStageIndex++;
      setGenerationStepIndex(currentStageIndex);
    }, 1000);
  };

  // Helper to dynamically compile high-quality mock data based on prompt themes
  const assembleDynamicContent = (topic: string, pipeline: string) => {
    const cleanTopic = topic.toLowerCase();
    
    // Default Template (History/General)
    let research = `### Fact Scrape & Target Indices
- **Focus:** ${topic}
- **Demographics:** Tech-oriented, educational, general curiosity focus.
- **Competitor Performance:** Average CTR 9.2%, high engagement on initial scene change.
- **Key Metric:** Video title split tests should lead with conflict or numerical metrics.`;

    let outline = `### Storyboard Core Beat Structure
- **00:00 - 01:15 (The Hooks & Ingress):** Highlight the core anomaly of ${topic}.
- **01:15 - 03:30 (Anatomical Scrapes):** Dive into technical layers, physics, or history.
- **03:30 - 05:00 (Sovereign Wrap):** Synthesize key insights and call to action.`;

    let script = `[HOOK]
Did you know that ${topic} is not what they tell you? Most people look at the surface, but the real secret lies in the infrastructure beneath. It is a hidden system, constructed silently, costing millions of dollars. Here is how it actually functions.

[BODY ACT I]
Let's dissect the physical mechanics. When we analyze ${topic}, we find complex algorithms operating alongside real physical assets. The speed of transfer, the sheer data density, and the private networks controlling the space are completely invisible to the casual observer.

[OUTRO]
The game has changed, and those who control the physical nodes control the future. To stay ahead of the digital wave, subscribe to Empire OS. Let's build the sovereign network.`;

    let narrationVoice = "Investigative British Narrator (BBC)";
    let narrationStyle = "Suspenseful / High CPM tone";

    let scenes: Scene[] = [
      {
        sceneNumber: 1,
        narration: "Did you know that this system is not what they tell you?",
        imagePrompt: `Cinematic macro photograph of a terminal console representing ${topic}, glowing cybernetic neon lights, dramatic backlighting, 8k, photorealistic.`,
        videoPrompt: `Slow dolly zoom camera revolving around a glowing server node representing ${topic}, particles floating in light volumetric air.`,
        cameraMovement: "Slow orbital pan",
        lighting: "Glow in deep shadows",
        mood: "Mysterious",
        duration: "4.5s",
        soundFx: "Glitch synth swell",
        transition: "Dissolve"
      },
      {
        sceneNumber: 2,
        narration: "Most people look at the surface, but the real secret lies in the infrastructure beneath.",
        imagePrompt: `Drone shot of a complex physical grid, cybernetic overlays representing ${topic}, geometric lines of light glowing on concrete structures.`,
        videoPrompt: `FPV drone diving straight down over glowing technological infrastructure, high speed, motion blur.`,
        cameraMovement: "FPV dive",
        lighting: "Electric blue glow",
        mood: "Dramatic",
        duration: "6.0s",
        soundFx: "Metallic echo sweep",
        transition: "Whip pan"
      }
    ];

    let thumbnailConcept = "High-contrast map outline cut with a glowing cyan laser stream, yellow display font.";
    let thumbnailOverlay = "THE HIDDEN REVELATION";
    let thumbnailColor = "Neon Cyan & Dark Slate";

    let titles = [
      `The Secret System of ${topic} Decoded`,
      `Why They Spent Billions Laying ${topic.split(" ")[0] || "This"} Underground`,
      `How One Small Glitch in ${topic.split(" ")[0] || "This"} Changes Everything`
    ];

    let description = `Decoding the mystery of ${topic}. We review the core technology, physical grids, and financial flow systems powering this space.\n\nTimestamps:\n0:00 - The Hook\n1:20 - Underground Infrastructure\n3:40 - Sovereign Architecture\n\n#DocuFactory #TechSecrets #EmpireOS`;
    let tags = [topic.split(" ")[0] || "Technology", "Cybernetics", "Deep Investigation", "DocuFactory", "EmpireOS", "Arbitrage"];
    let captions = `[00:00] Did you know that this system\n[00:02] is not what they tell you?\n[00:05] Most people look at the surface.\n[00:08] The real secret is beneath.`;

    // 2. Kids Story Override
    if (pipeline === "Kids Story" || cleanTopic.includes("kids") || cleanTopic.includes("panther") || cleanTopic.includes("story")) {
      research = `### StoryForge Creative Parameters
- **Focus:** Children's Bedtime/Adventure Narratives
- **Target Audience:** Kids aged 4-10 and technology-enthusiast parents.
- **Competitor CTR:** High watch-time retention (74.2%) when character illustrations use colorful, glowing fantasy landscapes.
- **Key Insight:** Ensure moral focus is on problem solving, friendship, and positive technology usage.`;

      outline = `### Kids Story Beats
- **00:00 - 01:00 (The Forest Mystery):** Introduce Leo the neon panther inside the glowing cyber-jungle.
- **01:00 - 03:00 (The Broken Drone):** Leo meets a lost drone that lost its signal path.
- **03:00 - 04:30 (Sovereign Signal Bridge):** Leo climbs the network tree to bridge the beacon. Moral of teamwork.`;

      script = `[HOOK]
Deep inside the electronic rainforest, where leaves glowing neon blue, lived Leo the Neon Panther. Leo was no ordinary panther. His fur sparkled like soft LED starry night skies, and he had a giant heart. One night, Leo heard a tiny, sad beep.

[BODY ACT I]
He padded softly across the cybernetic roots and found Pip, a small lost drone. Pip's signal antenna was blinking red. "I'm lost," Pip buzzed sadly. "My home signal is on the other side of the high-frequency jungle." Leo smiled and said, "Don't worry, Pip. We'll find the path together."

[OUTRO]
By stacking three glowing network mushrooms, Leo boosted Pip's receiver signal, and Pip's lights blinked green. Together, they unlocked the secret door of the cyber-jungle. Subscribe to the Bedtime StoryForge for more magical adventures.`;

      narrationVoice = "Warm Storyteller (British Female)";
      narrationStyle = "Gentle / Dreamy / Whimsical";

      scenes = [
        {
          sceneNumber: 1,
          narration: "Deep inside the electronic rainforest, lived Leo the Neon Panther.",
          imagePrompt: "Beautiful children's book illustration, watercolor cybernetic jungle with glowing blue and pink leaves, a friendly neon black panther with star-like glowing fur, soft volumetric atmosphere.",
          videoPrompt: "Slow parallax panning shot through colorful fairytale digital trees, revealing a friendly glowing panther cub looking up at the night sky, 3d watercolor.",
          cameraMovement: "Parallax slide",
          lighting: "Magical soft neon bioluminescence",
          mood: "Whimsical / Cozy",
          duration: "5.0s",
          soundFx: "Tinkling chime, gentle forest crickets",
          transition: "Soft dissolve"
        },
        {
          sceneNumber: 2,
          narration: "He padded softly across the roots and found Pip, a small lost drone.",
          imagePrompt: "watercolor bedtime storybook art, a glowing friendly little quadcopter drone blinking red light on a cyber tree root, cute glowing panther cub tilting head to look at it.",
          videoPrompt: "Zoom in towards a friendly cute mini quadcopter drone stuck in magical glowing roots, panther cub steps forward gently.",
          cameraMovement: "Slow push-in",
          lighting: "Warm forest lantern ambient glow",
          mood: "Heartwarming",
          duration: "5.5s",
          soundFx: "Cute electronic beep, soft rustling grass",
          transition: "Fade"
        }
      ];

      thumbnailConcept = "Close up watercolor of a cute glowing panther cub holding a friendly little drone, sparkling star bokeh.";
      thumbnailOverlay = "LEO & THE MAGICAL SIGNAL";
      thumbnailColor = "Lavender & Neon Pastel";

      titles = [
        "Leo and the Lost Drone of Cyber-Jungle | Bedtime Bedtime Stories",
        "The Neon Panther's Glowing Forest Adventure",
        "Pip's Safe Flight: A Whimsical Cyber Bedtime Story"
      ];

      description = "Enjoy this magical illustrated bedtime adventure of Leo the Neon Panther as he helps a friendly lost drone find its way back home through the cyber-jungle.\n\n#StoryForge #BedtimeStories #KidsBooks #KidsAnimation";
      tags = ["Bedtime Stories", "Kids Books", "Glowing Animals", "StoryForge", "Fairytale", "Kids Animation"];
      captions = `[00:00] Deep inside the electronic rainforest,\n[00:02] lived Leo the Neon Panther.\n[00:05] He heard a tiny, sad beep\n[00:07] blinking under the roots.`;
    }

    // 3. Product Review Override
    if (pipeline === "Product Review" || cleanTopic.includes("review") || cleanTopic.includes("workstation") || cleanTopic.includes("hardware")) {
      research = `### Boss Listers Affiliate Review Parameters
- **Focus:** Sovereign Node Private Workstation Tech Review.
- **Target Audience:** Privacy advocates, self-hosters, and tech hardware reviewers.
- **CTR Sweetspot:** High-contrast layout with direct pricing delta on physical eBay vs Amazon gaps.
- **Key Focus:** Emphasize zero-telemetry, robust offline security, and high computing capabilities.`;

      outline = `### Technical Teardown Outline
- **00:00 - 01:15 (The Hardware unbox):** Display the machined steel frame, dual SFP+ fiber nodes, and internal cooling arrays.
- **01:15 - 03:15 (Live Private OS Boot):** Launch local Ollama DeepSeek-R1 and showcase zero-telemetry offline logs.
- **03:15 - 04:30 (Price Arbitrage Opportunity):** Scan Amazon vs refurbished eBay parts for maximum sweat-equity margins.`;

      script = `[HOOK]
This is not a regular computer. It has no Windows, no telemetry, and it doesn't need the internet to execute high-tier AI models. This is the Sovereign Node Offline Workstation v4—designed for developers who want absolute privacy.

[BODY ACT I]
Constructed with an industrial steel chassis, this station houses dual physical fiber optic SFP ports and is pre-configured with a private local network gateway. When we boot it up, it loads a local LLM node instantly. We are running DeepSeek-R1 completely offline at fifty tokens per second.

[OUTRO]
You can configure and list these custom systems for a six-hundred dollar margin using the Boss Listers kit. Subscribe to Empire OS to deploy your offline workspace.`;

      narrationVoice = "Tech Enthusiast (Gravely Male)";
      narrationStyle = "Crisp / Direct / Hardware-expert";

      scenes = [
        {
          sceneNumber: 1,
          narration: "This is not a regular computer. It has no telemetry, and no forced updates.",
          imagePrompt: "Studio photorealism of a matte black sleek metallic computer console, high-end aluminum heat-sinks, red glowing server lights inside, premium desktop workspace.",
          videoPrompt: "Slow glide over the metallic finish of a custom workstation tower, focus shifting from ports to internal cooling fan spinning smoothly.",
          cameraMovement: "Focus rack slide",
          lighting: "Moody low-key studio lighting, spotlight on chassis",
          mood: "Sleek / Premium",
          duration: "4.8s",
          soundFx: "Mechanical power switch click, server fan acceleration",
          transition: "Cut"
        },
        {
          sceneNumber: 2,
          narration: "We are running advanced local models completely offline, locked down from external clouds.",
          imagePrompt: "Close-up of dual glowing green fiber network switches on the back panel, ethernet cables cleanly routed, green led transponders pulsing.",
          videoPrompt: "Macro camera moving past physical ports, green data link activity blinkers active, 60fps.",
          cameraMovement: "Dolly pan",
          lighting: "Technical green and dark steel highlights",
          mood: "High-Tech",
          duration: "5.2s",
          soundFx: "Clicky ethernet connection sound, low frequency hum",
          transition: "Whip cut"
        }
      ];

      thumbnailConcept = "Workstation open chassis showing custom board with text '100% OFFLINE AI' in bright yellow, warning badge.";
      thumbnailOverlay = "THE PRIVATE OLLAMA NODE";
      thumbnailColor = "Industial Orange & Black";

      titles = [
        "I Built an AI Station That Works 100% Offline (No Telemetry)",
        "The Sovereign Workstation: True Privacy for Developers",
        "Why Tech Giants Hate Self-Contained Local Servers"
      ];

      description = "Unboxing and testing the custom Sovereign Node Workstation v4, built for 100% offline private LLM computing with local Ollama stacks.\n\n#OfflineAI #SovereignNode #Ollama #TechTeardown #BossListers";
      tags = ["Self Hosted", "Offline Server", "Sovereign Node", "Ollama Tech", "Mechanical Engineering", "BossListers"];
      captions = `[00:00] This is not a regular computer.\n[00:02] It has no telemetry and no cloud links.\n[00:05] It runs high-tier AI models completely offline\n[00:08] at fifty tokens per second.`;
    }

    return {
      research,
      outline,
      script,
      narrationVoice,
      narrationStyle,
      scenes,
      thumbnailConcept,
      thumbnailOverlay,
      thumbnailColor,
      titles,
      description,
      tags,
      captions
    };
  };

  // Bridge connection with CrossPost storage
  const handlePublishToCrossPost = () => {
    if (!selectedProject.titles || selectedProject.titles.length === 0) {
      alert("Please run the generation pipeline for this project first to assemble final deliverables!");
      return;
    }
    setPublishTitle(selectedProject.titles[0]);
    setPublishDesc(selectedProject.description || "");
    setShowPublishModal(true);
  };

  const executeCrossPostDispatch = () => {
    // Construct the MultiAgentResponse structure as saved in App.tsx
    const multiAgentBundle = {
      success: true,
      rawScript: selectedProject.script || "",
      timestamp: new Date().toISOString(),
      analyst: {
        theme: selectedProject.pipeline,
        entities: selectedProject.tags || [],
        audience: "High-engagement social algorithms",
        tone: selectedProject.narrationStyle || "Professional"
      },
      generations: publishChannels.map(channel => ({
        platformId: channel,
        status: "passed",
        originalDraft: selectedProject.script || "",
        finalContent: `${publishTitle}\n\n${publishDesc}`,
        charCount: (publishTitle.length + publishDesc.length),
        critic: {
          passed: true,
          score: 98,
          issues: [],
          revisions: "All constraints verified by Empire Video Factory."
        },
        scoring: {
          overallScore: 95,
          lengthScore: 100,
          sentimentScore: 92,
          hookStrengthScore: 98,
          relevanceScore: 96,
          readabilityGrade: "Grade 7",
          suggestedAction: "Ready for publication schedule via physical CrossPost scheduler."
        },
        specialistBotName: `${selectedProject.pipeline} Director`,
        specialistBotMetadata: `Schedule Time: ${publishScheduleDate}`
      })),
      isSimulated: true
    };

    // Store into localStorage under both crosspost_results and crosspost_edited_drafts
    localStorage.setItem("crosspost_results", JSON.stringify(multiAgentBundle));
    
    const currentDrafts = JSON.parse(localStorage.getItem("crosspost_edited_drafts") || "{}");
    publishChannels.forEach(channel => {
      currentDrafts[channel] = `${publishTitle}\n\n${publishDesc}`;
    });
    localStorage.setItem("crosspost_edited_drafts", JSON.stringify(currentDrafts));

    // Update Project Status
    setProjects(prev => prev.map(p => {
      if (p.id === selectedProject.id) {
        return { ...p, status: "Published" };
      }
      return p;
    }));

    setShowPublishModal(false);
    alert(`DISPATCH SUCCESSFUL!\n\nDeliverable package scheduled and dispatched to CrossPost Depot for channels: ${publishChannels.join(", ").toUpperCase()}.\n\nWhen you navigate to Mission Control or CrossPost Sandbox, these titles, outlines, and scripts will load natively!`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 md:p-6 space-y-6 font-sans text-slate-200 text-left relative overflow-hidden">
      
      {/* Visual background ambient flare */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-900/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-900/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Panel */}
      <div className="border-b border-zinc-850 pb-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-rose-950/40 border border-rose-900/40 rounded-xl flex items-center justify-center shadow-inner relative">
              <Video className="w-6 h-6 text-rose-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-mono font-black text-slate-100 uppercase tracking-tight">
                  VIDEO FACTORY COMMAND CENTER
                </h3>
                <span className="text-[9px] font-mono font-black text-rose-400 bg-rose-950/40 border border-rose-900/30 px-2 py-0.5 rounded tracking-widest uppercase">
                  ACTIVE PRODUCTIONS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-normal max-w-2xl font-sans">
                A native Empire OS workspace to coordinate video channels. Spawn projects, choose niche pipelines, generate 12-stage automated content assets, and schedule dispatches seamlessly into CrossPost.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-850 p-2.5 rounded-lg text-[10px] font-mono shrink-0">
            <div>
              <span className="text-slate-550 block">PIPELINE INTEGRITY:</span>
              <span className="text-emerald-400 font-bold">{pipelineHealth}% Stable</span>
            </div>
            <div className="border-l border-zinc-800 pl-3">
              <span className="text-slate-550 block">HARDWARE ALLOCATION:</span>
              <span className="text-indigo-400 font-bold">{vramLoad} GB VRAM</span>
            </div>
          </div>
        </div>

        {/* Workspace Level 1 Sub-Tabs */}
        <div className="flex flex-wrap border-b border-zinc-900 mt-6 gap-1">
          {[
            { id: "projects", label: "Video Projects Directory", icon: Database },
            { id: "advanced_creator", label: "Auto-Pilot Production Studio", icon: Video },
            { id: "workspace", label: "Factory Workspace", icon: Zap },
            { id: "router", label: "AI Routing Grid", icon: Cpu },
            { id: "timeline", label: "Interactive Scene Timeline", icon: Film },
            { id: "memory", label: "Ecosystem Memory & CTR", icon: Award }
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
                    : "bg-transparent border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Panes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          
          {/* --- TAB 1: PROJECTS DIRECTORY --- */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl">
                <div>
                  <h4 className="text-xs font-mono font-black uppercase text-slate-200">Autonomous Video Channels</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Start a new video project or edit parameters for active channels.</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px] font-black uppercase px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start New Video Project</span>
                </button>
              </div>

              {/* Active Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => {
                  const isSelected = selectedProjectId === proj.id;
                  return (
                    <div 
                      key={proj.id}
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        setActiveTab("workspace");
                      }}
                      className={`p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
                        isSelected 
                          ? "bg-zinc-900 border-rose-800 ring-1 ring-rose-500/20" 
                          : "bg-zinc-900/50 border-zinc-850 hover:border-zinc-700"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-mono text-slate-500 uppercase font-black tracking-widest">PROJECT #{proj.id.split("-").pop()}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase ${
                            proj.status === "Completed" ? "bg-emerald-950 text-emerald-400" :
                            proj.status === "Generating" ? "bg-rose-950 text-rose-400 animate-pulse" :
                            proj.status === "Published" ? "bg-indigo-950 text-indigo-400" :
                            "bg-zinc-950 text-slate-400"
                          }`}>
                            {proj.status}
                          </span>
                        </div>

                        <div>
                          <strong className="text-sm font-mono text-slate-100 font-bold block truncate">{proj.name}</strong>
                          <span className="text-[9px] font-mono font-black text-rose-400 bg-rose-950/20 px-1.5 py-0.5 rounded inline-block mt-1">
                            {proj.pipeline}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                          {proj.topic}
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5 pt-3 border-t border-zinc-900">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Asset Compilation Progress:</span>
                          <strong className="text-slate-200">{proj.progress}%</strong>
                        </div>
                        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                          <div 
                            className="bg-gradient-to-r from-rose-600 to-indigo-600 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono pt-1 text-slate-500">
                        <span>Created: {proj.created}</span>
                        {proj.cost > 0 && <span className="text-rose-400 font-bold">Cost: ${proj.cost.toFixed(2)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- TAB: ADVANCED AUTOPILOT CREATOR --- */}
          {activeTab === "advanced_creator" && (
            <VideoCreator 
              onHandToCrossPost={(script, metadata) => {
                setProjects(prev => prev.map(p => p.id === selectedProjectId ? {
                  ...p,
                  script,
                  titles: [metadata.title],
                  description: metadata.desc,
                  tags: metadata.tags,
                  progress: 100,
                  status: "Completed"
                } : p));
                setPublishTitle(metadata.title);
                setPublishDesc(metadata.desc);
                setShowPublishModal(true);
              }} 
            />
          )}

          {/* --- TAB 2: FACTORY WORKSPACE --- */}
          {activeTab === "workspace" && (
            <div className="space-y-6">
              
              {/* Selected Project Header Block */}
              <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-850 p-5 rounded-xl text-left space-y-3 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-24 bg-rose-500/5 blur-xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[8px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded font-mono font-black uppercase">
                      Active Target Channel: {selectedProject.pipeline}
                    </span>
                    <h3 className="text-base font-mono font-black text-slate-100 mt-1 uppercase tracking-tight">
                      {selectedProject.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 font-sans italic max-w-2xl leading-relaxed">
                      " {selectedProject.topic} "
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={executeStageGatePipeline}
                      disabled={isGenerating}
                      className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 text-white font-mono text-[10px] font-black uppercase px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>{isGenerating ? "Executing Gates..." : "ONE-CLICK RUN PIPELINE"}</span>
                    </button>

                    {selectedProject.status === "Completed" && (
                      <button
                        onClick={handlePublishToCrossPost}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-black uppercase px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Schedule via CrossPost</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar and simulated telemetry */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3 border-t border-zinc-900">
                  <div className="lg:col-span-4 space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 uppercase block font-bold">Pipeline Stage Index</span>
                      <strong className="text-rose-400">
                        {generationStepIndex >= 0 ? `Stage ${generationStepIndex + 1} of 12` : selectedProject.progress === 100 ? "Completed All Stages" : "Idle Ready"}
                      </strong>
                    </div>
                    <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-900">
                      <div 
                        className="bg-gradient-to-r from-rose-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${selectedProject.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-8 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] text-slate-500">
                    <div>
                      <span>GPU CLUSTER INGRESS: </span>
                      <strong className="text-rose-400">{gpuLoad}% LOAD</strong>
                    </div>
                    <div>
                      <span>STABILITY COEFFICIENT: </span>
                      <strong className="text-emerald-400">{pipelineHealth}%</strong>
                    </div>
                    <div>
                      <span>PIPELINE COST ACCUMULATED: </span>
                      <strong className="text-indigo-400">${selectedProject.cost.toFixed(2)} USD</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Generation Logs Terminal (Shown during active run) */}
              {logTerminal.length > 0 && (
                <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 font-mono text-[10px] text-rose-400/90 space-y-1 leading-normal max-h-40 overflow-y-auto">
                  <div className="flex items-center gap-1.5 font-black text-[9px] text-slate-500 uppercase pb-1.5 border-b border-zinc-900">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Live AI Router Generation Logs</span>
                  </div>
                  {logTerminal.map((logLine, idx) => (
                    <div key={idx}>{logLine}</div>
                  ))}
                </div>
              )}

              {/* Main Workspace Deliverable Sub-Tabs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                
                {/* Stage-Gate Navigator List (Col 4) */}
                <div className="lg:col-span-4 bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl space-y-3.5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block border-b border-zinc-800 pb-2">
                    12 Stage-Gate Output Manifest
                  </span>

                  <div className="space-y-1">
                    {[
                      { id: "research", label: "01. Niche Research", active: workspaceSubTab === "research", comp: !!selectedProject.research },
                      { id: "outline", label: "02. Storyboard Outline", active: workspaceSubTab === "outline", comp: !!selectedProject.outline },
                      { id: "script", label: "03. Narrative Script", active: workspaceSubTab === "script", comp: !!selectedProject.script },
                      { id: "narration", label: "04. Voiceover / Narration", active: workspaceSubTab === "narration", comp: !!selectedProject.narrationVoice },
                      { id: "scenes", label: "05. Scene Breakdown", active: workspaceSubTab === "scenes", comp: !!selectedProject.scenes },
                      { id: "thumbnail", label: "06. Thumbnail Studio", active: workspaceSubTab === "thumbnail", comp: !!selectedProject.thumbnailConcept },
                      { id: "titles", label: "07. Title Engine", active: workspaceSubTab === "titles", comp: !!selectedProject.titles },
                      { id: "package", label: "08. Complete Package", active: workspaceSubTab === "package", comp: !!selectedProject.description }
                    ].map((gate) => (
                      <button
                        key={gate.id}
                        onClick={() => setWorkspaceSubTab(gate.id as any)}
                        className={`w-full flex items-center justify-between p-2 rounded text-[10px] font-mono transition-all text-left cursor-pointer ${
                          gate.active 
                            ? "bg-rose-950/40 text-rose-400 border-l-2 border-rose-600 font-bold" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-zinc-900/50"
                        }`}
                      >
                        <span>{gate.label}</span>
                        <span className={`text-[8px] font-black uppercase ${gate.comp ? "text-emerald-400" : "text-zinc-600"}`}>
                          {gate.comp ? "● READY" : "○ IDLE"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Tab Deliverables Center Panel (Col 8) */}
                <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-850 p-5 rounded-xl flex flex-col justify-between min-h-[350px]">
                  
                  {/* --- DELIVERABLE: RESEARCH --- */}
                  {workspaceSubTab === "research" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                        <strong className="text-xs font-mono font-black uppercase text-slate-100">01. Deep Niche Research</strong>
                        {selectedProject.research && (
                          <button 
                            onClick={() => copyToClipboard(selectedProject.research || "", "res")}
                            className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedLabel === "res" ? "Copied" : "Copy Research"}</span>
                          </button>
                        )}
                      </div>

                      {selectedProject.research ? (
                        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-lg font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">
                          {selectedProject.research}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500 text-xs font-mono">
                          <Plus className="w-8 h-8 text-zinc-700 mx-auto mb-2 animate-bounce" />
                          <span>No research generated. Run the stage-gate pipeline to compile.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- DELIVERABLE: OUTLINE --- */}
                  {workspaceSubTab === "outline" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                        <strong className="text-xs font-mono font-black uppercase text-slate-100">02. Storyboard Outline</strong>
                        {selectedProject.outline && (
                          <button 
                            onClick={() => copyToClipboard(selectedProject.outline || "", "out")}
                            className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedLabel === "out" ? "Copied" : "Copy Outline"}</span>
                          </button>
                        )}
                      </div>

                      {selectedProject.outline ? (
                        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-lg font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">
                          {selectedProject.outline}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500 text-xs font-mono">
                          <Plus className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                          <span>No outline storyboard generated.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- DELIVERABLE: SCRIPT --- */}
                  {workspaceSubTab === "script" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                        <strong className="text-xs font-mono font-black uppercase text-slate-100">03. Narrative Script Screenplay</strong>
                        {selectedProject.script && (
                          <button 
                            onClick={() => copyToClipboard(selectedProject.script || "", "scr")}
                            className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedLabel === "scr" ? "Copied" : "Copy Script"}</span>
                          </button>
                        )}
                      </div>

                      {selectedProject.script ? (
                        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-lg font-serif italic text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                          {selectedProject.script}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500 text-xs font-mono">
                          <Plus className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                          <span>No script screenplay generated.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- DELIVERABLE: NARRATION --- */}
                  {workspaceSubTab === "narration" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                        <strong className="text-xs font-mono font-black uppercase text-slate-100">04. Narration & Voice Settings</strong>
                      </div>

                      {selectedProject.narrationVoice ? (
                        <div className="space-y-4">
                          <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-lg font-mono text-[11px] text-slate-350 space-y-3">
                            <div className="flex justify-between">
                              <span>Selected ElevenLabs Model:</span>
                              <strong className="text-rose-400">{selectedProject.narrationVoice}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Cadence/Vibe Tone:</span>
                              <strong className="text-slate-100">{selectedProject.narrationStyle}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Dynamic Pitch:</span>
                              <span className="text-slate-400">Deep / Balanced (0.85)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pacing Constraint:</span>
                              <span className="text-slate-400">Standard / High CPM breathing blocks</span>
                            </div>
                          </div>

                          {/* Interactive player */}
                          <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => alert("Simulating synthesized ElevenLabs high-frequency voice playback...")}
                                className="w-10 h-10 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center cursor-pointer transition shrink-0 text-white"
                              >
                                <Play className="w-5 h-5 ml-0.5" />
                              </button>
                              <div>
                                <strong className="text-xs font-mono text-slate-200 block">Listen to Voiceover Narration</strong>
                                <span className="text-[10px] font-mono text-slate-500">Synthesized offline via local cached layers</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono bg-zinc-900 px-2 py-0.5 border border-zinc-850 text-slate-400 rounded">
                              0:42 SECONDS
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500 text-xs font-mono">
                          <Plus className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                          <span>No narration cues synthesized.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- DELIVERABLE: SCENES --- */}
                  {workspaceSubTab === "scenes" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                        <strong className="text-xs font-mono font-black uppercase text-slate-100">05. Scene List Breakdown</strong>
                        <button 
                          onClick={() => setActiveTab("timeline")}
                          className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer underline"
                        >
                          <span>Go to Timeline Editor →</span>
                        </button>
                      </div>

                      {selectedProject.scenes ? (
                        <div className="space-y-3">
                          {selectedProject.scenes.map((scene) => (
                            <div key={scene.sceneNumber} className="bg-zinc-950 border border-zinc-850 p-3 rounded-lg text-xs space-y-2">
                              <div className="flex justify-between items-center font-mono text-[10px]">
                                <span className="bg-rose-950 text-rose-400 font-bold px-1.5 py-0.2 rounded">SCENE {scene.sceneNumber}</span>
                                <span className="text-slate-550">Duration: {scene.duration}</span>
                              </div>
                              <p className="font-serif italic text-slate-300 text-[11px]">"{scene.narration}"</p>
                              <div className="text-[10px] font-mono text-slate-500 pt-1.5 border-t border-zinc-900 flex justify-between">
                                <span className="truncate max-w-[200px]">Prompt: {scene.imagePrompt}</span>
                                <span className="text-rose-400 shrink-0 font-bold">{scene.cameraMovement}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500 text-xs font-mono">
                          <Plus className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                          <span>No scenes generated.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- DELIVERABLE: THUMBNAIL --- */}
                  {workspaceSubTab === "thumbnail" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                        <strong className="text-xs font-mono font-black uppercase text-slate-100">06. Thumbnail Studio Mockup</strong>
                      </div>

                      {selectedProject.thumbnailConcept ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-lg font-mono text-[11px] text-slate-350 space-y-2.5">
                            <div>
                              <span className="text-slate-550 block text-[9px] uppercase font-bold">Thumbnail Concept:</span>
                              <p className="text-slate-200 mt-0.5 leading-normal">{selectedProject.thumbnailConcept}</p>
                            </div>
                            <div>
                              <span className="text-slate-550 block text-[9px] uppercase font-bold">Focal Point:</span>
                              <p className="text-slate-200 mt-0.5">{selectedProject.thumbnailOverlay}</p>
                            </div>
                            <div>
                              <span className="text-slate-550 block text-[9px] uppercase font-bold">High-CTR Overlay Text:</span>
                              <strong className="text-rose-400 text-sm block mt-0.5 font-black uppercase">{selectedProject.thumbnailOverlay}</strong>
                            </div>
                          </div>

                          {/* Graphical design mockup */}
                          <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between items-center relative overflow-hidden min-h-[160px]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/20 via-zinc-950 to-indigo-950/20 pointer-events-none" />
                            <div className="text-[8px] font-mono text-rose-500 bg-rose-950/40 px-1 rounded border border-rose-900/30 z-10 self-start">
                              FLUX GENERATOR v1.4
                            </div>
                            
                            <div className="text-center space-y-2 z-10 my-4">
                              <span className="text-xs font-sans text-slate-500 block italic">Simulated Visual Canvas</span>
                              <strong className="text-base font-black tracking-tighter text-slate-100 font-mono block bg-zinc-900/80 px-3 py-1.5 border border-zinc-800 rounded shadow-lg uppercase">
                                {selectedProject.thumbnailOverlay}
                              </strong>
                            </div>

                            <button 
                              onClick={() => alert("Launching Flux.1 high-resolution render core to download high-CTR JPEG package...")}
                              className="text-[9px] font-mono bg-zinc-900 hover:bg-zinc-850 text-slate-300 border border-zinc-800 px-2 py-1 rounded cursor-pointer transition z-10"
                            >
                              Download Render
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500 text-xs font-mono">
                          <Plus className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                          <span>No thumbnail concept designed.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- DELIVERABLE: TITLES --- */}
                  {workspaceSubTab === "titles" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                        <strong className="text-xs font-mono font-black uppercase text-slate-100">07. Title Engine Split-Testing</strong>
                      </div>

                      {selectedProject.titles ? (
                        <div className="space-y-3 font-mono text-xs">
                          {selectedProject.titles.map((title, idx) => {
                            const score = idx === 0 ? "9.8/10 CTR" : idx === 1 ? "8.9/10 CTR" : "7.4/10 CTR";
                            return (
                              <div key={idx} className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-lg flex justify-between items-center gap-3">
                                <div className="space-y-1">
                                  <span className="text-[8px] text-slate-550 block font-bold">VARIANT 0{idx + 1}</span>
                                  <strong className="text-slate-100 font-bold block">{title}</strong>
                                </div>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                  idx === 0 ? "bg-emerald-950 text-emerald-400" : "bg-zinc-900 text-slate-450"
                                }`}>
                                  {score}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500 text-xs font-mono">
                          <Plus className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                          <span>No titles generated.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- DELIVERABLE: COMPLETED PACKAGE --- */}
                  {workspaceSubTab === "package" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                        <strong className="text-xs font-mono font-black uppercase text-slate-100">08. Complete Deliverables Bundle</strong>
                      </div>

                      {selectedProject.description ? (
                        <div className="space-y-4 font-mono text-[11px] text-slate-350">
                          
                          <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-lg space-y-3">
                            <div>
                              <span className="text-slate-550 block text-[8px] uppercase font-bold">SEO Platform Description Block</span>
                              <div className="bg-zinc-900 p-2.5 rounded border border-zinc-850 leading-relaxed text-slate-300 mt-1 whitespace-pre-line font-mono">
                                {selectedProject.description}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-slate-550 block text-[8px] uppercase font-bold">Metadata Tags</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {selectedProject.tags?.map((tag) => (
                                    <span key={tag} className="bg-zinc-900 text-rose-400 text-[9px] px-1.5 py-0.5 border border-zinc-800 rounded font-bold">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="text-slate-550 block text-[8px] uppercase font-bold">Timed Captions Transcript</span>
                                <div className="bg-zinc-900 p-2 border border-zinc-850 rounded text-slate-400 max-h-20 overflow-y-auto mt-1 whitespace-pre-line text-[9px]">
                                  {selectedProject.captions}
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-500 text-xs font-mono">
                          <Plus className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                          <span>No final description or packaging generated.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Operational Footer Details inside Workspace Panel */}
                  <div className="border-t border-zinc-900 pt-3 mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
                    <span>Active Model Combo: <strong className="text-rose-400">{routerMappings.outline} + ElevenLabs + Flux</strong></span>
                    <span>Status: <strong className="text-emerald-400 uppercase">{selectedProject.status}</strong></span>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* --- TAB 3: AI ROUTING GRID --- */}
          {activeTab === "router" && (
            <div className="space-y-6 text-left">
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                  <Cpu className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-mono font-bold uppercase text-slate-100">AI COGNITIVE ROUTER CONTROLLER</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Empire OS intelligently routes work to optimal specialized providers to maximize production quality while maintaining speed and budget control. Customize which model handles each pipeline stage in real time.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
                  {[
                    { id: "research", label: "01. Niche Research Node", desc: "Crawling competitive lists and mapping SEO metrics.", current: routerMappings.research, options: ["Gemini 1.5 Flash", "Gemini 1.5 Pro", "Claude 3.5 Haiku", "Ollama (DeepSeek-R1)"] },
                    { id: "outline", label: "02. Outline Director", desc: "Storyboard timelines and emotional audience pacing.", current: routerMappings.outline, options: ["Claude 3.5 Sonnet", "Gemini 1.5 Pro", "ChatGPT 4o"] },
                    { id: "script", label: "03. Script Screenplay", desc: "Writing full voiceover and visual screenplay directions.", current: routerMappings.script, options: ["Claude 3.5 Sonnet", "ChatGPT 4o", "DeepSeek-R1 (Local)", "Gemini 1.5 Pro"] },
                    { id: "narration", label: "04. Narration Voiceover", desc: "ElevenLabs premium synthesizers with custom dialects.", current: routerMappings.narration, options: ["ElevenLabs (Narrator BBC)", "OpenAI TTS", "Bark Local Synthesis"] },
                    { id: "scene_list", label: "05. Scene Breakdown", desc: "Splitting chapters into specific visual cues.", current: routerMappings.scene_list, options: ["Ollama (DeepSeek-R1)", "Ollama (Llama 3)", "Claude 3.5 Sonnet"] },
                    { id: "image_prompts", label: "06. Image Synthesis prompts", desc: "Midjourney or Flux styling instructions.", current: routerMappings.image_prompts, options: ["Imagen 3 (Cinematic)", "Flux.1 Pro Node", "Stable Diffusion XL"] },
                    { id: "video_prompts", label: "07. Video Camera prompts", desc: "Temporal panning and zoom instructions for motion AI.", current: routerMappings.video_prompts, options: ["Veo Generative Node", "Runway Gen-3 Pro", "Luma Dream Machine"] },
                    { id: "thumbnail", label: "08. Thumbnail Designer", desc: "High-contrast split visual generation.", current: routerMappings.thumbnail, options: ["Flux.1 Pro Node", "Imagen 3 (Cinematic)", "ChatGPT 4o"] },
                    { id: "title", label: "09. Title Split-Tester", desc: "CTR optimization loops to match algorithms.", current: routerMappings.title, options: ["Claude 3.5 Sonnet", "Gemini 1.5 Flash", "ChatGPT 4o"] }
                  ].map((mapping) => (
                    <div key={mapping.id} className="bg-zinc-950 p-4 border border-zinc-850 rounded-xl space-y-3 flex flex-col justify-between text-left">
                      <div className="space-y-1">
                        <strong className="text-[11px] font-mono font-bold text-slate-200 block">{mapping.label}</strong>
                        <p className="text-[10px] text-slate-500 leading-normal font-sans">{mapping.desc}</p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                        <label className="text-[8px] font-mono text-slate-500 uppercase font-black block">Active Provider</label>
                        <select
                          value={mapping.current}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRouterMappings(prev => ({ ...prev, [mapping.id]: val }));
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 text-xs font-mono text-rose-400 font-bold focus:outline-none cursor-pointer"
                        >
                          {mapping.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 4: INTERACTIVE SCENE TIMELINE --- */}
          {activeTab === "timeline" && (
            <div className="space-y-6 text-left">
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-mono font-bold uppercase text-slate-100">INTERACTIVE SCENE TIMELINE</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-550 uppercase bg-zinc-950 px-2 py-0.5 border border-zinc-850 rounded">
                    Format: {selectedProject.pipeline}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Every scripted pipeline output automatically splits into logical acts and scene directives. Fine-tune camera parameters, lighting mood, sound effects, and transitions to maintain character consistency.
                </p>

                {selectedProject.scenes ? (
                  <div className="space-y-4 pt-2">
                    {selectedProject.scenes.map((scene) => (
                      <div key={scene.sceneNumber} className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 relative overflow-hidden">
                        
                        {/* Scene details */}
                        <div className="lg:col-span-4 space-y-3 border-r border-zinc-900 pr-0 lg:pr-5">
                          <div className="flex justify-between items-center">
                            <span className="bg-rose-950 text-rose-400 border border-rose-900/40 text-[10px] font-mono font-black px-2.5 py-0.5 rounded">
                              SCENE {scene.sceneNumber}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">Duration: {scene.duration}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-slate-550 block">Spoken Narration Dialogue</span>
                            <p className="text-[11px] font-serif italic text-slate-300 leading-relaxed font-medium">
                              "{scene.narration}"
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[9px] font-mono pt-2 border-t border-zinc-900/60">
                            <div>
                              <span className="text-slate-550 block">LIGHTING STYLE</span>
                              <span className="text-cyan-400 font-bold">{scene.lighting}</span>
                            </div>
                            <div>
                              <span className="text-slate-550 block">CAMERA SPEED</span>
                              <span className="text-indigo-400 font-bold">{scene.cameraMovement}</span>
                            </div>
                          </div>
                        </div>

                        {/* Prompts info */}
                        <div className="lg:col-span-8 flex flex-col justify-between gap-3 text-xs font-mono">
                          <div className="space-y-2">
                            <div className="flex justify-between text-[9px] text-slate-550">
                              <span>CINEMATIC IMAGE PROMPT (IMAGEN / FLUX)</span>
                              <button 
                                onClick={() => copyToClipboard(scene.imagePrompt, `img_${scene.sceneNumber}`)}
                                className="text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-1"
                              >
                                {copiedLabel === `img_${scene.sceneNumber}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedLabel === `img_${scene.sceneNumber}` ? "Copied" : "Copy"}</span>
                              </button>
                            </div>
                            <div className="bg-zinc-900 p-2.5 rounded border border-zinc-850 text-[10px] leading-relaxed text-slate-200">
                              {scene.imagePrompt}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-[9px] text-slate-550">
                              <span>CINEMATIC VIDEO GENERATION PROMPT (VEO / SORA)</span>
                              <button 
                                onClick={() => copyToClipboard(scene.videoPrompt, `vid_${scene.sceneNumber}`)}
                                className="text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-1"
                              >
                                {copiedLabel === `vid_${scene.sceneNumber}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedLabel === `vid_${scene.sceneNumber}` ? "Copied" : "Copy"}</span>
                              </button>
                            </div>
                            <div className="bg-zinc-900 p-2.5 rounded border border-zinc-850 text-[10px] leading-relaxed text-cyan-400">
                              {scene.videoPrompt}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[9px] text-slate-500 border-t border-zinc-900/60 pt-2.5">
                            <div>
                              <span>SOUND FX:</span>
                              <span className="text-slate-300 block font-sans">{scene.soundFx}</span>
                            </div>
                            <div>
                              <span>TRANSITION:</span>
                              <span className="text-slate-300 block">{scene.transition}</span>
                            </div>
                            <div>
                              <span>VISUAL MOOD:</span>
                              <span className="text-slate-300 block">{scene.mood}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500 text-xs font-mono bg-zinc-950 rounded-xl border border-zinc-850">
                    <Plus className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <span>Please run the video pipeline of your active project to assemble scene storyboards.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- TAB 5: ECOSYSTEM MEMORY & CTR --- */}
          {activeTab === "memory" && (
            <div className="space-y-6 text-left">
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-mono font-bold uppercase text-slate-100">UNIFIED MEMORY LEARNING SYSTEM</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    RECOMMENDATIONS: ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The Empire OS Unified Memory system tracks public analytics of your published videos to understand winning patterns. Over time, it remembers highest CTR hooks, optimal durations, and fastest workflows to automatically self-tune future generations.
                </p>

                {/* AI Improvement recommendations */}
                <div className="bg-zinc-950 border border-indigo-950 p-4 rounded-lg space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-indigo-400 font-bold">
                    <Zap className="w-4 h-4 animate-pulse" />
                    <span>COGNITIVE PERFORMANCE INSIGHTS REPORT:</span>
                  </div>
                  <div className="space-y-2 text-slate-300 pl-1">
                    <div className="flex gap-2 items-start">
                      <span className="text-indigo-400 font-bold font-mono">✔</span>
                      <p><strong>CTR Boost:</strong> Utilizing a question-based visual hook in Act I increases YouTube CTR by average <strong>+4.2%</strong>. Recommended mapping: <em>Claude 3.5 Sonnet</em>.</p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <span className="text-indigo-400 font-bold font-mono">✔</span>
                      <p><strong>Retention Sweetspot:</strong> TikTok videos using ElevenLabs British Investigative voiceovers hold user attention <strong>12.8 seconds longer</strong> than generic US baritones.</p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <span className="text-indigo-400 font-bold font-mono">✔</span>
                      <p><strong>Latency optimization:</strong> Gemini 1.5 Flash executes Deep Research <strong>42% faster</strong> than Claude Sonnet without dropping factual accuracy.</p>
                    </div>
                  </div>
                </div>

                {/* Historical Database */}
                <div className="space-y-3.5 pt-3">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Historical CTR Performance Database</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {memoryRecords.map((rec) => (
                      <div key={rec.id} className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-3 text-xs font-mono">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                          <span className="text-[9px] text-slate-550">#{rec.id}</span>
                          <span className="text-rose-400 font-bold">{rec.format}</span>
                        </div>

                        <div className="space-y-1">
                          <strong className="text-slate-100 block text-xs truncate" title={rec.topic}>
                            {rec.topic}
                          </strong>
                          <p className="text-[10px] text-slate-500 italic">
                            "{rec.bestHook}"
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-zinc-900 pt-2.5">
                          <div>
                            <span className="text-slate-550 block text-[9px]">CTR YIELD:</span>
                            <span className="text-emerald-400 font-bold">{rec.ctr}%</span>
                          </div>
                          <div>
                            <span className="text-slate-550 block text-[9px]">RETENTION:</span>
                            <span className="text-indigo-400 font-bold">{rec.retention}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* --- MODAL: START NEW VIDEO PROJECT --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-5 space-y-4 animate-scaleUp text-left">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
              <h3 className="text-xs font-mono font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-4 h-4 text-rose-400" />
                Initialize Video Pipeline
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-500 uppercase font-black block">Project Name</label>
                <input
                  type="text"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. History of Cybernetics"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-500 uppercase font-black block">Niche Pipeline Preset</label>
                <select
                  value={newProjPipeline}
                  onChange={(e) => setNewProjPipeline(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="History Documentary">History Documentary (Educational / Explainer)</option>
                  <option value="Kids Story">Kids Story (Bedtime StoryForge Series)</option>
                  <option value="Product Review">Product Review (Boss Listers Affiliate)</option>
                  <option value="YouTube Short">YouTube Short (9:16 vertical fast-hook)</option>
                  <option value="TikTok">TikTok (Viral hook / vertical)</option>
                  <option value="Marketing Video">Marketing Video (Promotional / CTR focus)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-500 uppercase font-black block">Topic / Focus Parameter</label>
                <textarea
                  value={newProjTopic}
                  onChange={(e) => setNewProjTopic(e.target.value)}
                  placeholder="e.g. Describe the theme, facts, target product details, or storyline parameters..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-slate-200 focus:outline-none h-20 leading-relaxed text-[11px]"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 text-slate-400 border border-zinc-800 rounded text-[10px] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-black cursor-pointer"
                >
                  CREATE PROJECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CROSSPOST PUBLISHING BRIDGING --- */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 text-left font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
              <h3 className="text-xs font-mono font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-indigo-400" />
                Dispatch & Schedule via CrossPost
              </h3>
              <button 
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold mb-1">Target Platforms</span>
                <div className="flex gap-3">
                  {[
                    { id: "youtube", label: "YouTube Shorts / Vids" },
                    { id: "tiktok", label: "TikTok Video" },
                    { id: "instagram", label: "Instagram Reels" },
                    { id: "linkedin", label: "LinkedIn Video" }
                  ].map(plat => {
                    const active = publishChannels.includes(plat.id);
                    return (
                      <button
                        key={plat.id}
                        type="button"
                        onClick={() => {
                          setPublishChannels(prev => 
                            prev.includes(plat.id) ? prev.filter(c => c !== plat.id) : [...prev, plat.id]
                          );
                        }}
                        className={`px-2.5 py-1.5 rounded border text-[10px] font-bold cursor-pointer transition ${
                          active 
                            ? "bg-rose-950 border-rose-800 text-rose-400" 
                            : "bg-zinc-900 border-zinc-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {plat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-500 uppercase font-black block">Publishing Title</label>
                <input
                  type="text"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-500 uppercase font-black block">SEO Description Outline</label>
                <textarea
                  value={publishDesc}
                  onChange={(e) => setPublishDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-slate-200 focus:outline-none h-32 leading-relaxed text-[11px]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-500 uppercase font-black block">Scheduled Publication Date/Time</label>
                <input
                  type="datetime-local"
                  value={publishScheduleDate}
                  onChange={(e) => setPublishScheduleDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-slate-100 focus:outline-none cursor-pointer"
                />
              </div>

              <div className="bg-zinc-900/60 border border-zinc-850 p-2.5 rounded text-[9px] text-slate-500 leading-normal">
                Executing dispatch registers this package in the CrossPost Local Storage database. Navigating to CrossPost Sandbox will display these structured outputs, scripts, and schedules dynamically.
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 text-slate-400 border border-zinc-800 rounded text-[10px] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeCrossPostDispatch}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-black cursor-pointer"
                >
                  DISPATCH TO CROSSPOST
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
