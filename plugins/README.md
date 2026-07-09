# Claude Dynamic Plugin System (MCP Plugins)

Welcome to the **Empire OS Dynamic Plugin System**! This directory allows you (and Claude Desktop) to add, update, or remove custom tools on the fly without changing or rebuilding the main MCP bridge codebase (`empire-mcp.js`).

---

## 🚀 How It Works
1. Any `.js` file placed in the `/plugins` directory is automatically scanned by the MCP server at startup and during request processing.
2. The require cache is **automatically deleted/invalidated** before scanning, enabling **hot-reloading**. Any edits or new plugins are active **instantly** without needing to restart the Claude Desktop client or the MCP bridge!
3. If the plugin defines a valid schema and an `execute` function, it is registered as an active Claude tool.

---

## 📝 Plugin Specification
A valid plugin is a Node.js module (CommonJS format) that exports an object matching this structure:

```javascript
module.exports = {
  // 1. Tool Name (must be alphanumeric, underscores only, no spaces or special chars)
  name: "my_custom_plugin",

  // 2. Clear, high-quality description explaining when Claude should use this tool
  description: "A tool that does something useful for Empire OS",

  // 3. Input Schema (standard JSON schema definition)
  inputSchema: {
    type: "object",
    properties: {
      inputParam: { 
        type: "string", 
        description: "An example input parameter description" 
      }
    },
    required: ["inputParam"]
  },

  // 4. Execution Logic (must return a string or an object/JSON serializable payload)
  async execute(args, helpers) {
    const { inputParam } = args;
    const { makeRequest, exec, fs, path, debugLog } = helpers;

    debugLog(`Running my_custom_plugin with input: ${inputParam}`);

    // You can call any Express endpoint via makeRequest:
    // const res = await makeRequest("GET", "/api/system/logs");

    return {
      status: "success",
      message: `Successfully executed custom plugin with input: ${inputParam}`
    };
  }
};
```

---

## 🛠️ Helpers Provided to `execute()`
Each plugin's `execute` function is called with `(args, helpers)`. The `helpers` object contains:
* `makeRequest(method, endpoint, payload)`: Hits the active Empire OS Express backend on port `3000`.
* `exec(command, callback)`: Launches external sub-processes (from Node's `child_process`).
* `fs`: Node's filesystem module.
* `path`: Node's path utility module.
* `debugLog(...args)`: Writes debug logs directly to Claude Desktop's standard error console (`stderr`).
* `OUTPUT_DIR`: Absolute path to Gods & Glory assets.
* `LO_OUTPUT_DIR`: Absolute path to Little Olympus assets.

---

## 🤖 Dynamic Plugin Generation for Claude
Claude is fully empowered to create its own tools!
* **Step 1**: Use the file writer tool to create a new file like `/plugins/my_new_tool.js`.
* **Step 2**: Claude can immediately use `my_new_tool` in the next prompt! 

Let's expand the Empire!
