# EMPIRE OS — CENTRAL AI HANDOFF & ONBOARDING PORTAL (START_HERE.md)
## Universal Zero-Context-Loss Engineering Blueprint & Operational Manual
> **SYSTEM SECURITY CLASSIFICATION**: Level 5 Sovereign Core (Classified)  
> **CURRENT VERSION**: 3.0.0 (Universal Single Source of Truth)  
> **PROJECT ENGINES**: Claude 3.5 Sonnet, Gemini 3.5 Pro/Flash, GPT-4o, DeepSeek, Qwen  
> **PRIMARY PORT ROUTING**: `0.0.0.0:3000` (Direct Ingress Container Mapping)  

---

## 1. WELCOME & OPERATIONAL MANDATE
Welcome, Agent. You have been assigned to **Empire OS**—a fully autonomous, full-stack, enterprise-grade multi-agent media production engine, market research laboratory, and social syndication suite. 

Your mandate is to maintain, optimize, and expand this sovereign developer console. This workspace is designed for **zero-human overhead**. All roles, tasks, memory registers, and rendering timelines are managed programmatically via our modular event loop and local-first SQLite/JSON database configurations.

This document serves as your immediate cognitive anchor. Read it in full to synchronize your execution boundaries, understand our high-velocity pipeline topologies, and proceed with feature development with zero loss of context.

---

## 2. COMPLETE CORE ARCHITECTURE
Empire OS is architected as a **decentralized, event-driven multi-plane topology** designed to isolate processing concerns, secure credentials, and enable infinite parallel execution.

### The Five Operational Planes
1. **I. Command & Executive Plane**: Orchestrated by the **Empire Executive Council** (CEO, CTO, CCO). Aggregates strategic logs, triggers active campaigns, manages resource budgets, and compiles daily telemetry briefings.
2. **II. Cognitive & Routing Plane**: Powered by the **Master Director AI** and `/api/empire/ai-router`. Maps cognitive prompts to specialized models—directing code/reasoning to local Ollama weights (`deepseek-coder`, `llama3.1:70b`) and high-context or creative payloads to cloud API gateways (`gemini-3.5-pro/flash`).
3. **III. Pipeline & Automation Plane**: Hosts isolated media/marketing engines:
   * **History Documentary Forge**: Fully automated, 16-stage documentary creator.
   * **StoryForge Children's Content Engine**: Visual storyboard-to-video generator.
   * **Boss Listers B2B CRM**: Outreach crawler and email contact verification pipeline.
   * **CrossPost Syndication Network**: Translates video files and screenplays into viral multi-platform social campaigns (X threads, LinkedIn posts, Substack articles).
4. **IV. Persistence & Data Plane**: Consolidated memory bus uniting transient React hooks, stable browser `localStorage` registers, high-durability Firestore database schemas, and SQLite/JSON local files for long-term telemetry logging.
5. **V. Asset & Inference Plane**: Enforces standard media directory layouts (`/assets/`) and maintains API client pools with lazy-initialization to prevent boot crashes if external tokens are absent.

```
                  +-----------------------------------------+
                  |       I. COMMAND & EXECUTIVE PLANE      |
                  |  - Telemetry Console & Event Board      |
                  +--------------------+--------------------+
                                       |
                  +--------------------v--------------------+
                  |      II. COGNITIVE & ROUTING PLANE      |
                  |  - AI Router Gateway & Model Selector   |
                  +--------------------+--------------------+
                                       |
                  +--------------------v--------------------+
                  |    III. PIPELINE & AUTOMATION PLANE     |
                  |  - Video Forge | Boss Listers | CrossPost |
                  +--------------------+--------------------+
                                       |
                  +--------------------v--------------------+
                  |      IV. PERSISTENCE & DATA PLANE       |
                  |  - Firestore blue-prints & Local Memory |
                  +--------------------+--------------------+
                                       |
                  +--------------------v--------------------+
                  |        V. ASSET & INFERENCE PLANE       |
                  |  - Asset Vault, Local Ollama, Cloud APIs|
                  +-----------------------------------------+
```

---

