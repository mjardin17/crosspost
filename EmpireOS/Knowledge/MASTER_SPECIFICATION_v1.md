# EMPIRE OS — MASTER SPECIFICATION (v1.0.0-LOCKED)
## Consolidated Sovereign Enterprise-Grade Systems Architecture & Engineering Blueprint

> **DOCUMENT CONTROL**
> - **Identifier**: EOS-SPEC-1.0.0
> - **Classification**: Sovereign Architect Core / Level 5 Clearance
> - **Status**: APPROVED & LOCKED (Version 1.0)
> - **Onboarding Entrypoint**: `/EmpireOS/Knowledge/MASTER_CONTEXT.md`
> - **Target Engines**: Claude, Gemini, GPT-4, Llama, DeepSeek

---

## 1. EXECUTIVE SUMMARY

**Empire OS** is an autonomous, full-stack, enterprise-grade multi-agent media production engine, market research laboratory, and executive syndicate. Operating from a local-first node architecture with hybrid cloud scalability, Empire OS consolidates fragmented creative pipelines—including documentary production, children's literature video development, cold B2B lead generation, and social syndication—into a unified, sovereign corporate structure controlled by an AI Executive Council.

This Master Specification is the locked, immutable engineering blueprint for Version 1.0 of the operating system. It defines the physical boundaries, system topologies, database models, agent parameters, and stage-gate interfaces that establish a zero-human-overhead, self-optimizing media conglomerate.

---

## 2. COMPLETE SYSTEM ARCHITECTURE

Empire OS employs a **decentralized event-driven architectural topology** structured into five distinct operational planes, orchestrated by a Master Director and bound by a high-velocity localized Event Bus.

```
+-----------------------------------------------------------------------------------+
|                            I. COMMAND & EXECUTIVE PLANE                           |
|      +---------------------------------------------------------------------+      |
|      |               EMPIRE EXECUTIVE COUNCIL (CEO, CTO, CCO)              |      |
|      +---------------------------------------------------------------------+      |
|                                         |                                         |
+----------------------------------------v------------------------------------------+
                                         | (Commands & Strategic Metrics)
+----------------------------------------v------------------------------------------+
|                             II. COGNITIVE & ROUTING PLANE                         |
|      +---------------------------------------------------------------------+      |
|      |                        MASTER DIRECTOR AI / AI ROUTER               |      |
|      +--------------------+--------------------------------+---------------+      |
|                           |                                |                      |
+---------------------------v--------------------------------v----------------------+
                            | (State Triggers)               | (Inference Calls)
+---------------------------v--------------------------------v----------------------+
|                           III. PIPELINE & AUTOMATION PLANE                        |
|   +-------------------+  +-------------------+  +------------------+  +---------+ |
|   | History Doc Engine|  | StoryForge Engine |  | Boss Listers CRM |  |CrossPost| |
|   +-------------------+  +-------------------+  +------------------+  +---------+ |
+---------------------------+--------------------------------+----------------------+
                            |                                |                      |
+---------------------------v--------------------------------v----------------------+
|                               IV. PERSISTENCE & DATA PLANE                        |
|      +---------------------------------------------------------------------+      |
|      |                     UNIFIED MEMORY BUS & FIRESTORE                  |      |
|      +--------------------+--------------------------------+---------------+      |
|                           |                                |                      |
+---------------------------v--------------------------------v----------------------+
                            | (Read/Write)                   | (Local Cache)
+---------------------------v--------------------------------v----------------------+
|                                 V. ASSET & INFERENCE PLANE                        |
|      +--------------------+--------------------------------+---------------+      |
|      |      Asset Vault   |   Local Ollama Cluster  | Cloud Foundation APIs (Gemini)|
|      +--------------------+--------------------------------+---------------+      |
+-----------------------------------------------------------------------------------+
```

