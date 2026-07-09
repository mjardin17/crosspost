# 🤖 Claude Desktop Configuration & Directives

Copy and paste the configuration below into your Claude Desktop configuration file to connect this MCP Server with **Dynamic Hot-Reloading Plugins**.

---

## 🛠️ Claude Desktop Setup

### Configuration Path:
* **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### 📋 JSON Configuration to Copy:
```json
{
  "mcpServers": {
    "empire-os-sentinel": {
      "command": "node",
      "args": [
        "/absolute/path/to/your/workspace/empire-mcp.js"
      ],
      "env": {
        "EMPIRE_API_URL": "https://ais-dev-7vc3anh5ikstpsjhmaywr7-767455093414.us-east1.run.app"
      }
    }
  }
}
```
*(Replace `/absolute/path/to/your/workspace/` with the actual path of your project directory).*

---

## 💬 Copy-Paste Prompt for Claude Desktop
*To save tokens, logic credits, and get Claude operating at peak speed instantly, copy-paste the exact message below into your Claude Desktop chat as soon as you connect:*

```markdown
Hello Claude! You are connected to the Empire OS Sentinel MCP Server, which includes a **Sovereign AI Hot-Reloading Dynamic Plugin System**.

### 🌟 Your Capabilities & Privileges
1. **Dynamic Tool Execution**: You have custom tools available right now (e.g., `system_diagnostic`, `workspace_analyzer`, `run_money_hunter`, etc.).
2. **On-The-Fly Tool Creation**: You can write your own custom tools! Simply write a standard Node.js/CommonJS plugin file and save it in the `/plugins` directory. The MCP server will **instantly hot-reload it** and make it available as a tool in your next turn without restarting!

### 📝 Plugin Specification
To create a new tool, write a file in `/plugins/your_tool_name.js` following this structure:

```javascript
module.exports = {
  name: "your_tool_name",
  description: "High quality description detailing exactly when you should invoke this tool.",
  inputSchema: {
    type: "object",
    properties: {
      someParam: { type: "string", description: "Parameter details" }
    },
    required: ["someParam"]
  },
  async execute(args, helpers) {
    const { someParam } = args;
    const { makeRequest, exec, fs, path, debugLog } = helpers;

    // Use makeRequest to call any Empire OS REST API on Port 3000
    // Use exec to run shell scripts
    // Use fs/path for file operations
    
    return {
      status: "success",
      message: `Executed successfully with: ${someParam}`
    };
  }
};
```

### 🎯 Your First Task
Run the `system_diagnostic` tool right now to confirm the bridge is healthy, and let me know which plugins are loaded!
```

---

## 🚀 Existing Built-in Plugins
1. `crosspost_bosslister`: Directly cross-posts items to eBay, Shopify, TikTok Shop, Etsy, Mercari, Depop, etc., manages queues, triggers smart repricing, and monitors analytics.
2. `system_diagnostic`: Analyzes host CPU/Memory, OS properties, and list of plugins.
3. `workspace_analyzer`: Scans folders, file distribution, size heatmaps, and workspace structural health.
4. `run_money_hunter`: Runs the clearance search and script writer engine.