## 3. MASTER FILE & DIRECTORY SPECS
To keep the filesystem tidy and prevent duplicate agents from overlapping, strictly respect this structural layout:

```
/ (Workspace Root)
├── START_HERE.md                    # You are here: Master handoff portal
├── EMPIRE_SYSTEM_MANUAL.md          # Permanent Master System Manual
├── SYSTEM_MAP.json                  # Machine-readable JSON directory & system config
├── AI_RESPONSIBILITIES.md           # Allocation map matching models to tasks
├── PIPELINE_REFERENCE.md            # Detailed pipeline schemas and stage mappings
├── LOCAL_MODELS.md                  # Local Ollama connection configuration
├── FOLDER_STRUCTURE.md              # Physical file structure guide
├── API_REFERENCE.md                 # Express server API endpoints directory
├── AUTOMATION_RULES.md              # Enforced agentic behavioral rules
├── PROJECT_INDEX.md                 # Active and simulated project records index
├── MEMORY_PROTOCOL.md               # Telemetry logging and persistence rules
│
├── .env.example                     # Reference template for API key configs
├── index.html                       # Frontend application HTML shell
├── server.ts                        # Master Express backend & Vite asset gateway
├── package.json                     # Dependencies, compiler, and start scripts
├── tsconfig.json                    # Compiler directives
├── vite.config.ts                   # HMR suppression and build bundling configurations
│
├── assets/                          # Unified Asset Vault
│   ├── media/                       # Rendered video compilations and images
│   ├── projects/                    # Project folder directories for completed bundles
│   └── templates/                   # Audio soundtracks, cinematic soundscapes, overlays
│
├── db/                              # Persistent schemas and configurations
│   └── schema.ts                    # Cloud Firestore Database specs
│
├── EmpireOS/
│   └── Knowledge/                   # Locked permanent system guidelines and manuals
│       ├── memory.db                # SQLite local telemetry tracking database
│       └── master_spec.md           # Locked architectural specifications
│
└── src/                             # High-density Dashboard Application Source
    ├── main.tsx                     # Vite-React entrypoint
    ├── App.tsx                      # Main layout and view routing hub
    ├── index.css                    # Global styles with custom tailwind directives
    ├── types.ts                     # TypeScript shared structures and interfaces
    └── components/                  # Isolated operational deck modules
        ├── MissionControl.tsx       # System terminal, server statuses, and command deck
        ├── DocumentaryFactory.tsx   # Automated document-to-markdown manual compiler
        ├── VideoCreator.tsx         # Responsive Autonomous 16-Stage Video Pipeline Panel
        ├── AIRouter.tsx             # Model intelligence test-bench console
        ├── EmpireInspector.tsx      # Codebase auditor and tech debt checker
        ├── OllamaCommandCenter.tsx  # Local Ollama service monitoring panel
        ├── PerformanceDashboard.tsx # Diagnostic graphs (RAM, CPU, API Latency, VRAM)
        └── AutomationCenter.tsx     # CrossPost social syndicate and publishing logs
```

---

## 4. DATABASE & PERSISTENCE SCHEMA
The system employs **Firestore** for durable cloud storage and **local JSON stacks** for offline-first caching.

### Unified Schemas (TypeScript Specs)

#### A. ProjectRecord Schema (`src/types.ts`)
Tracks active video initiatives, leads harvesting campaigns, or social syndicates.
```typescript
export interface ProjectRecord {
  id: string;               // Unique GUID
  department: 'documentary' | 'storyforge' | 'bosslisters' | 'crosspost';
  title: string;
  status: 'drafting' | 'processing' | 'rendered' | 'published' | 'failed';
  currentStep: number;
  totalSteps: number;
  timestamps: {
    created: string;
    updated: string;
    completed?: string;
  };
  metadata: Record<string, any>; // Pipeline-specific execution tracking
}
```