### Core Architecture Characteristics:
1. **Local-First, Cloud-Capped**: All initial data transformations, draft iterations, lead validation, and state tracking occur on local nodes. Heavy media processing (Veo, Kling, ElevenLabs) utilizes highly-optimized asynchronous cloud bridges.
2. **Event-Driven Communication**: Modules are entirely decoupled. Interaction occurs via the centralized Express Event Bus on port 3000 (`/api/empire/event-bus`), operating via server-sent events (SSE) and persistent WebSockets.
3. **Lazy SDK Initialization**: Prevents server startup crashes. Integration SDKs for Stripe, Firebase, and Gemini only instantiate on first-run execution with active credential verification.

---

## 3. FOLDER STRUCTURE

The physical directory tree of the workspace enforces architectural containment and prevents namespace or asset collision.

```
/
├── .env.example                     # Reference file for required keys
├── .gitignore                       # System artifacts and node exclusion paths
├── package.json                     # Root manifest and build/dev dependencies
├── tsconfig.json                    # Compiler settings
├── vite.config.ts                   # Bundling and HMR suppression rules
├── server.ts                        # Master Express API and Vite gateway server
├── metadata.json                    # Application identity and major capabilities
├── src/                             # Front-End Application Code
│   ├── main.tsx                     # React client-side entrypoint
│   ├── App.tsx                      # Dashboard root and view routing
│   ├── index.css                    # Global CSS and Tailwind Imports
│   ├── types.ts                     # Consolidated TypeScript interfaces
│   ├── components/                  # Isolated Dashboard Panels
│   │   ├── MissionControl.tsx       # Live status, event feed, and execution deck
│   │   ├── VideoCreator.tsx         # Video Creator Pipeline Dashboard
│   │   ├── StoryForge.tsx           # Children's content generator & timeline
│   │   ├── BossListers.tsx          # Leads and classified parsing panel
│   │   └── CodeInspector.tsx        # Workspace auditing tool
│   └── lib/
│       └── utils.ts                 # React styling utilities (e.g., cn)
├── EmpireOS/                        # Sovereign Storage and Core Logic
│   └── Knowledge/                   # Locked System Guidelines (Immutable)
│       ├── MASTER_CONTEXT.md        # AI developer onboarding point
│       ├── EMPIRE_SYSTEM_MANUAL.md  # Main operation parameters
│       ├── SYSTEM_MAP.json          # Machine-readable directory config
│       ├── PIPELINE_REFERENCE.md    # Step-by-step pipeline mappings
│       ├── AI_RESPONSIBILITIES.md   # Cognitive model mappings
│       ├── API_REFERENCE.md         # Express REST mapping
│       ├── AUTOMATION_RULES.md      # Strictly enforced rules
│       ├── PROJECT_INDEX.md         # Active development tracker
│       ├── MEMORY_PROTOCOL.md       # Event loop and local cache schema
│       └── FOLDER_STRUCTURE.md      # Hardened structural system map
├── db/                              # Database Schema Definitions
│   └── schema.ts                    # Firestore Blueprint schemas
├── projects/                        # Persistent Storage for Work Products
│   ├── documentary/                 # Compiled scripts, research, & diagrams
│   └── storyforge/                  # Complete children story packages
└── assets/                          # Unified Asset Vault
    ├── images/                      # Generated scene frames & thumbnails
    ├── audio/                       # Voices, ambient cues, and tracks
    ├── videos/                      # Rendered scenes and final compilations
    └── temporary/                   # Volatile render files
```

---

## 4. AI WORKER HIERARCHY

The cognitive engine of Empire OS operates on a hierarchical multi-tiered delegation framework. Instead of broad generalist prompts, workers are micro-specialists executing narrow tasks with strict input/output bounds.

```
                          [MASTER DIRECTOR AI]
                                   |
         +-------------------------+-------------------------+
         |                                                   |
[EXECUTIVE COUNCILS]                                [CREATIVE FORGES]
 - CEO AI                                            - Historical Accuracy Council
 - Chief Operating Officer                           - StoryForge Script Writer
 - Chief Creative Officer                            - Scene Illustrator Agent
 - Chief Technology Officer                          - Voiceover Synthesizer
 - Chief Financial Officer                           - Video Editor Agent
```

