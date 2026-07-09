module.exports = {
  name: "workspace_analyzer",
  description: "Scan the workspace filesystem, analyze file sizes, count files by extension, find the largest files, and check project structural health.",
  inputSchema: {
    type: "object",
    properties: {
      maxDepth: { type: "number", description: "Maximum depth to scan (default is 3)" },
      excludeDirs: { type: "array", items: { type: "string" }, description: "Directories to exclude from search (e.g. ['node_modules', '.git'])" }
    }
  },
  async execute(args, helpers) {
    const { fs, path, debugLog } = helpers;
    const maxDepth = args.maxDepth || 3;
    const exclusions = args.excludeDirs || ["node_modules", ".git", "dist", ".next", "renders"];

    const rootDir = process.cwd();
    const stats = {
      totalFiles: 0,
      totalSize_mb: 0,
      byExtension: {},
      largestFiles: []
    };

    function scan(dir, depth = 0) {
      if (depth > maxDepth) return;
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (exclusions.includes(file)) continue;
          const fullPath = path.join(dir, file);
          let stat;
          try {
            stat = fs.statSync(fullPath);
          } catch (e) {
            continue; // Skip inaccessible files/links
          }

          if (stat.isDirectory()) {
            scan(fullPath, depth + 1);
          } else {
            stats.totalFiles++;
            const sizeMb = stat.size / (1024 * 1024);
            stats.totalSize_mb += sizeMb;

            const ext = path.extname(file).toLowerCase() || "no-ext";
            stats.byExtension[ext] = (stats.byExtension[ext] || 0) + 1;

            stats.largestFiles.push({
              relPath: path.relative(rootDir, fullPath),
              size_mb: Math.round(sizeMb * 100) / 100
            });
          }
        }
      } catch (err) {
        debugLog(`Error scanning directory ${dir}: ${err.message}`);
      }
    }

    scan(rootDir);

    // Sort and limit largest files to top 10
    stats.largestFiles.sort((a, b) => b.size_mb - a.size_mb);
    stats.largestFiles = stats.largestFiles.slice(0, 10);
    stats.totalSize_mb = Math.round(stats.totalSize_mb * 100) / 100;

    return {
      status: "success",
      analysis: {
        workspace_root: rootDir,
        scan_depth: maxDepth,
        metrics: stats
      }
    };
  }
};