#### B. UnifiedAsset Schema (`src/types.ts`)
Tracks generated video clips, narration files, subtitle assets, and design concepts.
```typescript
export interface UnifiedAsset {
  id: string;
  projectId: string;
  type: 'image' | 'audio' | 'video' | 'script' | 'map' | 'subtitle' | 'manifest' | 'audit';
  uri: string;              // Relative path inside standard /assets vault
  metadata: {
    promptUsed?: string;
    modelProvider?: string;
    duration?: number;      // Seconds for audio or video
    resolution?: string;    // Image or video resolution specs
  };
}
```

#### C. AnalyticsRecord Schema
Tracks publishing metrics across syndication target channels.
```typescript
export interface AnalyticsRecord {
  id: string;
  projectId: string;
  platform: 'youtube' | 'tiktok' | 'x' | 'linkedin' | 'substack';
  metrics: {
    views: number;
    watchTime: number;
    engagementRate: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  capturedAt: string;
}
```

---

## 5. API SPECIFICATIONS
All background processes, agent commands, and dashboard updates communicate with our master Node server.ts on port `3000`.

### REST Route Registry

| Endpoint | Method | Payload Scheme | Response Structure | Purpose |
|---|---|---|---|---|
| `/api/empire/event-bus` | GET | None (SSE Setup) | `text/event-stream` | Stream real-time engine actions and telemetry to Dashboard |
| `/api/video-pipeline/create` | POST | `{ topic: string, durationPreset: string }` | `{ success: true, project: ProjectRecord }` | Spin up a new autonomous video campaign |
| `/api/video-pipeline/execute-step` | POST | `{ projectId: string, stepId: string }` | `{ success: true, assets: Record<string, any> }` | Force compile a single specific stage in the 16-stage pipeline |
| `/api/storyforge/generate` | POST | `{ theme: string, targetAge: number }` | `{ status: 'completed', data: StoryPackage }` | Design child illustration books and render custom video packages |
| `/api/leads/harvest` | POST | `{ category: string, location: string }` | `{ status: 'harvesting', totalExpected: number }` | Launch the B2B crawler and contact validator |
| `/api/empire/ai-router` | POST | `{ prompt: string, forceModel?: string }` | `{ result: string, modelUsed: string }` | Smart gateway prioritizing local vs cloud API context size thresholds |

---

## 6. AUTONOMOUS VIDEO PIPELINE SPECIFICATION
The **autonomous documentary pipeline** has been updated to a highly granular **16-stage operational timeline**. Each step-gate must successfully complete and write its verified asset manifest before downstream processes can compile.

### Stage-Gate Breakdown & Manifest Outputs

```
[1. Deep Niche Research] -> [2. Fact Verification Audit] -> [3. Narration Screenplay]
                                                                     |
[6. SDXL Image Prompt Synth] <- [5. Cinematic Storyboard] <- [4. Scene Timeline Breakdown]
           |
[7. Higgsfield Camera Kinetics] -> [8. Voiceover Synthesis] -> [9. Film Score Composition]
                                                                     |
[12. Aesthetic Cover Art] <- [11. SRT Timed Subtitles] <- [10. SFX Audio Design]
           |
[13. SEO Optimization Pack] -> [14. Vertical Shorts Recut] -> [15. Multi-Platform Copy]
                                                                     |
                                                       [16. Master Package Assembly] (Manifest.json)
```

1. **research**: Deep Niche Research
   * *Output*: `research.md` (Comprehensive facts, background context, and technical definitions compiled via Gemini).
2. **fact_verification**: Fact Verification Audit
   * *Output*: `fact_audit.md` (Strict verification checking timelines, historical dates, names, and sources).
3. **script_writing**: Narration Screenplay
   * *Output*: `script.md` (Cinematic screenplay detailing narration speech paired with visual directions).
4. **scene_breakdown**: Scene Breakdown Timeline
   * *Output*: `scenes.json` (Screenplay parsed into chronological timeline cells with estimated timings).
5. **storyboard**: Cinematic Storyboard
   * *Output*: `storyboard.json` (Detailing lighting, framing, camera angle, and narrative mood per scene).
6. **character_selection**: Avatar Character Casting
   * *Output*: `cast.json` (Selected character avatar bible parameters matching traits with outfit instructions).
7. **image_prompts**: SDXL Image Prompt Synthesis
   * *Output*: `image_prompts.json` (Photorealistic prompt parameters mapped for stable diffusion image nodes).