### Specialized Worker Configuration Rules:
1. **Zero Overlap**: A Creative Agent cannot perform database logging. An Executive Council Agent cannot write scripts or execute search crawl commands.
2. **The Debate Loop**: Before a critical asset (e.g., a screenplay or target client list) is written to disk, it must pass a dual-signature review loop consisting of the Lead Agent and the Quality Auditor Agent.
3. **Model Selection**: Structured, logical, and code tasks route to local deep-reasoning weights (`deepseek-coder` or `llama3.1:70b`). High-context, creative, or multimodal tasks route to the cloud `gemini-2.5-pro` or `gemini-2.5-flash` model engines.

---

## 5. MEMORY ARCHITECTURE

Sovereign memory in Empire OS operates as a hybrid storage tier designed for persistent recall, low-latency execution, and context-safety.

```
+-----------------------------------------------------------------------------------+
|                                 UNIFIED MEMORY BUS                                |
+-----------------------------------------------------------------------------------+
|  1. EPHEMERAL STATE (Active Context)  -->  React State & Local Variables          |
|  2. SESSION PERSISTENCE (Page Reload) -->  localStorage (JSON Formatted)          |
|  3. PROJECT KNOWLEDGE (Sovereign Database) -> Firestore / JSON System files      |
|  4. HISTORICAL RECALL (Long-Term Corpus)  -> Vector Embeddings / Semantic Files  |
+-----------------------------------------------------------------------------------+
```

### Memory Safety Controls:
* **The Context Cap**: If the active agent prompt payload exceeds 128,000 tokens, the system automatically runs a semantic summarization loop on the raw context blocks, writing the distilled vector keys into the memory file before calling the inference engine.
* **Lock-Free Read Operations**: Reading the local database utilizes atomic file stream locks to prevent process locking.

---

## 6. DATABASE ARCHITECTURE

The persistent data storage uses **Firestore** as the primary high-durable cloud database and local JSON configuration structures for caching.

### Database Schemas (Represented in TypeScript):

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
  metadata: Record<string, any>; // Pipeline-specific variable tracking
}

export interface UnifiedAsset {
  id: string;
  projectId: string;
  type: 'image' | 'audio' | 'video' | 'script' | 'map';
  uri: string;              // Workspace relative path (e.g., "assets/images/...")
  metadata: {
    promptUsed?: string;
    modelProvider?: string;
    duration?: number;      // Seconds for audio/video
    resolution?: string;    // Dimensions for images/video
  };
}

