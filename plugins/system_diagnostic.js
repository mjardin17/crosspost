const os = require("os");

module.exports = {
  name: "system_diagnostic",
  description: "Retrieve comprehensive host system diagnostics including OS details, memory usage, CPU profiles, directory lists, and active Claude plugins.",
  inputSchema: {
    type: "object",
    properties: {
      includeNetwork: { type: "boolean", description: "Whether to list active network interfaces" }
    }
  },
  async execute(args, helpers) {
    const { includeNetwork } = args;
    const { fs, path } = helpers;

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // List plugins
    let activePlugins = [];
    try {
      const pluginsDir = path.join(process.cwd(), "plugins");
      if (fs.existsSync(pluginsDir)) {
        activePlugins = fs.readdirSync(pluginsDir).filter(f => f.endsWith(".js"));
      }
    } catch (err) {
      activePlugins = [`Error listing plugins: ${err.message}`];
    }

    const diag = {
      timestamp: new Date().toISOString(),
      os: {
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
        arch: os.arch(),
        uptime_hours: Math.round((os.uptime() / 3600) * 100) / 100
      },
      hardware: {
        cpus: os.cpus().map(c => ({ model: c.model, speed: c.speed })),
        cpuCount: os.cpus().length,
        memory: {
          total_gb: Math.round((totalMem / (1024 ** 3)) * 100) / 100,
          used_gb: Math.round((usedMem / (1024 ** 3)) * 100) / 100,
          free_gb: Math.round((freeMem / (1024 ** 3)) * 100) / 100,
          utilization_percent: Math.round((usedMem / totalMem) * 10000) / 100
        }
      },
      plugins: {
        pluginsDir: path.join(process.cwd(), "plugins"),
        count: activePlugins.length,
        loaded_plugin_files: activePlugins
      }
    };

    if (includeNetwork) {
      diag.network = os.networkInterfaces();
    }

    return {
      status: "success",
      diagnostics: diag
    };
  }
};
