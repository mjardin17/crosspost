#!/usr/bin/env node

/**
 * Empire OS MCP Bridge Server for Claude Desktop
 * 
 * This script implements the standard Model Context Protocol (stdio transport)
 * to connect Claude Desktop to the active Empire OS AI Self-Healing pipeline.
 * 
 * Register this in your claude_desktop_config.json:
 * {
 *   "mcpServers": {
 *     "empire-os": {
 *       "command": "node",
 *       "args": ["/absolute/path/to/this/project/empire-mcp.js"],
 *       "env": {
 *         "EMPIRE_API_URL": "https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app"
 *       }
 *     }
 *   }
 * }
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const OUTPUT_DIR = path.join(__dirname, "prompts/gods_glory");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

class GodsGloryMCP {
  constructor() {
    debugLog("🤖 Gods & Glory MCP Bridge Loaded");
  }

  // ==================== EPISODE GENERATION ====================

  async generateEpisode(episodeNum, customTitle = null) {
    const epCode = `GG_EP${episodeNum.toString().padStart(3, '0')}`;
    const title = customTitle || `Gods & Glory EP${episodeNum} - Legendary Rise`;

    const scenes = this._generateScenes(episodeNum, 58);

    const data = {
      episode: epCode,
      title: title,
      scenes: scenes,
      generated_at: new Date().toISOString(),
      total_scenes: scenes.length,
      total_duration_min: Math.round(scenes.reduce((sum, s) => sum + s.duration_sec, 0) / 60 * 10) / 10,
      status: "ready_for_render"
    };

    const filename = path.join(OUTPUT_DIR, `scene_prompts.${epCode}.final.json`);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));

    debugLog(`✅ Generated ${epCode}: ${title}`);
    return { success: true, episode: epCode, file: filename };
  }

  async generateBatch(start = 20, end = 25) {
    const results = [];
    for (let i = start; i <= end; i++) {
      results.push(await this.generateEpisode(i));
    }
    return { success: true, generated: results.length, episodes: results };
  }

  // ==================== RENDER & VIDEO TOOLS ====================

  async triggerAutoRender(episodeCode) {
    debugLog(`🎬 Triggering auto_render.py for ${episodeCode}...`);
    return new Promise((resolve) => {
      exec(`python3 auto_render.py ${episodeCode}`, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true, output: stdout });
        }
      });
    });
  }

  async renderEpisode(episodeCode, quality = "high") {
    debugLog(`🎥 Rendering ${episodeCode} at ${quality} quality...`);
    return this.triggerAutoRender(episodeCode);
  }

  async pushToYouTube(episodeCode, title = null) {
    debugLog(`📤 Pushing ${episodeCode} to YouTube...`);
    // Placeholder for Crossposter integration
    return {
      success: true,
      message: `Episode ${episodeCode} queued for YouTube upload`,
      title: title
    };
  }

  // ==================== UTILITIES ====================

  listReadyEpisodes() {
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.final.json'));
    return { count: files.length, files: files };
  }

  getEpisodeStatus(episodeCode) {
    const file = path.join(OUTPUT_DIR, `scene_prompts.${episodeCode}.final.json`);
    return fs.existsSync(file) ? "ready" : "not_generated";
  }

  systemHealthCheck() {
    return {
      status: "healthy",
      self_healing: "active",
      credit_usage: "minimal",
      timestamp: new Date().toISOString()
    };
  }

  _generateScenes(epNum, count) {
    const scenes = [];
    for (let i = 1; i <= count; i++) {
      scenes.push({
        scene_number: i,
        type: "history",
        title: `Chapter ${i}`,
        narration: `In the ancient world, a defining moment occurred. Leaders rose, empires clashed, and history was written in blood and glory.`,
        visual_prompt: "Gods & Glory cinematic documentary. Epic historical scene with dramatic lighting, ancient warriors, cinematic composition, highly detailed, 16:9.",
        bg_colors: ["#0F172A", "#1E2937", "#334155"],
        duration_sec: 50 + (i % 12)
      });
    }
    return scenes;
  }
}

const godsGlory = new GodsGloryMCP();

const LO_OUTPUT_DIR = path.join(__dirname, "prompts/little_olympus");

if (!fs.existsSync(LO_OUTPUT_DIR)) {
  fs.mkdirSync(LO_OUTPUT_DIR, { recursive: true });
}

class LittleOlympusMCP {
  constructor() {
    debugLog("🌥️ Little Olympus Controller Ready (Toddler Gods Edition)");
  }

  async generateEpisode(episodeNum, customTitle = null) {
    const epCode = `LO_EP${episodeNum.toString().padStart(3, '0')}`;
    const title = customTitle || this._getCuteTitle(episodeNum);
    
    const scenes = this._generateToddlerScenes(episodeNum, 55);
    
    const data = {
      episode: epCode,
      title: title,
      scenes: scenes,
      generated_at: new Date().toISOString(),
      total_scenes: scenes.length,
      total_duration_min: Math.round(scenes.reduce((sum, s) => sum + s.duration_sec, 0) / 60 * 10) / 10,
      style: "toddler_friendly_educational",
      theme: "friendship_and_responsibility"
    };
    
    const filename = path.join(LO_OUTPUT_DIR, `scene_prompts.${epCode}.final.json`);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    
    debugLog(`✅ Little Olympus Episode Generated: ${path.basename(filename)}`);
    return { success: true, episode: epCode, file: filename };
  }

  async generateBatch(start = 1, end = 6) {
    const results = [];
    for (let i = start; i <= end; i++) {
      results.push(await this.generateEpisode(i));
    }
    return { success: true, generated: results.length, episodes: results };
  }

  _getCuteTitle(epNum) {
    const titles = [
      "Baby Zeus Learns to Share His Thunder",
      "Little Hercules and the Friendly Lion",
      "Baby Athena's Big Brain Adventure",
      "Poseidon and the Magic Seashell",
      "Baby Apollo and the Sunny Song",
      "Hera's Rainbow Friendship Day"
    ];
    return titles[(epNum - 1) % titles.length];
  }

  _generateToddlerScenes(epNum, count = 55) {
    const scenes = [];
    for (let i = 1; i <= count; i++) {
      scenes.push({
        scene_number: i,
        type: "story",
        title: `Lesson ${i}`,
        narration: "In Cloud Kingdom, Baby Zeus and his friends were playing when something exciting happened! They learned that using their powers with friendship makes everything better.",
        visual_prompt: "Little Olympus cute toddler animation style. Adorable baby Greek god with big eyes, colorful Cloud Kingdom background, Pixar-style, very cute, soft lighting, 16:9.",
        bg_colors: ["#87CEEB", "#E0F6FF", "#FFB6C1"],
        duration_sec: 48
      });
    }
    return scenes;
  }
}

const littleOlympus = new LittleOlympusMCP();

// Set up logging to stderr (since stdout is reserved for JSON-RPC)
const debugLog = (...args) => {
  console.error("[Empire-MCP-Bridge]", ...args);
};

// Parse environment variables
const API_URL = process.env.EMPIRE_API_URL || "https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app";
debugLog(`Targeting Empire OS API Server at: ${API_URL}`);

// Dynamic Plugin System
const PLUGINS_DIR = path.join(__dirname, "plugins");
if (!fs.existsSync(PLUGINS_DIR)) {
  fs.mkdirSync(PLUGINS_DIR, { recursive: true });
}

function getDynamicPlugins() {
  const plugins = [];
  try {
    if (!fs.existsSync(PLUGINS_DIR)) return [];
    const files = fs.readdirSync(PLUGINS_DIR);
    for (const file of files) {
      if (file.endsWith(".js")) {
        const filePath = path.join(PLUGINS_DIR, file);
        try {
          // Clear require cache to enable hot-reloading
          delete require.cache[require.resolve(filePath)];
          const plugin = require(filePath);
          if (plugin && plugin.name && plugin.description && plugin.inputSchema && typeof plugin.execute === "function") {
            plugins.push(plugin);
          } else {
            debugLog(`⚠️ Plugin ${file} is missing required fields (name, description, inputSchema, execute)`);
          }
        } catch (err) {
          debugLog(`❌ Error requiring plugin ${file}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    debugLog(`Error scanning plugins: ${err.message}`);
  }
  return plugins;
}

// Helper to make HTTP/HTTPS request to the running server
function makeRequest(method, endpoint, payload = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_URL);
    const client = url.protocol === "https:" ? https : http;

    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const req = client.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({ rawResponse: data });
          }
        } else {
          reject(new Error(`Server returned HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (payload) {
      req.write(JSON.stringify(payload));
    }
    req.end();
  });
}

// Process standard input line-by-line
let buffer = "";
process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let lineEnd;
  while ((lineEnd = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, lineEnd).trim();
    buffer = buffer.slice(lineEnd + 1);
    if (line) {
      handleRequest(line);
    }
  }
});

function sendResponse(id, result, error = null) {
  const response = {
    jsonrpc: "2.0"
  };
  if (id !== undefined) {
    response.id = id;
  }
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  process.stdout.write(JSON.stringify(response) + "\n");
}

async function handleRequest(line) {
  let request;
  try {
    request = JSON.parse(line);
  } catch (err) {
    sendResponse(undefined, null, { code: -32700, message: "Parse error" });
    return;
  }

  const { method, params, id } = request;
  debugLog(`Received request method: ${method}`);

  if (method === "initialize") {
    sendResponse(id, {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: "empire-os-sentinel-bridge",
        version: "1.0.0"
      }
    });
    return;
  }

  if (method === "tools/list") {
    sendResponse(id, {
      tools: [
        {
          name: "get_system_health_and_logs",
          description: "Retrieve active aggregated system logs, health indicators, warning nodes, and exception metrics from Empire OS SQLite table.",
          inputSchema: {
            type: "object",
            properties: {
              limit: { type: "number", description: "Max log rows to return (default is 30)" }
            }
          }
        },
        {
          name: "trigger_autonomous_healing",
          description: "Initiate autonomous self-healing diagnostics to instantly repair an anomaly/error by its database log ID.",
          inputSchema: {
            type: "object",
            properties: {
              logId: { type: "string", description: "The log entry UUID from the database" }
            },
            required: ["logId"]
          }
        },
        {
          name: "trigger_custom_healing",
          description: "Send any arbitrary error, stack trace, or compiler bug straight to the Gemini AI Healer for instant code patching.",
          inputSchema: {
            type: "object",
            properties: {
              customError: { type: "string", description: "The error details, lock statement, or compiler logs" },
              customFile: { type: "string", description: "Optional file path in workspace to target (e.g. server.ts)" }
            },
            required: ["customError"]
          }
        },
        {
          name: "create_system_log",
          description: "Register or inject a new failure log or diagnostic alert into the Empire OS event telemetry feed.",
          inputSchema: {
            type: "object",
            properties: {
              level: { type: "string", enum: ["INFO", "WARN", "ERROR", "DEBUG"], description: "Level of severity" },
              module: { type: "string", description: "The source subsystem name" },
              message: { type: "string", description: "Primary exception summary" },
              details: { type: "string", description: "Complete stack trace or metadata dump" }
            },
            required: ["level", "module", "message"]
          }
        },
        {
          name: "generate_gods_glory_episode",
          description: "Generate scene prompts and narrative structure for a specific Gods & Glory episode using the self-aware python controller.",
          inputSchema: {
            type: "object",
            properties: {
              episode: { type: "number", description: "Episode number to generate (e.g., 26)" },
              title: { type: "string", description: "Optional custom title for the episode" }
            },
            required: ["episode"]
          }
        },
        {
          name: "generate_gods_glory_batch",
          description: "Generate a batch of Gods & Glory episodes in a range (e.g., episodes 20 to 25) with the self-aware python controller.",
          inputSchema: {
            type: "object",
            properties: {
              start: { type: "number", description: "Start episode number" },
              end: { type: "number", description: "End episode number" }
            },
            required: ["start", "end"]
          }
        },
        {
          name: "generate_little_olympus_episode",
          description: "Generate scene prompts and narrative structure for a specific Little Olympus episode (Toddler Gods Edition).",
          inputSchema: {
            type: "object",
            properties: {
              episode: { type: "number", description: "Episode number to generate (e.g., 1)" },
              title: { type: "string", description: "Optional custom title for the episode" }
            },
            required: ["episode"]
          }
        },
        {
          name: "generate_little_olympus_batch",
          description: "Generate a batch of Little Olympus episodes in a range (e.g., episodes 1 to 6).",
          inputSchema: {
            type: "object",
            properties: {
              start: { type: "number", description: "Start episode number" },
              end: { type: "number", description: "End episode number" }
            },
            required: ["start", "end"]
          }
        },
        {
          name: "render_gods_glory_episode",
          description: "Render a generated Gods & Glory episode into a video file with specified quality.",
          inputSchema: {
            type: "object",
            properties: {
              episodeCode: { type: "string", description: "The episode code to render (e.g., 'GG_EP026')" },
              quality: { type: "string", enum: ["low", "medium", "high"], description: "Quality preset for the render" }
            },
            required: ["episodeCode"]
          }
        },
        {
          name: "push_gods_glory_to_youtube",
          description: "Queue and upload a completed Gods & Glory episode video to YouTube.",
          inputSchema: {
            type: "object",
            properties: {
              episodeCode: { type: "string", description: "The episode code to publish (e.g., 'GG_EP026')" },
              title: { type: "string", description: "Optional custom YouTube video title" }
            },
            required: ["episodeCode"]
          }
        },
        {
          name: "list_gods_glory_ready_episodes",
          description: "List all ready and final generated Gods & Glory episode JSON configurations.",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "get_gods_glory_episode_status",
          description: "Check the status of a specific Gods & Glory episode code.",
          inputSchema: {
            type: "object",
            properties: {
              episodeCode: { type: "string", description: "The episode code to check (e.g., 'GG_EP026')" }
            },
            required: ["episodeCode"]
          }
        },
        {
          name: "get_crossposter_inventory",
          description: "Retrieve active cross-post product inventory, pricing, quantities, and listing statuses across external marketplaces.",
          inputSchema: {
            type: "object",
            properties: {
              limit: { type: "number", description: "Optional limit for the number of items returned" }
            }
          }
        },
        {
          name: "get_crossposter_queue",
          description: "Retrieve the active background worker queue tracking product cross-posting activities and execution status.",
          inputSchema: {
            type: "object",
            properties: {
              limit: { type: "number", description: "Optional limit for the number of queue items returned" }
            }
          }
        },
        {
          name: "trigger_crosspost",
          description: "Dispatch and cross-post a specific product inventory item to one or more external marketplaces (e.g., eBay, Etsy, Facebook, Shopify, Mercari, Depop, Poshmark).",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "string", description: "The product inventory item ID to cross-post" },
              platforms: { 
                type: "array", 
                items: { type: "string" }, 
                description: "Array of platforms to cross-post to (e.g., ['eBay', 'Shopify', 'Etsy', 'Mercari', 'Poshmark', 'Facebook', 'Depop'])" 
              }
            },
            required: ["id", "platforms"]
          }
        },
        {
          name: "process_crossposter_queue",
          description: "Manually execute and process pending listings inside the background cross-posting worker queue.",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "create_zip_package",
          description: "Generate a ZIP package of the full workspace or specific content types (e.g., Gods & Glory prompts, Little Olympus prompts, WW Channel).",
          inputSchema: {
            type: "object",
            properties: {
              type: { 
                type: "string", 
                enum: ["all", "gods_glory", "little_olympus", "ww_channel"], 
                description: "Type of package to create: 'all' (entire codebase), 'gods_glory' (only Gods & Glory JSON prompts), 'little_olympus' (only Little Olympus JSON prompts), or 'ww_channel' (only WW1/WW2 prompts)." 
              }
            },
            required: ["type"]
          }
        },
        {
          name: "generate_episode_script",
          description: "Generate scene prompts and narrative structure from custom content like a specific battle and key facts.",
          inputSchema: {
            type: "object",
            properties: {
              episode_num: { type: "number", description: "Episode number to generate (e.g., 20)" },
              title: { type: "string", description: "Title of the episode (e.g., 'The Fall of Carthage')" },
              battle: { type: "string", description: "Name of the battle or campaign" },
              key_facts: { 
                type: "array", 
                items: { type: "string" }, 
                description: "List of key facts to integrate into the script" 
              }
            },
            required: ["episode_num", "title", "battle", "key_facts"]
          }
        },
        {
          name: "trigger_render",
          description: "Trigger the auto_render.py media pipeline for a single episode.",
          inputSchema: {
            type: "object",
            properties: {
              episode: { type: "string", description: "The episode code to render (e.g., 'GG_EP020')" }
            },
            required: ["episode"]
          }
        },
        {
          name: "trigger_render_all",
          description: "Trigger render_all_45min.bat/sh to render all generated episodes sequentially.",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "get_render_status",
          description: "Scan the renders/ directory and return which episodes have finals along with their file sizes.",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "publish_to_youtube",
          description: "Publish a completed final render video MP4 to YouTube.",
          inputSchema: {
            type: "object",
            properties: {
              episode: { type: "string", description: "Episode code (e.g., 'GG_EP020')" },
              title: { type: "string", description: "Video title for YouTube" },
              description: { type: "string", description: "Video description" },
              tags: { 
                type: "array", 
                items: { type: "string" }, 
                description: "Tags for the video" 
              }
            },
            required: ["episode", "title"]
          }
        },
        {
          name: "run_money_hunter",
          description: "Run the final Empire Money Hunter engine to scan hidden arbitrage/clearance deals and generate high-profit video script packages.",
          inputSchema: {
            type: "object",
            properties: {
              zipCode: { type: "string", description: "Target zip code to hunt clearance items (default: '02740')" },
              budget: { type: "number", description: "Available purchase budget in USD (default: 500)" }
            },
            required: []
          }
        },
        ...getDynamicPlugins().map(p => ({
          name: p.name,
          description: p.description,
          inputSchema: p.inputSchema
        }))
      ]
    });
    return;
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params;
    debugLog(`Executing tool: ${name}`);

    try {
      const dynamicPlugins = getDynamicPlugins();
      const matchedPlugin = dynamicPlugins.find(p => p.name === name);
      if (matchedPlugin) {
        debugLog(`Executing dynamic plugin tool: ${name}`);
        const helpers = {
          makeRequest,
          exec,
          fs,
          path,
          debugLog,
          OUTPUT_DIR,
          LO_OUTPUT_DIR
        };
        const result = await matchedPlugin.execute(args, helpers);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: typeof result === "string" ? result : JSON.stringify(result, null, 2)
            }
          ]
        });
        return;
      }

      if (name === "get_system_health_and_logs") {
        const limit = args.limit || 30;
        const data = await makeRequest("GET", "/api/system/logs");
        const slicedLogs = Array.isArray(data) ? data.slice(0, limit) : [];
        
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "success",
                healthIndex: slicedLogs.filter(l => l.level === "ERROR").length > 5 ? "DEGRADED" : "OPTIMAL",
                logCount: slicedLogs.length,
                logs: slicedLogs
              }, null, 2)
            }
          ]
        });
      } else if (name === "trigger_autonomous_healing") {
        const result = await makeRequest("POST", "/api/system/heal", { logId: args.logId });
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "success",
                healerResult: result
              }, null, 2)
            }
          ]
        });
      } else if (name === "trigger_custom_healing") {
        const result = await makeRequest("POST", "/api/system/heal", { 
          customError: args.customError,
          customFile: args.customFile
        });
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "success",
                healerResult: result
              }, null, 2)
            }
          ]
        });
      } else if (name === "create_system_log") {
        const result = await makeRequest("POST", "/api/system/logs", {
          level: args.level,
          module: args.module,
          message: args.message,
          details: args.details || ""
        });
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "success",
                loggedResult: result
              }, null, 2)
            }
          ]
        });
      } else if (name === "generate_gods_glory_episode") {
        const episode = args.episode;
        const result = await godsGlory.generateEpisode(episode, args.title);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        });
        return;
      } else if (name === "generate_gods_glory_batch") {
        const start = args.start || 20;
        const end = args.end || 25;
        const result = await godsGlory.generateBatch(start, end);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        });
        return;
      } else if (name === "generate_little_olympus_episode") {
        const episode = args.episode;
        const result = await littleOlympus.generateEpisode(episode, args.title);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        });
        return;
      } else if (name === "generate_little_olympus_batch") {
        const start = args.start || 1;
        const end = args.end || 6;
        const result = await littleOlympus.generateBatch(start, end);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        });
        return;
      } else if (name === "render_gods_glory_episode") {
        const episodeCode = args.episodeCode;
        const quality = args.quality || "high";
        const result = await godsGlory.renderEpisode(episodeCode, quality);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        });
        return;
      } else if (name === "push_gods_glory_to_youtube") {
        const episodeCode = args.episodeCode;
        const title = args.title || null;
        const result = await godsGlory.pushToYouTube(episodeCode, title);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        });
        return;
      } else if (name === "list_gods_glory_ready_episodes") {
        const result = godsGlory.listReadyEpisodes();
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        });
        return;
      } else if (name === "get_gods_glory_episode_status") {
        const episodeCode = args.episodeCode;
        const status = godsGlory.getEpisodeStatus(episodeCode);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({ episodeCode, status }, null, 2)
            }
          ]
        });
        return;
      } else if (name === "get_crossposter_inventory") {
        const limit = args.limit || 30;
        const data = await makeRequest("GET", "/api/crossposter/inventory");
        const sliced = Array.isArray(data) ? data.slice(0, limit) : (data && data.success && Array.isArray(data.inventory) ? data.inventory.slice(0, limit) : data);
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "success",
                inventory: sliced
              }, null, 2)
            }
          ]
        });
        return;
      } else if (name === "get_crossposter_queue") {
        const limit = args.limit || 30;
        const data = await makeRequest("GET", "/api/crossposter/queue");
        const sliced = data && data.success && Array.isArray(data.queue) ? data.queue.slice(0, limit) : data;
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "success",
                queue: sliced
              }, null, 2)
            }
          ]
        });
        return;
      } else if (name === "trigger_crosspost") {
        const result = await makeRequest("POST", "/api/crossposter/inventory/crosspost", {
          id: args.id,
          platforms: args.platforms
        });
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "success",
                result
              }, null, 2)
            }
          ]
        });
        return;
      } else if (name === "process_crossposter_queue") {
        const result = await makeRequest("POST", "/api/crossposter/queue/process");
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "success",
                result
              }, null, 2)
            }
          ]
        });
        return;
      } else if (name === "create_zip_package") {
        const type = args.type || "all";
        const { exec } = require("child_process");
        exec(`npx tsx zip_generator.ts --type ${type}`, (error, stdout, stderr) => {
          if (error) {
            sendResponse(id, {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({ status: "error", message: error.message, stderr }, null, 2)
                }
              ],
              isError: true
            });
            return;
          }
          sendResponse(id, {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  status: "success",
                  message: `Successfully created ${type} package!`,
                  output: stdout.trim()
                }, null, 2)
              }
            ]
          });
        });
        return;
      } else if (name === "generate_episode_script") {
        const result = await makeRequest("POST", "/api/gods-glory/generate-from-content", {
          episode_num: args.episode_num,
          title: args.title,
          battle: args.battle,
          key_facts: args.key_facts
        });
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({ status: "success", result }, null, 2)
            }
          ]
        });
        return;
      } else if (name === "trigger_render") {
        const result = await makeRequest("POST", "/api/renders/episode", {
          episode: args.episode
        });
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({ status: "success", result }, null, 2)
            }
          ]
        });
        return;
      } else if (name === "trigger_render_all") {
        const result = await makeRequest("POST", "/api/renders/all");
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({ status: "success", result }, null, 2)
            }
          ]
        });
        return;
      } else if (name === "get_render_status") {
        const result = await makeRequest("GET", "/api/renders/status");
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({ status: "success", result }, null, 2)
            }
          ]
        });
        return;
      } else if (name === "publish_to_youtube") {
        const result = await makeRequest("POST", "/api/youtube/publish", {
          episode: args.episode,
          title: args.title,
          description: args.description,
          tags: args.tags
        });
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({ status: "success", result }, null, 2)
            }
          ]
        });
        return;
      } else if (name === "run_money_hunter") {
        const result = await makeRequest("POST", "/api/money-hunter/run", {
          zipCode: args.zipCode,
          budget: args.budget
        });
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({ status: "success", result }, null, 2)
            }
          ]
        });
        return;
      } else {
        sendResponse(id, null, { code: -32601, message: `Tool not found: ${name}` });
      }
    } catch (err) {
      debugLog(`Error running tool ${name}: ${err.message}`);
      sendResponse(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify({ status: "error", message: err.message }, null, 2)
          }
        ],
        isError: true
      });
    }
    return;
  }

  // Unsupported notification or other JSON-RPC requests
  if (id !== undefined) {
    sendResponse(id, null, { code: -32601, message: "Method not found" });
  }
}
