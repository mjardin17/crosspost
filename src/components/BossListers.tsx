import React, { useState, useEffect } from "react";
import {
  Sparkles, Award, Star, ListChecks, DollarSign, RefreshCw, Send, ShieldCheck, Tag, Play, Settings,
  Brain, Plus, Trash2, AlertCircle, Eye, CheckCircle, Clock, Activity, ListOrdered, Shield, Layers,
  ChevronRight, UploadCloud, Edit3, X, Filter, ShoppingBag, Boxes, Layers3, Check, TrendingUp, HelpCircle,
  Cpu, Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";

// Interfaces matching backend tables
interface InventoryItem {
  id: string;
  title: string;
  description: string;
  price: number;
  cost?: number;
  quantity: number;
  sku: string;
  images: string; // JSON string
  category: string;
  condition: string;
  status: string;
  views: number;
  sales: number;
  ebay_status: string;
  fb_status: string;
  etsy_status: string;
  mercari_status: string;
  poshmark_status: string;
  depop_status: string;
  shopify_status: string;
  keywords?: string;
  ebay_id?: string;
  fb_id?: string;
  etsy_id?: string;
  mercari_id?: string;
  poshmark_id?: string;
  depop_id?: string;
  shopify_id?: string;
  created_at: string;
  updated_at: string;
}

interface MarketplaceConnection {
  platform: string;
  api_key: string;
  username: string;
  status: string;
  updated_at?: string;
}

interface QueueItem {
  id: string;
  action: string;
  itemId: string;
  platform: string;
  status: string;
  attempts: number;
  error_message: string;
  timestamp: string;
}

interface RegisteredAgent {
  id: string;
  name: string;
  status: string;
  capabilities: string; // JSON string
  system_instructions: string;
  last_active: string;
}

export default function BossListers() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"inventory" | "connections" | "queue" | "analytics" | "copilot">("inventory");

  // State Lists
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [agents, setAgents] = useState<RegisteredAgent[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [connections, setConnections] = useState<MarketplaceConnection[]>([]);

  // Loading and Filtering
  const [loading, setLoading] = useState<boolean>(false);
  const [queueProcessing, setQueueProcessing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Selection & Modals
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importPreview, setImportPreview] = useState<any[]>([]);

  // Form Fields for Add/Edit
  const [formTitle, setFormTitle] = useState<string>("");
  const [formSku, setFormSku] = useState<string>("");
  const [formPrice, setFormPrice] = useState<number>(19.99);
  const [formCost, setFormCost] = useState<number>(5.00);
  const [formQty, setFormQty] = useState<number>(5);
  const [formDesc, setFormDesc] = useState<string>("");
  const [formDescEbay, setFormDescEbay] = useState<string>("");
  const [formDescShopify, setFormDescShopify] = useState<string>("");
  const [formDescEtsy, setFormDescEtsy] = useState<string>("");
  const [formDescSocial, setFormDescSocial] = useState<string>("");
  const [activeDescTab, setActiveDescTab] = useState<"standard" | "ebay" | "shopify" | "etsy" | "social">("standard");
  const [formCategory, setFormCategory] = useState<string>("Electronics");
  const [formCondition, setFormCondition] = useState<string>("New");
  const [formImages, setFormImages] = useState<string[]>(["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"]);
  const [formKeywords, setFormKeywords] = useState<string>("");
  const [formEbayId, setFormEbayId] = useState<string>("");
  const [formFbId, setFormFbId] = useState<string>("");
  const [formEtsyId, setFormEtsyId] = useState<string>("");
  const [formMercariId, setFormMercariId] = useState<string>("");
  const [formPoshmarkId, setFormPoshmarkId] = useState<string>("");
  const [formDepopId, setFormDepopId] = useState<string>("");
  const [formShopifyId, setFormShopifyId] = useState<string>("");

  // AI & Cross-posting options
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [customOptimizeInstruction, setCustomOptimizeInstruction] = useState<string>("");
  const [crosspostPlatforms, setCrosspostPlatforms] = useState<string[]>(["ebay", "shopify"]);

  // Worker terminal logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "System: CrossPoster Multi-Channel worker initialized.",
    "System: Standing by for listing or synchronization events..."
  ]);

  // Bulk parameters
  const [bulkPriceAdjust, setBulkPriceAdjust] = useState<number>(5);
  const [showBulkControls, setShowBulkControls] = useState<boolean>(false);

  // Settings Toggles (Rules Engine)
  const [autoRelist, setAutoRelist] = useState<boolean>(true);
  const [autoDelist, setAutoDelist] = useState<boolean>(true);
  const [autoRepricing, setAutoRepricing] = useState<boolean>(false);

  // Copilot states
  const [copilotMessage, setCopilotMessage] = useState<string>("");
  const [isSendingCopilot, setIsSendingCopilot] = useState<boolean>(false);
  const [copilotChat, setCopilotChat] = useState<{ sender: "user" | "copilot"; text: string; timestamp: Date }[]>([
    { sender: "copilot", text: "Welcome! I am your CrossPoster AI Assistant. Ask me to: 'List everywhere', 'Update all prices', 'Relist stale inventory', 'Find slow sellers', or 'Show highest profit items'!", timestamp: new Date() }
  ]);

  // Fetch all databases from server
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [invRes, qRes, agentRes, analyticRes, connRes] = await Promise.all([
        fetch("/api/crossposter/inventory"),
        fetch("/api/crossposter/queue"),
        fetch("/api/crossposter/agents"),
        fetch("/api/crossposter/analytics"),
        fetch("/api/crossposter/connections")
      ]);

      const invData = await invRes.json();
      const qData = await qRes.json();
      const agentData = await agentRes.json();
      const analyticData = await analyticRes.json();
      const connData = await connRes.json();

      if (invData.success) setInventory(invData.inventory);
      if (qData.success) setQueue(qData.queue);
      if (agentData.success) setAgents(agentData.agents);
      if (analyticData.success) setAnalytics(analyticData.analytics);
      if (connData.success) setConnections(connData.connections);
    } catch (e) {
      console.error("Failed to sync client state with SQLite databases", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle single item view
  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormTitle(item.title);
    setFormSku(item.sku);
    setFormPrice(item.price);
    setFormCost(item.cost || 5.00);
    setFormQty(item.quantity);
    setFormDesc(item.description);
    
    // Auto populate platform-specific description variations for editing
    setFormDescEbay(item.description ? `${item.description}\n\n[eBay Reference: SKU: ${item.sku} | Fast domestic dispatch | Handled with ultimate care]` : "");
    setFormDescShopify(item.description ? `<h2>${item.title}</h2><p>${item.description}</p><p>Standard packaging. Authentic SKU reference: ${item.sku}</p>` : "");
    setFormDescEtsy(item.description ? `${item.description}\n\n🌿 Sustainable materials, studio-crafted aesthetics, gift wrapping options available.` : "");
    setFormDescSocial(item.description ? `✨ RESTOCKED ✨\n\n${item.title} is now available in our catalog for $${item.price}!\n\nDM to purchase or check the bio link! #vintage #boutique #curated` : "");
    setActiveDescTab("standard");

    setFormCategory(item.category);
    setFormCondition(item.condition);
    setFormKeywords(item.keywords || "");
    setFormEbayId(item.ebay_id || "");
    setFormFbId(item.fb_id || "");
    setFormEtsyId(item.etsy_id || "");
    setFormMercariId(item.mercari_id || "");
    setFormPoshmarkId(item.poshmark_id || "");
    setFormDepopId(item.depop_id || "");
    setFormShopifyId(item.shopify_id || "");

    try {
      setFormImages(JSON.parse(item.images));
    } catch {
      setFormImages([item.images || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"]);
    }

    // Read existing channels listed
    const activeChans: string[] = [];
    if (item.ebay_status === "Listed") activeChans.push("ebay");
    if (item.fb_status === "Listed") activeChans.push("fb");
    if (item.etsy_status === "Listed") activeChans.push("etsy");
    if (item.mercari_status === "Listed") activeChans.push("mercari");
    if (item.poshmark_status === "Listed") activeChans.push("poshmark");
    if (item.depop_status === "Listed") activeChans.push("depop");
    if (item.shopify_status === "Listed") activeChans.push("shopify");
    setCrosspostPlatforms(activeChans.length > 0 ? activeChans : ["ebay", "shopify"]);
  };

  // Create Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSku.trim()) return;

    try {
      const response = await fetch("/api/crossposter/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          sku: formSku,
          price: Number(formPrice),
          cost: Number(formCost),
          quantity: Number(formQty),
          description: formDesc,
          category: formCategory,
          condition: formCondition,
          images: formImages,
          keywords: formKeywords,
          ebay_id: formEbayId,
          fb_id: formFbId,
          etsy_id: formEtsyId,
          mercari_id: formMercariId,
          poshmark_id: formPoshmarkId,
          depop_id: formDepopId,
          shopify_id: formShopifyId,
          status: "Draft"
        })
      });

      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => [
          `[PRODUCT CREATED] SKU: ${formSku} - "${formTitle}" successfully registered in Master Inventory.`,
          ...prev
        ]);
        setIsAddingProduct(false);
        resetForm();
        loadAllData();
      } else {
        alert(data.error || "Failed to create product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Product
  const handleUpdateProduct = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch(`/api/crossposter/inventory/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          sku: formSku,
          price: Number(formPrice),
          cost: Number(formCost),
          quantity: Number(formQty),
          description: formDesc,
          category: formCategory,
          condition: formCondition,
          images: formImages,
          keywords: formKeywords,
          ebay_id: formEbayId,
          fb_id: formFbId,
          etsy_id: formEtsyId,
          mercari_id: formMercariId,
          poshmark_id: formPoshmarkId,
          depop_id: formDepopId,
          shopify_id: formShopifyId
        })
      });

      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => {
          const l = [`[PRODUCT UPDATED] Saved updates to SKU: ${formSku}.`, ...prev];
          if (data.logs && data.logs.length > 0) {
            return [...data.logs, ...l];
          }
          return l;
        });
        setSelectedItem(data.product);
        loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product from master inventory?")) return;
    try {
      const response = await fetch(`/api/crossposter/inventory/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => [`[PRODUCT DELETED] Item ${id} purged from SQLite.`, ...prev]);
        setSelectedItem(null);
        setSelectedIds(prev => prev.filter(item => item !== id));
        loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI-Optimize listings with router
  const handleAIOptimize = async () => {
    if (!selectedItem) return;
    setIsOptimizing(true);
    setTerminalLogs(prev => [`[AI OPTIMIZER] Dispatching listing optimize prompt to Empire AI Router...`, ...prev]);

    try {
      const response = await fetch("/api/crossposter/inventory/ai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedItem.id,
          customInstruction: customOptimizeInstruction
        })
      });

      const data = await response.json();
      if (data.success && data.optimized) {
        const opt = data.optimized;
        setFormTitle(opt.optimizedTitle);
        setFormDesc(opt.optimizedDescription);
        setFormPrice(opt.suggestedPrice);
        setTerminalLogs(prev => [
          `[AI OPTIMIZER] Successfully generated suggestions using ${data.metrics?.providerUsed || 'AI Router'}.`,
          `  - Suggest Title: "${opt.optimizedTitle}"`,
          `  - Suggest Price: $${opt.suggestedPrice} (${opt.pricingExplanation || 'Competitively priced'})`,
          ...prev
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Cross-post item to platforms
  const handleCrosspost = async () => {
    if (!selectedItem) return;
    setTerminalLogs(prev => [`[CROSSPOSTER] Initializing deployment matrix across requested marketplaces...`, ...prev]);

    try {
      const response = await fetch("/api/crossposter/inventory/crosspost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedItem.id,
          platforms: crosspostPlatforms
        })
      });

      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => [
          `[QUEUED] Added crossposting tasks for: ${crosspostPlatforms.join(", ").toUpperCase()}`,
          `[STATUS] Set product status to "Pending" on queued platforms. Run queue workers to publish live!`,
          ...prev
        ]);
        setSelectedItem(data.product);
        loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run background queue workers simulation
  const handleRunQueue = async () => {
    setQueueProcessing(true);
    setTerminalLogs(prev => [`[WORKER ENGINE] Starting background worker execution thread...`, ...prev]);

    try {
      const response = await fetch("/api/crossposter/queue/process", { method: "POST" });
      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => {
          const runLogs = data.logs || [];
          return [...runLogs, `[WORKER ENGINE] Thread execution complete. Processed tasks.`, ...prev];
        });
        loadAllData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQueueProcessing(false);
    }
  };

  // Retry a failed background queue job
  const handleRetryJob = async (id: string) => {
    setTerminalLogs(prev => [`[QUEUE WORKER] Preparing to retry job ${id}...`, ...prev]);
    try {
      const response = await fetch(`/api/crossposter/queue/retry/${id}`, { method: "POST" });
      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => [`[QUEUE WORKER] Reset job status to Pending successfully. Ready to run!`, ...prev]);
        loadAllData();
      } else {
        setTerminalLogs(prev => [`[QUEUE ERROR] Failed to reset job status: ${data.error}`, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setTerminalLogs(prev => [`[QUEUE ERROR] Connection failure while retrying job.`, ...prev]);
    }
  };

  // Trigger Bulk Import Modal
  const handleBulkImport = () => {
    setIsImportModalOpen(true);
  };

  // Parse CSV File (eBay, Shopify, or Manual)
  const handleFileImport = (file: File, importType: 'ebay' | 'shopify' | 'manual') => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      
      const lines = text.split(/\r?\n/);
      if (lines.length <= 1) {
        alert("CSV file seems empty or has no data lines.");
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const parsedProducts: any[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values: string[] = [];
        let currentVal = '';
        let insideQuotes = false;
        for (let charIdx = 0; charIdx < line.length; charIdx++) {
          const char = line[charIdx];
          if (char === '"' || char === "'") {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
            currentVal = '';
          } else {
            currentVal += char;
          }
        }
        values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
        
        if (values.length < headers.length) continue;
        
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        
        let title = '';
        let desc = '';
        let price = 19.99;
        let cost = 5.00;
        let quantity = 5;
        let sku = '';
        let category = 'Uncategorized';
        let condition = 'New';
        let images: string[] = [];
        
        if (importType === 'ebay') {
          title = row['Title'] || row['title'] || '';
          desc = row['Description'] || row['description'] || '';
          price = Number(row['Price'] || row['price'] || 19.99);
          quantity = Number(row['Quantity'] || row['quantity'] || 1);
          sku = row['Custom Label'] || row['SKU'] || row['sku'] || `EB-${Math.floor(1000 + Math.random() * 9000)}`;
          category = row['Category'] || row['category'] || 'eBay Listed';
          const pic = row['PicURL'] || row['PicUrl'] || row['picurl'] || '';
          if (pic) images = [pic];
        } else if (importType === 'shopify') {
          title = row['Title'] || row['title'] || '';
          desc = row['Body (HTML)'] || row['body'] || row['Description'] || '';
          price = Number(row['Variant Price'] || row['price'] || 19.99);
          quantity = Number(row['Variant Inventory Qty'] || row['quantity'] || 1);
          sku = row['Variant SKU'] || row['SKU'] || row['sku'] || `SH-${Math.floor(1000 + Math.random() * 9000)}`;
          category = row['Product Category'] || row['Type'] || 'Shopify Listed';
          const img = row['Image Src'] || row['image'] || '';
          if (img) images = [img];
        } else {
          title = row['Title'] || row['title'] || row['Name'] || '';
          desc = row['Description'] || row['description'] || '';
          price = Number(row['Price'] || row['price'] || 19.99);
          cost = Number(row['Cost'] || row['cost'] || 5.00);
          quantity = Number(row['Quantity'] || row['quantity'] || row['Qty'] || 1);
          sku = row['SKU'] || row['sku'] || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
          category = row['Category'] || row['category'] || 'General';
          condition = row['Condition'] || row['condition'] || 'New';
          const imgs = row['Images'] || row['images'] || row['Image'] || '';
          if (imgs) images = imgs.split(';').map(u => u.trim());
        }
        
        if (title) {
          parsedProducts.push({
            title,
            description: desc,
            price: isNaN(price) ? 19.99 : price,
            cost: isNaN(cost) ? 5.00 : cost,
            quantity: isNaN(quantity) ? 1 : quantity,
            sku,
            category,
            condition,
            images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"]
          });
        }
      }
      
      if (parsedProducts.length > 0) {
        setImportPreview(parsedProducts);
        setTerminalLogs(prev => [
          `[BULK IMPORTER] Parsed ${parsedProducts.length} items from ${importType.toUpperCase()} file. Review preview in dialog.`,
          ...prev
        ]);
      } else {
        alert("Could not parse any valid products. Check column headers. Make sure headers contain 'Title', 'Price', 'SKU' (or 'Variant Price', 'Variant SKU' for Shopify).");
      }
    };
    reader.readAsText(file);
  };

  // Confirm Import & Save to Database
  const handleConfirmImport = async () => {
    if (importPreview.length === 0) return;
    setLoading(true);
    try {
      const response = await fetch("/api/crossposter/inventory/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: importPreview })
      });
      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => [
          `[BULK IMPORTER] Successfully imported ${data.count} items into the Master SQLite Database!`,
          ...prev
        ]);
        setImportPreview([]);
        setIsImportModalOpen(false);
        loadAllData();
      }
    } catch (err) {
      console.error(err);
      setTerminalLogs(prev => [`[ERROR] Bulk import transaction failed: ${(err as Error).message}`, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  // Load High-Fidelity Demo Inventory
  const handleLoadDemoInventory = async () => {
    const demoProducts = [
      {
        title: "Mechanical Split Ergonomic Keyboard",
        description: "Custom mechanical split keyboard with organic split layout, RGB hot-swap sockets, and Gateron Brown switches.",
        price: 189.99,
        cost: 65.00,
        quantity: 8,
        sku: `SKU-KB-${Math.floor(1000 + Math.random() * 9000)}`,
        category: "Computer Hardware",
        condition: "New",
        images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400"]
      },
      {
        title: "Vintage Leather Jacket 1992",
        description: "Oversized genuine leather jacket from 1990s. Distressed heavy brown leather, size Large.",
        price: 124.50,
        cost: 30.00,
        quantity: 1,
        sku: `SKU-CL-${Math.floor(1000 + Math.random() * 9000)}`,
        category: "Clothing & Fashion",
        condition: "Very Good",
        images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"]
      },
      {
        title: "Handcrafted Ceramic Matcha Bowl",
        description: "Studio pottery custom matcha tea bowl. Warm earth tones, clay texture foot, glazed rim.",
        price: 36.00,
        cost: 8.00,
        quantity: 12,
        sku: `SKU-CR-${Math.floor(1000 + Math.random() * 9000)}`,
        category: "Home & Handmade",
        condition: "New",
        images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400"]
      },
      {
        title: "Retro Portable Cassette Walkman",
        description: "Classic portable cassette tape player with stereo headphones, auto-reverse functionality, mint working order.",
        price: 79.99,
        cost: 20.00,
        quantity: 3,
        sku: `SKU-WM-${Math.floor(1000 + Math.random() * 9000)}`,
        category: "Electronics",
        condition: "Refurbished",
        images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400"]
      }
    ];

    setImportPreview(demoProducts);
    setTerminalLogs(prev => [
      `[BULK IMPORTER] Loaded ${demoProducts.length} high-fidelity e-commerce demo products. Click Confirm & Save.`,
      ...prev
    ]);
  };

  // Bulk Edit
  const handleBulkPriceAdjustment = async () => {
    if (selectedIds.length === 0) return;
    try {
      const response = await fetch("/api/crossposter/inventory/bulk-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          priceAdjustment: Number(bulkPriceAdjust)
        })
      });
      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => [
          `[BULK EDITOR] Successfully adjusted price on ${data.updatedCount} items by $${bulkPriceAdjust}.`,
          ...prev
        ]);
        setSelectedIds([]);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredInventory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInventory.map(item => item.id));
    }
  };

  const toggleSelectItemBox = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setFormTitle("");
    setFormSku("");
    setFormPrice(19.99);
    setFormCost(5.00);
    setFormQty(5);
    setFormDesc("");
    setFormDescEbay("");
    setFormDescShopify("");
    setFormDescEtsy("");
    setFormDescSocial("");
    setActiveDescTab("standard");
    setFormCategory("Electronics");
    setFormCondition("New");
    setFormKeywords("");
    setFormEbayId("");
    setFormFbId("");
    setFormEtsyId("");
    setFormMercariId("");
    setFormPoshmarkId("");
    setFormDepopId("");
    setFormShopifyId("");
    setFormImages(["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"]);
  };

  // Save/Update Marketplace Connection Credentials
  const handleSaveConnection = async (platform: string, api_key: string, username: string, status: string) => {
    try {
      const response = await fetch("/api/crossposter/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, api_key, username, status })
      });
      const data = await response.json();
      if (data.success) {
        setTerminalLogs(prev => [
          `[PLATFORM CONNECT] Configured credentials for ${platform.toUpperCase()}: status set to ${status}.`,
          ...prev
        ]);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send interactive message/command to AI assistant copilot
  const handleSendCopilotMessage = async (customText?: string) => {
    const textToSend = customText || copilotMessage;
    if (!textToSend.trim()) return;

    setCopilotChat(prev => [...prev, { sender: "user", text: textToSend, timestamp: new Date() }]);
    setCopilotMessage("");
    setIsSendingCopilot(true);

    try {
      const response = await fetch("/api/crossposter/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();
      if (data.success) {
        setCopilotChat(prev => [...prev, { sender: "copilot", text: data.message, timestamp: new Date() }]);
        if (data.logs && data.logs.length > 0) {
          setTerminalLogs(prev => [...data.logs, ...prev]);
        }
        // Force fully reload data in case items were repriced, listed or delisted!
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingCopilot(false);
    }
  };

  const getPlatformStatusColor = (status: string) => {
    switch (status) {
      case "Listed": return "bg-emerald-950/60 text-emerald-400 border-emerald-900/30";
      case "Pending": return "bg-amber-950/60 text-amber-400 border-amber-900/30";
      case "Delisting": return "bg-rose-950/60 text-rose-400 border-rose-900/30";
      case "Failed": return "bg-rose-950/40 text-rose-400 border-rose-900/30";
      default: return "bg-zinc-950 text-slate-500 border-zinc-800/40";
    }
  };

  // Filter lists
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(inventory.map(i => i.category)));

  // Pie colors
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899", "#8b5cf6", "#14b8a6"];

  return (
    <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 space-y-6 animate-fade-in font-sans text-slate-200">
      
      {/* Upper Brand Header */}
      <div className="border-b border-zinc-850 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Boxes className="w-6 h-6 text-indigo-400" />
              <h2 className="text-lg font-mono font-black text-slate-100 uppercase tracking-tight">
                CrossPoster Enterprise
              </h2>
              <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-400 border border-indigo-900/30 px-2 py-0.5 rounded">
                SOVEREIGN WORKSPACE APP
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
              Flagship inventory multi-posting controller and real-time oversell synchronization engine. Orchestrate listings seamlessly across major channels using localized cost-aware AI models.
            </p>
          </div>

          {/* Active AI Agent Status */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg px-4 py-2.5 flex items-center gap-3">
            <div className="relative">
              <span className="flex h-3 w-3 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">COGNITIVE AGENT LIVE</div>
              <div className="text-xs font-mono text-slate-300 font-bold">CrossPoster AI Optimizer v1.1</div>
            </div>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            <div className="bg-zinc-950/40 border border-zinc-850 p-3.5 rounded-lg">
              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Master Inventory</div>
              <div className="text-xl font-mono font-bold text-slate-100 mt-1">{analytics.totalItems} Items</div>
            </div>
            <div className="bg-zinc-950/40 border border-zinc-850 p-3.5 rounded-lg">
              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Active Channel Listings</div>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-1">{analytics.activeListings} Active</div>
            </div>
            <div className="bg-zinc-950/40 border border-zinc-850 p-3.5 rounded-lg">
              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Gross Sales Volume</div>
              <div className="text-xl font-mono font-bold text-slate-100 mt-1">{analytics.soldCount} Units Sold</div>
            </div>
            <div className="bg-zinc-950/40 border border-zinc-850 p-3.5 rounded-lg">
              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Estimated Revenue</div>
              <div className="text-xl font-mono font-bold text-indigo-400 mt-1">${analytics.totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Row & Bulk Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-850 pb-2">
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-850">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              activeTab === "inventory" ? "bg-indigo-600 text-slate-100" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Inventory Master
          </button>
          <button
            onClick={() => setActiveTab("connections")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              activeTab === "connections" ? "bg-indigo-600 text-slate-100" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Marketplace Connections
          </button>
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "queue" ? "bg-indigo-600 text-slate-100" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Worker Queue
            {queue.filter(q => q.status === "PENDING").length > 0 && (
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              activeTab === "analytics" ? "bg-indigo-600 text-slate-100" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Market Reports
          </button>
          <button
            onClick={() => setActiveTab("copilot")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "copilot" ? "bg-indigo-600 text-slate-100" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Copilot
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            className="p-1.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 rounded text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Force Full SQLite Sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          <button
            onClick={handleBulkImport}
            className="bg-indigo-950/40 hover:bg-indigo-900/30 border border-indigo-900/40 px-3 py-1.5 rounded text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Bulk Importer
          </button>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded text-xs font-mono font-bold text-slate-100 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add SKU
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column Area based on tab */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: Master Inventory */}
            {activeTab === "inventory" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Filter and Search Box */}
                <div className="bg-zinc-950/30 border border-zinc-850 rounded-lg p-3.5 flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex items-center gap-2 flex-grow max-w-md">
                    <Filter className="w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search items by Title or SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-zinc-950 border border-zinc-850 rounded px-2 py-1.5 text-xs font-mono text-slate-400 focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>

                    <button
                      onClick={() => setShowBulkControls(!showBulkControls)}
                      className={`px-3 py-1.5 border rounded text-xs font-mono font-bold transition-all ${
                        showBulkControls
                          ? "bg-zinc-900 text-slate-200 border-zinc-700"
                          : "bg-zinc-950 text-slate-400 border-zinc-850 hover:bg-zinc-900"
                      }`}
                    >
                      Bulk Actions {selectedIds.length > 0 && `(${selectedIds.length})`}
                    </button>
                  </div>
                </div>

                {/* Bulk Action Panel */}
                {showBulkControls && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-zinc-950/50 border border-zinc-850 p-4 rounded-lg space-y-3"
                  >
                    <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-indigo-400" />
                      Bulk Multi-Listing Modifiers
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Select multiple items from the grid below, then apply broad corrections to prices or properties instantly.
                    </p>
                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Modify Price ($):</span>
                        <input
                          type="number"
                          value={bulkPriceAdjust}
                          onChange={(e) => setBulkPriceAdjust(Number(e.target.value))}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs font-mono text-slate-200 w-20"
                        />
                      </div>
                      <button
                        onClick={handleBulkPriceAdjustment}
                        disabled={selectedIds.length === 0}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-3 py-1 text-xs font-mono font-bold text-slate-100 rounded transition-all cursor-pointer"
                      >
                        Adjust Selected Prices
                      </button>
                      <button
                        onClick={() => setSelectedIds([])}
                        className="text-xs font-mono text-zinc-500 hover:text-zinc-300"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Inventory Table Grid */}
                <div className="bg-zinc-950/20 border border-zinc-850 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse font-sans">
                    <thead>
                      <tr className="bg-zinc-950 border-b border-zinc-850 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={filteredInventory.length > 0 && selectedIds.length === filteredInventory.length}
                            onChange={toggleSelectAll}
                            className="rounded bg-zinc-950 border-zinc-800 focus:ring-0"
                          />
                        </th>
                        <th className="py-3 px-4">Item Details</th>
                        <th className="py-3 px-4">SKU / Code</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4 text-center">Stock</th>
                        <th className="py-3 px-4">Platforms Listed</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850/40 text-xs">
                      {filteredInventory.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                            No product listings match current parameters. Import some mock listings to begin!
                          </td>
                        </tr>
                      ) : (
                        filteredInventory.map(item => {
                          const platformsActive = [
                            { name: "eBay", stat: item.ebay_status },
                            { name: "FB", stat: item.fb_status },
                            { name: "Etsy", stat: item.etsy_status },
                            { name: "Mercari", stat: item.mercari_status },
                            { name: "Posh", stat: item.poshmark_status },
                            { name: "Depop", stat: item.depop_status },
                            { name: "Shopify", stat: item.shopify_status }
                          ].filter(p => p.stat && p.stat !== "Not Listed");

                          return (
                            <tr
                              key={item.id}
                              className={`hover:bg-zinc-900/35 transition-all cursor-pointer ${
                                selectedItem?.id === item.id ? 'bg-indigo-950/20 border-l-2 border-l-indigo-500' : ''
                              }`}
                              onClick={() => handleSelectItem(item)}
                            >
                              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(item.id)}
                                  onChange={() => toggleSelectItemBox(item.id)}
                                  className="rounded bg-zinc-950 border-zinc-800 focus:ring-0"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    <img
                                      src={JSON.parse(item.images || "[]")[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"}
                                      alt={item.title}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-100 line-clamp-1">{item.title}</div>
                                    <div className="text-[10px] text-indigo-400 font-mono">{item.category}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-mono text-zinc-400 font-semibold">{item.sku}</td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">${item.price.toFixed(2)}</td>
                              <td className="py-3 px-4 text-center font-mono">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.quantity <= 0
                                    ? 'bg-rose-950/60 text-rose-400 border border-rose-900/30'
                                    : item.quantity <= 2
                                    ? 'bg-amber-950/60 text-amber-400 border border-amber-900/30'
                                    : 'bg-zinc-900 text-slate-300'
                                }`}>
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1.5">
                                  {platformsActive.length === 0 ? (
                                    <span className="text-[10px] text-zinc-600 font-mono italic">Not Listed</span>
                                  ) : (
                                    platformsActive.map(p => (
                                      <span
                                        key={p.name}
                                        className={`px-1.5 py-0.5 rounded text-[9px] border font-mono font-bold tracking-tight ${getPlatformStatusColor(p.stat)}`}
                                      >
                                        {p.name}
                                      </span>
                                    ))
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleDeleteProduct(item.id)}
                                  className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-zinc-950 transition-all cursor-pointer"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Worker Queue */}
            {activeTab === "queue" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 font-mono text-xs"
              >
                <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-lg space-y-3.5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-mono font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-amber-400 animate-spin" />
                      CrossPoster Core Background Workers
                    </h3>
                    <button
                      onClick={handleRunQueue}
                      disabled={queueProcessing}
                      className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 px-4 py-2 rounded font-mono font-black text-zinc-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/10"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {queueProcessing ? "PROCESSING..." : "RUN QUEUE WORKERS"}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans">
                    Multi-channel tasks (listings updates, relist, oversell-delisting) are queued here. Run the worker engine to propagate updates to eBay, Etsy, Facebook, Shopify, etc.
                  </p>
                </div>

                <div className="bg-zinc-950 border border-zinc-850 rounded-lg overflow-hidden">
                  <div className="bg-zinc-900 border-b border-zinc-850 px-4 py-2.5 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Active Queued Operations</span>
                    <span>{queue.length} Total Jobs</span>
                  </div>
                  <div className="divide-y divide-zinc-900/60 max-h-96 overflow-y-auto">
                    {queue.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 italic">
                        Background worker queue is clear. No pending crosspost tasks.
                      </div>
                    ) : (
                      queue.map(q => (
                        <div key={q.id} className="p-3 hover:bg-zinc-900/30 flex items-center justify-between border-b border-zinc-900/40 last:border-0">
                          <div className="flex items-center gap-3">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            <div>
                              <div className="font-bold text-slate-200">
                                {q.action} on {q.platform.toUpperCase()}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                SKU / Item ID: {q.itemId} • {new Date(q.timestamp).toLocaleString()}
                              </div>
                              {q.status === "FAILED" && q.error_message && (
                                <div className="text-[9px] text-rose-400 bg-rose-950/20 border border-rose-950/40 px-2 py-1.5 rounded mt-1 max-w-lg leading-relaxed font-sans">
                                  <span className="font-mono font-bold uppercase tracking-wider text-[8px] bg-rose-900 text-rose-200 px-1 py-0.5 rounded mr-1">ERROR</span>
                                  {q.error_message}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {q.status === "FAILED" && (
                              <button
                                onClick={() => handleRetryJob(q.id)}
                                className="bg-rose-950 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer"
                                title="Re-submit task to queue with status Pending"
                              >
                                RETRY JOB
                              </button>
                            )}
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                              q.status === "COMPLETED"
                                ? "bg-emerald-950/50 text-emerald-400 border-emerald-900/30"
                                : q.status === "PENDING"
                                ? "bg-amber-950/50 text-amber-400 border-amber-900/30"
                                : "bg-rose-950/50 text-rose-400 border-rose-900/30"
                            }`}>
                              {q.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Analytics */}
            {activeTab === "analytics" && analytics && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Revenue Growth chart */}
                  <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-lg space-y-4">
                    <h3 className="text-xs font-mono font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      H1 Revenue Projection & Performance
                    </h3>
                    <div className="h-64 text-zinc-400">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.salesTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="month" stroke="#71717a" fontSize={10} />
                          <YAxis stroke="#71717a" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: 11 }} />
                          <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Marketplace Shares */}
                  <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-lg space-y-4">
                    <h3 className="text-xs font-mono font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Layers3 className="w-4 h-4 text-indigo-400" />
                      Active Listing Share by Marketplace
                    </h3>
                    <div className="h-64 flex flex-col justify-center">
                      {analytics.activeListingsByPlatform.some((p: any) => p.count > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.activeListingsByPlatform.filter((p: any) => p.count > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="count"
                            >
                              {analytics.activeListingsByPlatform.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: 11 }} />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 10 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center text-slate-500 font-mono py-12 text-xs">
                          Cross-post products to platforms to populate charts.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secondary Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Financial Metrics & Asset Value */}
                  <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-lg space-y-4">
                    <h3 className="text-xs font-mono font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-indigo-400" />
                      Master Inventory Financial Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="bg-zinc-950/80 border border-zinc-900 rounded p-3">
                        <div className="text-[9px] text-zinc-500 uppercase">Gross Revenue</div>
                        <div className="text-base font-bold text-slate-100 mt-0.5">${(analytics.totalRevenue || 0).toLocaleString()}</div>
                      </div>
                      <div className="bg-zinc-950/80 border border-zinc-900 rounded p-3">
                        <div className="text-[9px] text-zinc-500 uppercase">Cost of Goods (COGS)</div>
                        <div className="text-base font-bold text-slate-100 mt-0.5">${(analytics.totalCogs || 0).toLocaleString()}</div>
                      </div>
                      <div className="bg-zinc-950/80 border border-zinc-900 rounded p-3 bg-indigo-950/10">
                        <div className="text-[9px] text-indigo-400 uppercase">Net Realized Profit</div>
                        <div className="text-base font-bold text-emerald-400 mt-0.5">${(analytics.totalProfit || 0).toLocaleString()}</div>
                      </div>
                      <div className="bg-zinc-950/80 border border-zinc-900 rounded p-3">
                        <div className="text-[9px] text-zinc-500 uppercase">Avg Profit Margin %</div>
                        <div className="text-base font-bold text-slate-100 mt-0.5">
                          {analytics.totalRevenue > 0 ? ((analytics.totalProfit / analytics.totalRevenue) * 100).toFixed(1) : "0.0"}%
                        </div>
                      </div>
                    </div>

                    {/* Inventory Asset Value Card */}
                    <div className="border border-zinc-900 rounded p-3.5 bg-zinc-950/80 flex items-center justify-between">
                      <div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase">Unlisted Capital / Inventory Cost Value</div>
                        <div className="text-sm font-mono font-bold text-slate-300 mt-0.5">${(analytics.totalInventoryCost || 0).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-mono text-slate-500 uppercase">Est. Retail Market Value</div>
                        <div className="text-sm font-mono font-bold text-indigo-400 mt-0.5">${(analytics.totalInventoryValue || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Aging Indicators */}
                  <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-lg space-y-4">
                    <h3 className="text-xs font-mono font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Listing Portfolio Aging Distribution
                    </h3>
                    
                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Recent (0 - 30 days listed)</span>
                          <span className="text-indigo-400 font-bold">{analytics.aging?.["0-30"] || 0} items</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded transition-all"
                            style={{ width: `${Math.min(100, ((analytics.aging?.["0-30"] || 0) / (analytics.totalItems || 1)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Established (31 - 60 days listed)</span>
                          <span className="text-amber-400 font-bold">{analytics.aging?.["31-60"] || 0} items</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded transition-all"
                            style={{ width: `${Math.min(100, ((analytics.aging?.["31-60"] || 0) / (analytics.totalItems || 1)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Stale (61+ days listed / Relist recommended)</span>
                          <span className="text-rose-400 font-bold">{analytics.aging?.["61+"] || 0} items</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded transition-all"
                            style={{ width: `${Math.min(100, ((analytics.aging?.["61+"] || 0) / (analytics.totalItems || 1)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-500 font-sans leading-relaxed pt-1">
                      Stale listings of over 60 days will lose organic rank algorithms. Use AI Copilot voice command <code className="text-indigo-400 font-mono">"Relist stale inventory"</code> to auto-republish them.
                    </div>
                  </div>
                </div>

                {/* Best Performers & Slow Sellers tables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Best Performers Table */}
                  <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-lg space-y-3">
                    <h3 className="text-xs font-mono font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Top Performing Conversions
                    </h3>
                    <div className="border border-zinc-900 rounded bg-zinc-950/80 overflow-hidden">
                      <table className="w-full text-left text-[11px] font-mono">
                        <thead className="bg-zinc-950 text-slate-500 uppercase text-[9px] border-b border-zinc-900">
                          <tr>
                            <th className="p-2">SKU</th>
                            <th className="p-2">Title</th>
                            <th className="p-2 text-right">Sales</th>
                            <th className="p-2 text-right">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900 text-slate-300">
                          {analytics.bestPerformers && analytics.bestPerformers.length > 0 ? (
                            analytics.bestPerformers.map((item: any, idx: number) => (
                              <tr key={idx} className="hover:bg-zinc-900/30">
                                <td className="p-2 text-slate-400 font-bold">{item.sku}</td>
                                <td className="p-2 truncate max-w-[120px] font-sans" title={item.title}>{item.title}</td>
                                <td className="p-2 text-right text-indigo-400">{item.sales} sold</td>
                                <td className="p-2 text-right text-emerald-400 font-bold">${(item.price * item.sales).toFixed(2)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-6 text-center text-zinc-600">No sold listings tracked.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Slow Sellers Table */}
                  <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-lg space-y-3">
                    <h3 className="text-xs font-mono font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      Underperforming Listings (Slow Sellers)
                    </h3>
                    <div className="border border-zinc-900 rounded bg-zinc-950/80 overflow-hidden">
                      <table className="w-full text-left text-[11px] font-mono">
                        <thead className="bg-zinc-950 text-slate-500 uppercase text-[9px] border-b border-zinc-900">
                          <tr>
                            <th className="p-2">SKU</th>
                            <th className="p-2">Title</th>
                            <th className="p-2 text-right">Views</th>
                            <th className="p-2">Category</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900 text-slate-300">
                          {analytics.slowSellers && analytics.slowSellers.length > 0 ? (
                            analytics.slowSellers.map((item: any, idx: number) => (
                              <tr key={idx} className="hover:bg-zinc-900/30">
                                <td className="p-2 text-slate-400 font-bold">{item.sku}</td>
                                <td className="p-2 truncate max-w-[120px] font-sans" title={item.title}>{item.title}</td>
                                <td className="p-2 text-right text-amber-500">{item.views} views</td>
                                <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-zinc-900 text-[9px] text-zinc-500">{item.category}</span></td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-6 text-center text-zinc-600">All listings are converting properly.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 4: Marketplace Connections */}
            {activeTab === "connections" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-zinc-950/40 border border-zinc-850 p-5 rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <Layers3 className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-mono font-black text-slate-100 uppercase tracking-tight">
                      Marketplace Connection Channels
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal font-sans">
                    Configure your API integration credentials and account links below. All private credentials are encrypted and processed through the Empire OS sandbox gateway to securely propagate real-time listings and oversell tracking.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {["ebay", "shopify", "etsy", "fb", "mercari", "poshmark", "depop"].map(p => {
                      const conn = connections.find(c => c.platform === p) || {
                        platform: p,
                        api_key: "",
                        username: "",
                        status: "Disconnected"
                      };

                      return (
                        <div key={p} className="bg-zinc-950 border border-zinc-850 p-4 rounded-lg space-y-3 flex flex-col justify-between">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                            <span className="font-mono font-black text-xs text-slate-100 uppercase tracking-wider">{p.toUpperCase()}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border ${
                              conn.status === "Connected"
                                ? "bg-emerald-950/50 text-emerald-400 border-emerald-900/30 animate-pulse"
                                : "bg-zinc-900 text-slate-500 border-zinc-800"
                            }`}>
                              ● {conn.status}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Username / Store ID</label>
                              <input
                                id={`user_${p}`}
                                type="text"
                                defaultValue={conn.username}
                                placeholder="Store identifier..."
                                className="w-full bg-zinc-900 border border-zinc-850 rounded p-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Sandbox API Bearer Key</label>
                              <input
                                id={`key_${p}`}
                                type="password"
                                defaultValue={conn.api_key}
                                placeholder="sk_test_..."
                                className="w-full bg-zinc-900 border border-zinc-850 rounded p-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 pt-3">
                            <button
                              onClick={() => {
                                const username = (document.getElementById(`user_${p}`) as HTMLInputElement)?.value || "";
                                const key = (document.getElementById(`key_${p}`) as HTMLInputElement)?.value || "";
                                handleSaveConnection(p, key, username, "Connected");
                              }}
                              className="bg-indigo-600 hover:bg-indigo-500 flex-1 py-1.5 rounded text-[10px] font-mono font-bold text-slate-100 transition-all cursor-pointer text-center"
                            >
                              CONNECT CHANNEL
                            </button>
                            {conn.status === "Connected" && (
                              <button
                                onClick={() => {
                                  const username = (document.getElementById(`user_${p}`) as HTMLInputElement)?.value || "";
                                  const key = (document.getElementById(`key_${p}`) as HTMLInputElement)?.value || "";
                                  handleSaveConnection(p, key, username, "Disconnected");
                                }}
                                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-1.5 rounded text-[10px] font-mono font-bold text-rose-400 transition-all cursor-pointer text-center"
                              >
                                DISCONNECT
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 5: AI Copilot */}
            {activeTab === "copilot" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-zinc-950/40 border border-zinc-850 p-5 rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <h3 className="text-sm font-mono font-black text-slate-100 uppercase tracking-tight">
                      CrossPoster AI Copilot (Empowered with AI Router)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal font-sans">
                    Talk to the central sovereign system agent in natural language. You can issue voice or text commands that directly perform inventory adjustments, automatically trigger queue tasks, and run diagnostics.
                  </p>

                  {/* Preset Command Chips */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Quick Actions / Voice Prompts</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "List Everywhere", text: "List this everywhere." },
                        { label: "Find Slow Sellers", text: "Find slow sellers." },
                        { label: "Update All Prices (+15%)", text: "Update all prices." },
                        { label: "Show Highest Profit SKU", text: "Show highest profit items." },
                        { label: "Relist Stale Items", text: "Relist stale inventory." }
                      ].map((cmd, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendCopilotMessage(cmd.text)}
                          disabled={isSendingCopilot}
                          className="bg-zinc-900 hover:bg-indigo-950/40 border border-zinc-800 hover:border-indigo-800/40 px-2.5 py-1.5 rounded text-[10px] font-mono text-zinc-300 hover:text-indigo-300 transition-all cursor-pointer"
                        >
                          {cmd.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chat Box Container */}
                  <div className="border border-zinc-850 rounded-lg bg-zinc-950 overflow-hidden flex flex-col h-[320px]">
                    {/* Chat Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3.5 flex flex-col">
                      {copilotChat.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col max-w-[85%] ${
                            msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                          }`}
                        >
                          <div className={`rounded-lg px-3 py-2 text-xs leading-relaxed font-mono ${
                            msg.sender === "user"
                              ? "bg-indigo-600 text-slate-100 rounded-tr-none"
                              : "bg-zinc-900 text-slate-300 rounded-tl-none border border-zinc-850"
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-zinc-600 font-mono mt-1">
                            {msg.sender === "user" ? "You" : "Empire Copilot"} • {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                      {isSendingCopilot && (
                        <div className="self-start items-start flex flex-col max-w-[85%]">
                          <div className="rounded-lg px-3 py-2 text-xs bg-zinc-900 border border-zinc-850 text-indigo-400 font-mono flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span>
                            Empire AI Router routing to LLM model...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-zinc-850 p-2 bg-zinc-900/50 flex gap-2">
                      <input
                        type="text"
                        placeholder="Say e.g. 'Show highest profit items' or list commands..."
                        value={copilotMessage}
                        onChange={(e) => setCopilotMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendCopilotMessage();
                          }
                        }}
                        className="flex-grow bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSendCopilotMessage()}
                        disabled={isSendingCopilot || !copilotMessage.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-1.5 rounded text-xs font-mono font-bold text-slate-100 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Column: Listing Builder & Details Panel */}
        <div className="lg:col-span-4 bg-zinc-950/50 border border-zinc-850 rounded-lg p-5 space-y-5">
          
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-4 h-4 text-indigo-400" />
              Listing Controller
            </h4>
            <p className="text-[10px] text-slate-500 font-sans font-medium">Configure product properties, optimize with LLM AI, and publish cross-platform.</p>
          </div>

          {selectedItem || isAddingProduct ? (
            <div className="space-y-4">
              
              {/* Image Manager Preview */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Gallery / Assets</label>
                <div className="grid grid-cols-4 gap-2">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative w-full h-12 rounded bg-zinc-900 border border-zinc-800 overflow-hidden group">
                      <img src={img} alt="Product preview" className="object-cover w-full h-full" />
                      <button
                        onClick={() => setFormImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0 right-0 bg-rose-600 text-slate-100 p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="relative w-full h-12">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          const files = e.target.files;
                          for (let i = 0; i < files.length; i++) {
                            const file = files[i];
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setFormImages(prev => [...prev, ev.target!.result as string]);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                      className="hidden"
                      id="gallery-file-upload-input"
                    />
                    <label
                      htmlFor="gallery-file-upload-input"
                      className="w-full h-full rounded border-2 border-dashed border-zinc-800 hover:border-indigo-800/80 hover:bg-indigo-950/20 flex flex-col items-center justify-center text-zinc-500 hover:text-indigo-400 transition-all cursor-pointer text-center"
                      title="Upload custom image or drag and drop files"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-[8px] font-mono mt-0.5">UPLOAD</span>
                    </label>
                  </div>
                  
                  <button
                    onClick={() => {
                      const url = prompt("Enter custom image web URL:");
                      if (url) setFormImages(prev => [...prev, url]);
                    }}
                    type="button"
                    className="w-full h-12 rounded border-2 border-dashed border-zinc-800 hover:border-zinc-700 flex flex-col items-center justify-center text-zinc-500 hover:text-slate-300 transition-all cursor-pointer text-center"
                    title="Add image via remote web URL link"
                  >
                    <span className="text-[9px] font-mono font-bold">LINK URL</span>
                  </button>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Product Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="Enter item title..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Cost of Goods ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formCost}
                      onChange={(e) => setFormCost(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stock / Qty</label>
                    <input
                      type="number"
                      value={formQty}
                      onChange={(e) => setFormQty(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Condition</label>
                    <select
                      value={formCondition}
                      onChange={(e) => setFormCondition(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-400 focus:outline-none"
                    >
                      <option value="New">New with Tags</option>
                      <option value="Like New">Like New</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good / Fair</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">SKU Code</label>
                    <input
                      type="text"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      disabled={!isAddingProduct}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none disabled:opacity-50"
                      placeholder="e.g. SKU-VINT-12"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Listing Category</label>
                    <input
                      type="text"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none"
                      placeholder="Category tag..."
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">SEO Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    value={formKeywords}
                    onChange={(e) => setFormKeywords(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none"
                    placeholder="vintage, retro, leather..."
                  />
                </div>

                {/* Listing IDs section */}
                <div className="border border-zinc-850 rounded p-2.5 bg-zinc-950/40 space-y-1.5">
                  <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-wider">Channel Reference IDs</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500">eBay ID</span>
                      <input
                        type="text"
                        value={formEbayId}
                        onChange={(e) => setFormEbayId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                        placeholder="N/A"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500">Facebook ID</span>
                      <input
                        type="text"
                        value={formFbId}
                        onChange={(e) => setFormFbId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                        placeholder="N/A"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500">Etsy ID</span>
                      <input
                        type="text"
                        value={formEtsyId}
                        onChange={(e) => setFormEtsyId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                        placeholder="N/A"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500">Shopify ID</span>
                      <input
                        type="text"
                        value={formShopifyId}
                        onChange={(e) => setFormShopifyId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                        placeholder="N/A"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border border-zinc-850/60 rounded-lg p-3 bg-zinc-950/20">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Product Descriptions</label>
                    <span className="text-[8px] font-mono bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900/30">PLATFORM SPECIFIC OVERRIDES</span>
                  </div>
                  
                  {/* Tabs bar */}
                  <div className="flex gap-1 bg-zinc-950 p-1 rounded-md border border-zinc-850 overflow-x-auto">
                    {[
                      { id: "standard", label: "Master" },
                      { id: "ebay", label: "eBay SEO" },
                      { id: "shopify", label: "Shopify Elegant" },
                      { id: "etsy", label: "Etsy Story" },
                      { id: "social", label: "Social Ad" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveDescTab(tab.id as any)}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all ${
                          activeDescTab === tab.id
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {activeDescTab === "standard" && (
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none h-28"
                      placeholder="Master description used as base..."
                    />
                  )}
                  {activeDescTab === "ebay" && (
                    <div className="space-y-1">
                      <textarea
                        value={formDescEbay}
                        onChange={(e) => setFormDescEbay(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-amber-400 focus:outline-none h-28"
                        placeholder="eBay description (HTML/Plain text)..."
                      />
                      <p className="text-[9px] font-mono text-slate-500">Optimized with strict eBay buyer protection terms and dynamic delivery specs.</p>
                    </div>
                  )}
                  {activeDescTab === "shopify" && (
                    <div className="space-y-1">
                      <textarea
                        value={formDescShopify}
                        onChange={(e) => setFormDescShopify(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-emerald-400 focus:outline-none h-28"
                        placeholder="Shopify description..."
                      />
                      <p className="text-[9px] font-mono text-slate-500">Rich HTML blocks, detailed feature charts, and responsive checkout story structure.</p>
                    </div>
                  )}
                  {activeDescTab === "etsy" && (
                    <div className="space-y-1">
                      <textarea
                        value={formDescEtsy}
                        onChange={(e) => setFormDescEtsy(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-orange-400 focus:outline-none h-28"
                        placeholder="Etsy description..."
                      />
                      <p className="text-[9px] font-mono text-slate-500">Focuses on materials, artisan craftsmanship, vintage history, and custom attributes.</p>
                    </div>
                  )}
                  {activeDescTab === "social" && (
                    <div className="space-y-1">
                      <textarea
                        value={formDescSocial}
                        onChange={(e) => setFormDescSocial(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-pink-400 focus:outline-none h-28"
                        placeholder="Social ad description..."
                      />
                      <p className="text-[9px] font-mono text-slate-500">Formatted with hashtags, emojis, and high-impact call-to-actions to spark conversion.</p>
                    </div>
                  )}
                </div>
              </div>

              {isAddingProduct ? (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveProduct}
                    className="bg-indigo-600 hover:bg-indigo-500 flex-1 py-2 rounded text-xs font-mono font-bold text-slate-100 transition-all cursor-pointer"
                  >
                    REGISTER PRODUCT
                  </button>
                  <button
                    onClick={() => { setIsAddingProduct(false); resetForm(); }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded text-xs font-mono font-bold text-slate-300 transition-all cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2 border-t border-zinc-850">
                  
                  {/* AI Optimize Section */}
                  <div className="bg-indigo-950/20 border border-indigo-900/35 p-3 rounded-lg space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-wide flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Router Optimizer
                      </span>
                      <span className="text-[9px] font-mono text-indigo-300 bg-indigo-950/40 border border-indigo-900/30 px-1.5 rounded">Ollama Default</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. SEO key-stacking, casual tone..."
                      value={customOptimizeInstruction}
                      onChange={(e) => setCustomOptimizeInstruction(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-[11px] font-mono text-slate-200 focus:outline-none"
                    />
                    <button
                      onClick={handleAIOptimize}
                      disabled={isOptimizing}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 w-full py-2 rounded text-xs font-mono font-bold text-slate-100 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isOptimizing ? "OPTIMIZING WITH LLM..." : "AI OPTIMIZE LISTING"}
                    </button>
                  </div>

                  {/* Marketplace Cross-posting selector */}
                  <div className="bg-zinc-900/50 border border-zinc-850 p-3 rounded-lg space-y-2.5">
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Select Marketplaces</div>
                    <div className="grid grid-cols-2 gap-2">
                      {["ebay", "shopify", "etsy", "fb", "mercari", "poshmark", "depop"].map(p => {
                        const isSelected = crosspostPlatforms.includes(p);
                        return (
                          <button
                            key={p}
                            onClick={() => {
                              setCrosspostPlatforms(prev =>
                                prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                              );
                            }}
                            className={`px-2 py-1.5 rounded border text-[10px] font-mono font-bold transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-indigo-950 border-indigo-800 text-indigo-400"
                                : "bg-zinc-950 border-zinc-850 text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            <span>{p.toUpperCase()}</span>
                            {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={handleCrosspost}
                      className="bg-emerald-600 hover:bg-emerald-500 w-full py-2 rounded text-xs font-mono font-bold text-slate-100 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/10"
                    >
                      <Send className="w-3.5 h-3.5" />
                      CROSS-POST TO CHANNELS
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProduct}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex-grow py-2 rounded text-xs font-mono font-bold text-slate-200 transition-all cursor-pointer"
                    >
                      SAVE UPDATES
                    </button>
                    <button
                      onClick={() => { setSelectedItem(null); resetForm(); }}
                      className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 px-3.5 py-2 rounded text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
                    >
                      DESELECT
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <ShoppingBag className="w-12 h-12 text-zinc-700" />
              <div>
                <p className="text-xs font-mono">No Active Item Selected</p>
                <p className="text-[10px] text-slate-600 font-sans mt-1 max-w-xs">Select a product from the database grid, or register a new one to optimize listings.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Live logs output */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-lg overflow-hidden">
        <div className="bg-zinc-900/80 px-4 py-2 flex items-center justify-between border-b border-zinc-850 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Worker Activity Terminal Logs</span>
          </div>
          <button
            onClick={() => setTerminalLogs(["System: Logs flushed.", "System: Standing by..."])}
            className="text-[9px] text-slate-500 hover:text-slate-300 transition-all font-mono uppercase"
          >
            Flush Console
          </button>
        </div>
        <div className="p-4 bg-zinc-950 text-emerald-400/90 font-mono text-[10px] h-32 overflow-y-auto space-y-1.5 leading-normal select-text selection:bg-zinc-800 selection:text-emerald-300">
          {terminalLogs.map((log, idx) => (
            <div key={idx} className={`${log.startsWith('[ERROR]') ? 'text-rose-400' : log.startsWith('[SALE') ? 'text-amber-300 font-bold' : log.startsWith('[OVERSELL') ? 'text-amber-400 font-bold' : ''}`}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* BULK IMPORTER MODAL OVERLAY */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in font-sans">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/80">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-mono font-black text-slate-100 uppercase tracking-tight">
                  CrossPoster Bulk Inventory Importer
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportPreview([]);
                }}
                className="text-slate-400 hover:text-slate-200 transition-all font-bold p-1 rounded hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* eBay CSV drop zone */}
                <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950/20 hover:border-amber-600/40 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider">eBay CSV Format</div>
                    <p className="text-xs text-slate-400 mt-1">Parses standard eBay listing exports. Maps `Title`, `Description`, `Price`, and `Quantity` directly.</p>
                  </div>
                  <div className="relative border border-dashed border-zinc-800 hover:border-amber-500 rounded p-4 text-center cursor-pointer bg-zinc-950 hover:bg-zinc-900/30 transition-all">
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileImport(file, 'ebay');
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <span className="text-[9px] font-mono text-slate-500">SELECT EBAY CSV</span>
                  </div>
                </div>

                {/* Shopify CSV drop zone */}
                <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950/20 hover:border-emerald-600/40 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-wider">Shopify CSV Format</div>
                    <p className="text-xs text-slate-400 mt-1">Parses official Shopify exporter tables. Maps `Handle`, `Title`, `Variant Price`, and `Image Src` columns.</p>
                  </div>
                  <div className="relative border border-dashed border-zinc-800 hover:border-emerald-500 rounded p-4 text-center cursor-pointer bg-zinc-950 hover:bg-zinc-900/30 transition-all">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileImport(file, 'shopify');
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <span className="text-[9px] font-mono text-slate-500">SELECT SHOPIFY CSV</span>
                  </div>
                </div>

                {/* Manual CSV / Sample drop zone */}
                <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950/20 hover:border-indigo-600/40 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Manual CSV Upload</div>
                    <p className="text-xs text-slate-400 mt-1">Accepts any standard spreadsheet with headings: `Title`, `Description`, `SKU`, `Price`, `Cost`, `Quantity`.</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative border border-dashed border-zinc-800 hover:border-indigo-500 rounded p-4 text-center cursor-pointer bg-zinc-950 hover:bg-zinc-900/30 transition-all flex-1">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileImport(file, 'manual');
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                      <span className="text-[9px] font-mono text-slate-500">UPLOAD CSV</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleLoadDemoInventory}
                      className="bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-900/50 hover:border-indigo-800 text-indigo-400 rounded p-3 flex flex-col items-center justify-center transition-all cursor-pointer flex-1 text-center"
                    >
                      <Sparkles className="w-5 h-5 mb-1 text-indigo-400" />
                      <span className="text-[9px] font-mono font-bold">DEMO SKUS</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview table block */}
              {importPreview.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">Parsed Source of Truth Preview ({importPreview.length} items)</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">Note: All values can be edited or optimized via AI once imported.</span>
                  </div>

                  <div className="border border-zinc-800 rounded bg-zinc-950/40 overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-zinc-950 sticky top-0 text-[10px] text-slate-400 uppercase border-b border-zinc-850">
                          <tr>
                            <th className="p-2.5">Photo</th>
                            <th className="p-2.5">SKU</th>
                            <th className="p-2.5">Title</th>
                            <th className="p-2.5 text-right">Cost ($)</th>
                            <th className="p-2.5 text-right">Price ($)</th>
                            <th className="p-2.5 text-right">Qty</th>
                            <th className="p-2.5">Category</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-850">
                          {importPreview.map((item, idx) => (
                            <tr key={idx} className="hover:bg-zinc-900/40 text-slate-300">
                              <td className="p-2">
                                <img
                                  src={Array.isArray(item.images) ? item.images[0] : item.images}
                                  alt=""
                                  className="w-8 h-8 object-cover rounded bg-zinc-900 border border-zinc-800"
                                />
                              </td>
                              <td className="p-2 font-mono font-bold text-slate-400">{item.sku}</td>
                              <td className="p-2 font-sans max-w-[200px] truncate" title={item.title}>{item.title}</td>
                              <td className="p-2 text-right text-slate-400">${Number(item.cost || 5).toFixed(2)}</td>
                              <td className="p-2 text-right text-emerald-400 font-bold">${Number(item.price || 19.99).toFixed(2)}</td>
                              <td className="p-2 text-right text-indigo-400">{item.quantity}</td>
                              <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400">{item.category}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-zinc-800 rounded-lg p-12 text-center text-slate-500">
                  <Upload className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                  <p className="text-xs font-mono text-slate-400">No active CSV parsed yet.</p>
                  <p className="text-[10px] text-slate-600 mt-1 max-w-sm mx-auto">Upload an eBay or Shopify CSV export file above, or click the **DEMO SKUS** button to immediately populate high-quality test assets.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-950/80">
              <button
                onClick={() => {
                  setImportPreview([]);
                }}
                disabled={importPreview.length === 0}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded text-xs font-mono transition-all disabled:opacity-50 cursor-pointer"
              >
                CLEAR PARSED PREVIEW
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportPreview([]);
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded text-xs font-mono transition-all cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={importPreview.length === 0 || loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-slate-100 px-6 py-2 rounded text-xs font-mono font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {loading ? "IMPORTING..." : `CONFIRM & SAVE (${importPreview.length} ITEMS)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