8. **video_prompts**: Higgsfield Camera Kinetics
   * *Output*: `video_prompts.json` (Panning, zoom speeds, and track instructions to direct motion vectors).
9. **voice_generation**: Voiceover Synthesis
   * *Output*: `narration.wav` (High-fidelity 48kHz audio speech generated using selected narrator profile parameters).
10. **music_selection**: Film Score Composition
    * *Output*: `music.json` (Selected ambient soundtracks and cinematic scores ducked dynamically to -12dB).
11. **sound_effects**: SFX Audio Design
    * *Output*: `sfx.json` (Identified sound triggers—hums, risers, ambient wind—with precise timings).
12. **subtitle_generation**: SRT Timed Subtitles
    * *Output*: `subtitles.srt` (Word-aligned subtitle tracks computed directly from audio narration durations).
13. **thumbnail_generation**: Aesthetic Cover Art
    * *Output*: `thumbnail_concept.json` (Highly clickable layout designs with custom orange high-contrast typographic overlays).
14. **youtube_metadata**: SEO Optimization Pack
    * *Output*: `metadata.json` (Optimized high-CPM tag structures, catchy titles, and complete video description text).
15. **shorts_generation**: Vertical Shorts Recut
    * *Output*: `shorts_script.txt` (60-second high-retention script format optimized for 9:16 portrait view rendering).
16. **social_media_assets**: Multi-Platform Copywriter
    * *Output*: `social_promo.json` (Drafted Twitter/X hooks, viral threads, LinkedIn summaries, and Reddit posts).
17. **export_folder**: Master Package Assembly
    * *Output*: `manifest.json` (Consolidated, integrity-hashed package directory containing all 13 final physical files).

---

## 7. PROMPT LIBRARIES & CHARACTER RULES
All agent prompts are isolated inside `/projects/prompt_library/` (cached inside `/EmpireOS/Knowledge/`) to allow continuous updates without modifying code logic.

### Character Design Standards
To maintain consistent facial structures, age metrics, and attire styling across multiple generated images/clips, apply this YAML schema for character generation prompts:
```yaml
character_bible:
  id: "tech_noir_agent_01"
  name: "Marcus Vance"
  traits: "Weathered detective, 35 years old, sharp gaze, stubble, short dark hair, cybernetic neural port visible behind the ear."
  wardrobe: "Dark charcoal high-collar waterproof trench coat, black leather gloves, micro-electronic chest utility rig."
  artistic_direction: "Photorealistic cinematic, anamorphic lens flare, cyberpunk street background with neon reflections, 8k resolution."
```

### Narrator Configuration Mapping
Our standard high-conversion voice profile standardizes cadences to ensure maximum audience retention:
```json
{
  "voiceProfileId": "bbc_presenter_male_doc",
  "stability": 0.82,
  "similarity_boost": 0.90,
  "cadence": "Measured narrative, authority, slow pauses between complex concepts, standard BBC dialect."
}
```

---

## 8. IMMEDIATE NEXT STEPS & HANDOFF DIRECTIONS
When taking over development, here is where the project stands and your immediate directions for expansion:

1. **Verify Development Mode**: Rerun `npm run build` followed by `npm run dev` to ensure Vite successfully bundles all frontend stations.
2. **Review Pipeline Transitions**: Look into `/src/components/VideoCreator.tsx` to inspect how state transitions are triggered via user buttons. Ensure the 16 pipeline steps are properly logged inside `activeProject.assets`.
3. **Local Ollama Optimization**: Expand `/api/empire/ai-router` inside `server.ts` to support deeper routing rules when connecting to local inference models (`deepseek-coder`).
4. **Hardened File Integrity**: Implement auto-archiving on the Express server side when the `manifest.json` is exported, copying compiled asset packages into `/assets/projects/` with SHA-256 validation checksums.

You are now fully onboarded. All systems are initialized and ready. Go forth and expand the AI Empire!
---
*SYSTEM TRANSMISSION SECURED — EMPIRE OS MASTER CONTROLLER INITIALIZED.*
