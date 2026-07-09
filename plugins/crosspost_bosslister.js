// plugins/crosspost_bosslister.js
// Dynamic Claude Desktop Plugin for BossLister & CrossPost OS Engine

module.exports = {
  name: "crosspost_bosslister",
  description: "Cross-post inventory, manage multi-channel listings, trigger repricing, check queue status, analyze sales reports, and monitor Boss Shield(TM) on the fly.",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["get_inventory", "crosspost_item", "get_analytics", "run_repricing_engine", "check_queue_status", "add_product"],
        description: "The specific action to perform in the CrossPost / BossLister engine."
      },
      itemId: {
        type: "string",
        description: "The product ID to target (required for 'crosspost_item')."
      },
      platforms: {
        type: "array",
        items: { type: "string" },
        description: "Array of platforms to post to (e.g. ['ebay', 'shopify', 'tiktok', 'etsy', 'mercari', 'poshmark', 'depop', 'fb']). Required for 'crosspost_item'."
      },
      productData: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the product" },
          sku: { type: "string", description: "Unique stock keeping unit (SKU)" },
          price: { type: "number", description: "Retail price in USD" },
          cost: { type: "number", description: "Item cost in USD" },
          quantity: { type: "number", description: "Available stock quantity" },
          description: { type: "string", description: "Standard description" },
          category: { type: "string", description: "E.g., Apparel, Electronics, Collectibles" },
          condition: { type: "string", description: "E.g., New, Like New, Used" },
          keywords: { type: "string", description: "Comma-separated search keywords" }
        },
        required: ["title", "sku", "price"],
        description: "Product details for registering a new inventory item (required for 'add_product')."
      }
    },
    required: ["action"]
  },

  async execute(args, helpers) {
    const { action, itemId, platforms, productData } = args;
    const { makeRequest, debugLog } = helpers;

    debugLog(`[CrosspostBossLister] Initiating action: ${action}`);

    try {
      switch (action) {
        case "get_inventory": {
          debugLog("Fetching active master inventory listings.");
          const res = await makeRequest("GET", "/api/crossposter/inventory");
          if (!res.success) throw new Error(res.error || "Failed to retrieve inventory");
          return {
            status: "success",
            count: res.inventory ? res.inventory.length : 0,
            inventory: res.inventory || []
          };
        }

        case "crosspost_item": {
          if (!itemId) throw new Error("Missing 'itemId' for crosspost_item action.");
          const targetPlatforms = platforms || ["ebay", "shopify", "tiktok", "etsy", "mercari", "poshmark", "depop"];
          debugLog(`Triggering multi-channel cross-post for Item ID: ${itemId} to platforms: ${targetPlatforms.join(", ")}`);
          
          const res = await makeRequest("POST", "/api/crossposter/inventory/crosspost", {
            id: itemId,
            platforms: targetPlatforms
          });

          if (!res.success) throw new Error(res.error || "Failed to cross-post item");
          return {
            status: "success",
            message: `Cross-post event dispatched successfully for Item ID: ${itemId}. Items are queued for publication!`,
            details: res.result || res
          };
        }

        case "get_analytics": {
          debugLog("Requesting rich sales and channels profitability reports.");
          const res = await makeRequest("GET", "/api/crossposter/analytics");
          if (!res.success) throw new Error(res.error || "Failed to retrieve analytics");
          return {
            status: "success",
            analytics: res.analytics || {}
          };
        }

        case "run_repricing_engine": {
          debugLog("Triggering smart AI repricing routine.");
          const res = await makeRequest("POST", "/api/crossposter/assistant", {
            message: "update all prices to maximize profit margins and trigger reprice"
          });
          if (!res.success) throw new Error(res.error || "Repricing execution failed");
          return {
            status: "success",
            message: res.message,
            logs: res.logs || []
          };
        }

        case "check_queue_status": {
          debugLog("Fetching background cross-posting worker queues.");
          const queueRes = await makeRequest("GET", "/api/crossposter/queue");
          if (!queueRes.success) throw new Error(queueRes.error || "Failed to retrieve listing queue");
          
          // Automatically trigger queue processor run to flush pending postings
          debugLog("Triggering queue worker to process pending listings");
          const processRes = await makeRequest("POST", "/api/crossposter/queue/process");

          return {
            status: "success",
            queueCount: queueRes.queue ? queueRes.queue.length : 0,
            queue: queueRes.queue || [],
            workerOutput: processRes.success ? processRes.message : "Background worker stands ready."
          };
        }

        case "add_product": {
          if (!productData) throw new Error("Missing 'productData' to register a new product.");
          debugLog(`Registering new product: SKU ${productData.sku} - "${productData.title}"`);
          
          const res = await makeRequest("POST", "/api/crossposter/inventory", {
            title: productData.title,
            sku: productData.sku,
            price: Number(productData.price),
            cost: Number(productData.cost || 0),
            quantity: Number(productData.quantity || 1),
            description: productData.description || "Premium registered inventory.",
            category: productData.category || "General Merchandise",
            condition: productData.condition || "New",
            images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"],
            keywords: productData.keywords || "",
            status: "Draft"
          });

          if (!res.success) throw new Error(res.error || "Failed to save product to database");
          return {
            status: "success",
            message: `Successfully registered SKU ${productData.sku} in Master Inventory as a Draft.`,
            product: res.product || res
          };
        }

        default:
          throw new Error(`Unsupported action: ${action}`);
      }
    } catch (err) {
      debugLog(`[CrosspostBossLister ERROR] ${err.message}`);
      return {
        status: "error",
        error: err.message
      };
    }
  }
};