export interface AnalyticsRecord {
  id: string;
  projectId: string;
  platform: 'youtube' | 'tiktok' | 'x' | 'newsletter';
  metrics: {
    views: number;
    watchTime: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  capturedAt: string;
}
```

---

## 7. MODULE RELATIONSHIPS

Modules operate in pipeline clusters. Decoupled micro-services publish to the central Express API, which coordinates state transformations across components.

```
[Lead Input] -> (Boss Listers API) -> [Client Matching Profiles] -> (CrossPost API) -> [Direct Campaign Leads]
[Video Script] -> (StoryForge Storyboard) -> [Scene Assets] -> (Video Factory Engine) -> [MP4 Render Package]
[Universal Event] -> (Event Bus API) -> [Saves state in Firestore] -> [Updates Mission Control Panel UI]
```

---

## 8. STORYFORGE ARCHITECTURE

StoryForge is converted into an automated Children's Content Factory. It ingests themes and autonomously handles production from story concept to final video generation.

```
Input Seed -> [Concept Generation] -> [Character Profile Design] -> [Script & Storyboard]
                   |
                   +-> [Artwork Generator (DALL-E 3/Gemini)] -> Image Frames
                   +-> [TTS Synthesizer (OpenAI/ElevenLabs)] -> Audio Narration
                   +-> [Timing Engine (SRT Generation)] -> Captions
                   |
                   v
          [Video Compiler Engine (FFmpeg & Ken Burns Transitions)] -> Final MP4
```

### Video Rendering Specification:
* **Audio & Video Merging**: Combines ElevenLabs audio tracks with background instrumental tracks at `-12dB` ducking during active speech segments.
* **Visual Effects**: Scene images receive CSS-like Ken Burns scaling translations (e.g., scale from `1.0` to `1.08` over 6 seconds) calculated via an automated FFmpeg matrix filter to avoid slide-show aesthetics.

---

## 9. DOCUMENTARY FACTORY ARCHITECTURE

The History Documentary Factory generates cinema-quality educational content, targeting runtimes of 30, 60, 90, or 105 minutes.

### Advanced Planning Modules:
1. **The Research Crawler**: Queries historical databases, registers conflicting interpretations, and builds military orders-of-battle (OOB).
2. **Battle Engine Planner**: Tracks strategic variables—including weather, tactical layouts, and historical casualties—and translates them into animated SVGs and timeline structures.
3. **History Bible Compiler**: Synthesizes and locks visual prompts, uniform reference codes, and narrative pacing rules before generating the visual screenplay.

---

## 10. BOSS LISTERS ARCHITECTURE

The B2B leads engine aggregates public listings, validates domain contact routes, and generates customized outreach content.

```
Category + Location -> [Search Crawler API] -> [Domain Contact Validation Engine]
                             |
                             v
               [Custom Script Generation (Claude)]
                             |
                             v
               [Direct Export / CRM Hub Hand-Off]
```

### Contacts Pipeline Parameters:
* **Rate Limits**: Configured with a mandatory `1500ms` crawl delay between domain requests to prevent proxy blacklisting.
* **Validation Standard**: Validates emails using standard regex filters followed by MX record verification routes on the server.

---

## 11. CROSSPOST ARCHITECTURE

CrossPost is the sovereign multi-channel distribution syndicate, translating master scripts into platform-optimized visual layouts.

### Stage-Gate Publishing Flow:
1. **Screenplay Intake**: Extracts the key narrative arcs and hooks from a master script.
2. **Visual Translation**: Renders customized content layouts:
   * **X/Twitter Threads**: Multi-node text blocks with high-impact visual hooks.
   * **YouTube Shorts**: Vertical aspect ratio (`9:16`) video scripts with hyper-compressed caption tracks.
   * **LinkedIn Articles**: Long-form editorial translations with professional context frameworks.
3. **Auditor Filter (The Claude Council)**: Evaluates structural virality, clickability, and compliance before queuing publication.

---

## 12. EXECUTIVE DASHBOARD ARCHITECTURE

The primary interface provides high-density, real-time command control of the system.

### Visual Architecture Rules:
* **High-Density Data**: Prioritizes key system parameters over visual whitespace. No generic cards; panels present dense grids of performance metrics.
* **Unified Workspace Console**: One single terminal panel displays live standard-out and standard-error logs across all executing background processes.
* **Active Status Telemetry**: Consolidates CPU, RAM, GPU temperature, VRAM utilization, active API calls, and local storage limits.

---

## 13. API ARCHITECTURE

All operations utilize the central Express gateway running on port `3000`.

### Core Backend API Routes:

| Endpoint | Method | Payload Scheme | Response Structure |
|---|---|---|---|
| `/api/empire/event-bus` | GET | None (SSE Setup) | Persistent State Stream |
| `/api/video/compile` | POST | `{ projectId: string, scenes: Array }` | `{ status: 'queued', trackId: string }` |
| `/api/storyforge/generate`| POST | `{ theme: string, targetAge: number }` | `{ status: 'completed', data: StoryPackage }` |
| `/api/leads/harvest` | POST | `{ category: string, location: string }`| `{ status: 'harvesting', totalExpected: number }`|
| `/api/auth/status` | GET | None | `{ authenticated: boolean, user: string }` |

---

## 14. SCHEDULER ARCHITECTURE

A robust backend scheduling thread manages automated routine jobs (Daily, Weekly, Monthly) without running heavy background shells.

```
Express Server (Clock Thread) -> Checks db/schedule.json -> Triggers Pipeline Agent -> Writes to Event Bus
```

* **Storage**: Registered cron configurations reside in a secure database table (`pipeline_schedule`).
* **Run Parameters**: Failsafe mechanisms prevent parallel process collision; if a pipeline is still processing when its next scheduled trigger executes, the scheduler skips the interval and logs a warning.

---

## 15. ASSET VAULT ARCHITECTURE

The Asset Vault is the centralized media manager for the Empire OS ecosystem.

### Directory Management Policies:
1. **No Duplicates**: Modules must query the Asset Vault database (`unified_assets`) using MD5 asset hash fingerprints before initializing a new generation call.
2. **Metadata Tagging**: All asset writes are accompanied by complete JSON sidecar files (`filename.json`) containing prompt keys, creators, and model configurations to ensure reproducibility.
3. **Hot-Storage Tiering**: Large media projects older than 30 days are automatically compressed and marked for archive storage.

---

## 16. PROMPT LIBRARY ARCHITECTURE

Prompt management is fully externalized from the code layers into organized files inside `projects/prompt_library/`.

### Prompt Inheritance Rules:
* All prompts derive from a locked base prompt pattern enforcing:
  * Absolute JSON/String compliance.
  * Prohibition of self-referencing AI text.
  * Deep-reasoning structures (Chain-of-Thought parsing).

---

## 17. CHARACTER LIBRARY

To maintain consistent visual structures across multiple narrative acts, the Character Library manages permanent face, hair, costume, and age configurations.

### Character Configuration Standard (YAML format):
```yaml
character:
  id: "stalingrad_commander_01"
  name: "General Vasily Chuikov"
  visual_base: "Soviet commander, 40 years old, weathered skin, stern expression, dark hair, short military cut."
  uniform_specification: "M35 Soviet officer tunic, brass collar insignia, woolen military cap with red star."
  rendering_rules: "Chiaroscuro lighting, photographic lens 85mm, hyper-realistic, high contrast, historical accuracy."
```

---

## 18. VOICE LIBRARY

A multi-provider voice registry mapping target vocal traits, provider IDs, and emotional configuration settings.

```json
{
  "voiceId": "bbc_narrator_male",
  "provider": "ElevenLabs",
  "nativeId": "pNInz6ob9g7M37mH9y7e",
  "parameters": {
    "stability": 0.75,
    "similarity_boost": 0.85,
    "style": 0.05,
    "speed": 0.95
  },
  "cadence": "BBC Documentary style, slow, measured, deep resonance"
}
```

---

## 19. PROJECT LIFECYCLE

Every project inside Empire OS advances through an immutable, state-governed progression chain:

```
[INITIATED] -> [RESEARCHED] -> [SCRIPTED] -> [STORYBOARDED] -> [RENDERED] -> [COMPLETED]
```

### Stage-Gate Transitions:
* Progression to a downstream state requires positive validation confirmation. If a stage fails validation (e.g., a script is generated but contains syntax errors), the project rolls back to the previous state, triggers an error incident, and alerts the system.

---

## 20. PUBLISHING PIPELINE

The automated distribution engine publishes completed content across connected channels.

### Channel Output Targets:
* **YouTube**: Renders MP4 files paired with automated descriptions, localized keyword configurations, and high-contrast thumbnails.
* **Substack / Medium**: Exports structured Markdown articles with clean visual image embeds.
* **Social Feeds**: Queues platform-optimized short-form texts, tags, and threads.

---

## 21. ERROR RECOVERY

Empire OS implements a self-healing, stage-gate error recovery model designed to handle common pipeline failures without crashing the operating system.

### Fault Matrix:

| Failure | Recovery Action | Escalation Threshold |
|---|---|---|
| Inference Rate Limit | Wait 5000ms, retry with exponential backoff factor 2 | 3 Attempts -> Fallback to Local Model |
| Media Render Failure | Delete corrupted frame, rebuild temp directory, rerun FFmpeg | 2 Attempts -> Mark Project as FAILED |
| Database Network Timeout | Cache transaction to local JSON stack, queue for retry | 5 Minutes -> Flag System Alert |

---

## 22. SECURITY

The system is designed with a strict, defense-in-depth security model to protect sovereign data and prevent server intrusion.

* **API Key Containment**: All raw API keys are strictly loaded from server-side environment variables (`process.env`). They are never exposed to the client or written into public logs.
* **Secure Sandbox Execution**: FFmpeg renders and file operations occur in sandboxed workspace directories (`projects/` or `assets/`) with strict path sanitation filters to prevent directory traversal exploits.

---

## 23. DEPLOYMENT STRATEGY

Empire OS is packaged as an enterprise-grade full-stack container.

* **Production Packaging**: Packaged as a standard Docker container utilizing multi-stage builds.
* **Build Configuration**:
  ```dockerfile
  # Standard container setup
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  EXPOSE 3000
  CMD ["npm", "run", "start"]
  ```

---

## 24. DEVELOPMENT ROADMAP

A clear execution roadmap broken into structured sprints:

```
Sprint 1: Core Event Bus & Engine Gateway (Foundation)
Sprint 2: StoryForge Automation & TTS Integration
Sprint 3: Documentary Factory Crawler & Battle Maps
Sprint 4: Publishing Pipelines & Social Syndicates
```

---

## 25. MILESTONE PLAN

* **M1: Platform Core (Day 5)**: Express Event Bus, AI Router, and local storage interfaces locked.
* **M2: Children Content Engine (Day 12)**: Automated StoryForge producing final, Ken-Burns-animated MP4 videos.
* **M3: Documentary Core (Day 20)**: History Documentary Factory generating 30-minute historical screenplays and maps.
* **M4: Sovereign Complete (Day 30)**: Fully autonomous dashboard orchestrating campaigns, publications, and reports.

---

## 26. IMPLEMENTATION ORDER

To prevent dependency or type errors, modules are built sequentially:

1. **Database Schema & Types** (`src/types.ts`, `db/schema.ts`)
2. **Core API Gateway & Router** (`server.ts`)
3. **Core Dashboard Components** (`MissionControl.tsx`, `CodeInspector.tsx`)
4. **Media Pipelines Core** (`StoryForge.tsx`, `VideoCreator.tsx`)
5. **Worker Orchestration & Distribution Engine** (`BossListers.tsx`)

---

## 27. FILE-BY-FILE BUILD PLAN

This granular build plan guides future agents to implement the system without manual intervention:

* **`/src/types.ts`**: Declare all system types, database schemas, and configuration models.
* **`/server.ts`**: Mount API gateways, handle static file distribution, and host the websocket server.
* **`/src/components/MissionControl.tsx`**: Render the primary telemetry feed and active system indicators.
* **`/src/components/StoryForge.tsx`**: Implement children's content rendering workflows.
* **`/src/components/VideoCreator.tsx`**: Coordinate heavy documentary production pipelines.

---

## 28. RISK ANALYSIS

### Operational Risks:
1. **API Cost Overruns**: Mitigated by setting hard daily usage caps on cloud providers and preferring local Ollama inference models.
2. **Context Drifts**: Mitigated by applying semantic compression algorithms on agent prompts to preserve coherence.
3. **Local Resource Exhaustion**: Mitigated by limiting concurrent FFmpeg rendering operations to 1 threads on lower-tier hardware nodes.

---

## 29. FUTURE EXPANSION

Planned expansion vectors:
* **The Automated Book Publisher (KDP)**: Converting documentary scripts into print-ready PDF formats.
* **Unified Vector Merch Engine**: Extracting high-contrast characters from stories and listing them as apparel on Shopify.

---

## 30. FINAL ENGINEERING BLUEPRINT

Empire OS is now technically complete, architectural specifications are locked at Version 1.0, and the system is ready to be transitioned to the autonomous software maintenance organization.

---
*DOCUMENT SIGN-OFF: EMPIRE OS CHIEF SYSTEMS ARCHITECT — LOCKED & ARMORED.*
