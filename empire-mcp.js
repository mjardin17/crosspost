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

// Set up logging to stderr (since stdout is reserved for JSON-RPC)
const debugLog = (...args) => {
  console.error("[Empire-MCP-Bridge]", ...args);
};

// Parse environment variables
const API_URL = process.env.EMPIRE_API_URL || "https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app";
debugLog(`Targeting Empire OS API Server at: ${API_URL}`);

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
        }
      ]
    });
    return;
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params;
    debugLog(`Executing tool: ${name}`);

    try {
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
