import React, { useState, useEffect } from "react";
import {
  BookOpen, Search, Sparkles, Terminal, FileText, ChevronRight, Plus, Trash2, Database, Globe, Download, Copy, Check, RefreshCw
} from "lucide-react";

interface MemoryRecord {
  id: string;
  key: string;
  value: string;
  module: string;
  tags: string[];
  timestamp: string;
}

export default function KnowledgeCenter() {
  const [activeTab, setActiveTab] = useState<"search" | "sqlite" | "markdown">("search");
  
  // States for search tab
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<MemoryRecord[] | null>(null);
  
  // States for SQLite memory ledger tab
  const [memories, setMemories] = useState<MemoryRecord[]>([]);
  const [loadingMemories, setLoadingMemories] = useState<boolean>(false);
  const [isAddingMemory, setIsAddingMemory] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [newModule, setNewModule] = useState<string>("General");
  const [newTagsString, setNewTagsString] = useState<string>("rules, configuration");
  
  // States for Markdown tab
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [loadingMarkdown, setLoadingMarkdown] = useState<boolean>(false);
  const [copiedMd, setCopiedMd] = useState<boolean>(false);
  
  // Exporter state
  const [exporting, setExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Wiki Articles (kept for reference & static catalog)
  const [wikiArticles] = useState([
    { id: 1, title: "Ollama Port binding & local execution parameters", category: "AI INFRA", lastUpdated: "2 days ago", readTime: "4 mins" },
    { id: 2, title: "High-Ticket SaaS listing hooks & conversion pricing models", category: "MARKETING", lastUpdated: "Yesterday", readTime: "12 mins" },
    { id: 3, title: "Cloud Run container security audit procedures on port 3000", category: "DEV OPS", lastUpdated: "5 mins ago", readTime: "8 mins" },
    { id: 4, title: "StoryForge treatment structure guidelines & multi-act setup", category: "CREATIVE", lastUpdated: "3 weeks ago", readTime: "6 mins" }
  ]);

  // Load memories from backend SQLite database
  const fetchMemories = async () => {
    setLoadingMemories(true);
    try {
      const res = await fetch("/api/empire/memory");
      const data = await res.json();
      if (data.success) {
        setMemories(data.memories);
      }
    } catch (err) {
      console.error("Failed to fetch memories:", err);
    } finally {
      setLoadingMemories(false);
    }
  };

  // Load compiled Markdown content from backend
  const fetchMarkdownContent = async () => {
    setLoadingMarkdown(true);
    try {
      const res = await fetch("/api/empire/memory/markdown");
      const data = await res.json();
      if (data.success) {
        setMarkdownContent(data.markdown);
      }
    } catch (err) {
      console.error("Failed to fetch markdown memories:", err);
    } finally {
      setLoadingMarkdown(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  useEffect(() => {
    if (activeTab === "markdown") {
      fetchMarkdownContent();
    } else if (activeTab === "sqlite") {
      fetchMemories();
    }
  }, [activeTab]);

  const handleExportAIContext = async () => {
    setExporting(true);
    setExportSuccess(false);
    try {
      const response = await fetch("/api/export-ai-context");
      if (!response.ok) {
        throw new Error("Failed to export AI context.");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "EmpireOS_AI_Context.zip");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to compile or package the AI Context ZIP archive.");
    } finally {
      setExporting(false);
    }
  };

  // Real search on SQLite backend
  const handleSQLiteSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    try {
      const res = await fetch("/api/empire/memory/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Insert memory into SQLite
  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) {
      alert("Please fill in both key and value.");
      return;
    }

    const tags = newTagsString
      .split(",")
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    try {
      const res = await fetch("/api/empire/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: newKey.trim(),
          value: newValue.trim(),
          module: newModule,
          tags
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewKey("");
        setNewValue("");
        setNewTagsString("rules, configuration");
        setIsAddingMemory(false);
        fetchMemories();
        alert(`Memory keys successfully synced!`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Failed to save memory:", err);
    }
  };

  // Delete memory from SQLite
  const handleDeleteMemory = async (id: string, key: string) => {
    if (!confirm(`Are you sure you want to permanently erase memory key '${key}'?`)) return;
    try {
      const res = await fetch(`/api/empire/memory/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchMemories();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const copyMarkdownToClipboard = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 space-y-6 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="border-b border-zinc-850 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-mono font-black text-slate-200 uppercase tracking-tight">
              Sovereign Memory & Knowledge Center
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Store corporate wikis, platform rules, and metadata parameters. Search and update memories backed by a local SQLite 3 database and synchronized with Markdown dossiers.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-2.5 py-1 rounded flex items-center gap-1">
            <Database className="w-3 h-3 text-indigo-400" />
            SQLITE ACTIVE
          </span>
          <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-900/30 px-2.5 py-1 rounded">
            MARKDOWN LINKED
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-850">
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase transition border-b-2 cursor-pointer ${
            activeTab === "search"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          🔍 Search & Vector Match
        </button>
        <button
          onClick={() => setActiveTab("sqlite")}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase transition border-b-2 cursor-pointer ${
            activeTab === "sqlite"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          🗄️ SQLite Database Ledger
        </button>
        <button
          onClick={() => setActiveTab("markdown")}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase transition border-b-2 cursor-pointer ${
            activeTab === "markdown"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          📄 Live Compiled Markdown
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Content Pane (Col Span 7/8 depending on tab) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* TAB 1: SEARCH & VECTOR MATCH */}
          {activeTab === "search" && (
            <div className="bg-zinc-950/40 border border-zinc-850 rounded-lg p-5 space-y-4">
              <div>
                <span className="text-[9px] font-mono text-indigo-400 uppercase block font-bold">SQLite-Indexed Search Query</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Scan the local SQLite relational database for keywords, triggers, and values.
                </p>
              </div>
              
              <form onSubmit={handleSQLiteSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search memories by keyword, value, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono text-slate-250 placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={searching}
                  className="bg-indigo-650 hover:bg-indigo-600 text-white font-mono text-[10.5px] font-bold uppercase px-4 rounded-lg cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {searching ? "SCANNING..." : "SEARCH"}
                </button>
              </form>

              <div className="space-y-3.5 pt-2">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-1.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Matched SQLite Records</span>
                  {searchResults !== null && (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-1.5 py-0.5 rounded">
                      {searchResults.length} Records Found
                    </span>
                  )}
                </div>
                
                {searchResults === null ? (
                  <div className="text-center py-12 text-zinc-650 text-xs italic">
                    Enter a keyword or module name above and trigger the SQLite search query engine.
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-xs italic">
                    No matching records found in SQLite database. Let's write some records in the SQLite Ledger!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {searchResults.map((res, i) => (
                      <div key={i} className="bg-zinc-900/80 p-3.5 border border-zinc-800 rounded-lg space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200 uppercase">🔑 {res.key}</span>
                            <span className="text-indigo-400 bg-indigo-950/30 px-1.5 py-0.5 rounded border border-indigo-900/30 uppercase text-[8px]">
                              {res.module}
                            </span>
                          </div>
                          <span className="text-slate-500 text-[9px]">{new Date(res.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-350 leading-relaxed font-sans bg-zinc-950 p-2.5 rounded border border-zinc-850/60 text-[11px] whitespace-pre-wrap">{res.value}</p>
                        <div className="flex flex-wrap gap-1">
                          {res.tags.map((t, tid) => (
                            <span key={tid} className="text-[9px] font-mono text-slate-400 bg-zinc-850 px-1.5 py-0.5 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SQLITE LEDGER */}
          {activeTab === "sqlite" && (
            <div className="space-y-4">
              
              {/* Add Memory Button & Box */}
              {!isAddingMemory ? (
                <button
                  onClick={() => setIsAddingMemory(true)}
                  className="w-full bg-zinc-950 border border-dashed border-zinc-800 hover:border-indigo-500/50 p-4 rounded-lg flex items-center justify-center gap-2 text-xs font-mono text-slate-300 hover:text-indigo-400 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  WRITE NEW SQLITE KEY-VALUE RECORD
                </button>
              ) : (
                <form onSubmit={handleAddMemory} className="bg-zinc-950/80 border border-zinc-850 p-5 rounded-lg space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                    <span className="text-xs font-mono font-black text-slate-200 uppercase">Write SQLite Memory Node</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingMemory(false)}
                      className="text-xs text-slate-500 hover:text-rose-400 uppercase font-mono cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Unique Key identifier</label>
                      <input
                        type="text"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="e.g. storyforge_core_rules"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Module Category</label>
                      <select
                        value={newModule}
                        onChange={(e) => setNewModule(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                      >
                        <option value="General">General</option>
                        <option value="StoryForge">StoryForge</option>
                        <option value="CrossPost">CrossPost</option>
                        <option value="Boss Listers">Boss Listers</option>
                        <option value="Video Factory">Video Factory</option>
                        <option value="Orchestrator">Orchestrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Memory Value / Configuration Data</label>
                    <textarea
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Write precise details, instructions, or rules for LLM models to maintain consistency."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 h-[100px] resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={newTagsString}
                      onChange={(e) => setNewTagsString(e.target.value)}
                      placeholder="branding, rules, guidelines"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-2.5 rounded font-mono text-xs font-bold uppercase transition cursor-pointer"
                  >
                    COMMIT RECORD TO DATABASE & UPDATE MARKDOWN
                  </button>
                </form>
              )}

              {/* List of active SQLite memories */}
              <div className="bg-zinc-950/40 border border-zinc-850 rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                  <span className="text-xs font-mono font-black text-slate-200 uppercase">SQLite Master Records Ledger</span>
                  <button
                    onClick={fetchMemories}
                    className="p-1 rounded text-slate-500 hover:text-indigo-400 transition cursor-pointer"
                    title="Refresh Ledger"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingMemories ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {loadingMemories ? (
                  <div className="text-center py-12 text-indigo-400 font-mono text-xs animate-pulse">
                    Retrieving database ledger...
                  </div>
                ) : memories.length === 0 ? (
                  <div className="text-center py-12 text-zinc-600 italic text-xs">
                    No active unified memory records found inside local SQLite storage.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {memories.map((mem) => (
                      <div key={mem.id} className="bg-zinc-900 border border-zinc-850 rounded-lg p-3.5 flex justify-between items-start gap-4 hover:border-zinc-700 transition">
                        <div className="space-y-2 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-slate-200 truncate">🔑 {mem.key}</span>
                            <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-900/30 px-1.5 py-0.5 rounded uppercase">
                              {mem.module}
                            </span>
                            <span className="text-[8px] font-mono text-slate-500">{new Date(mem.timestamp).toLocaleString()}</span>
                          </div>
                          
                          <p className="text-[11px] font-sans text-slate-350 leading-relaxed bg-zinc-950 p-2.5 rounded border border-zinc-850/60 break-words whitespace-pre-wrap">
                            {mem.value}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {mem.tags.map((t, idx) => (
                              <span key={idx} className="text-[9px] font-mono text-slate-400 bg-zinc-850 px-1.5 py-0.5 rounded">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteMemory(mem.id, mem.key)}
                          className="p-1.5 bg-zinc-950 border border-zinc-850 rounded hover:bg-rose-950/40 hover:border-rose-900 text-slate-500 hover:text-rose-400 cursor-pointer transition shrink-0"
                          title="Erase Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: MARKDOWN LEDGER */}
          {activeTab === "markdown" && (
            <div className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
                <div>
                  <span className="text-xs font-mono font-black text-slate-200 uppercase">Synchronized Markdown Dossier</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Located at: <code className="text-slate-400">/EmpireOS/Knowledge/memory.md</code></p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={copyMarkdownToClipboard}
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-slate-300 hover:text-indigo-400 hover:border-indigo-900/30 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedMd ? "COPIED" : "COPY MD"}
                  </button>
                  <button
                    onClick={fetchMarkdownContent}
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-slate-300 hover:text-indigo-400 cursor-pointer"
                    title="Refresh Dossier"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingMarkdown ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {loadingMarkdown ? (
                <div className="text-center py-16 text-indigo-400 font-mono text-xs animate-pulse">
                  Compiling Markdown ledger...
                </div>
              ) : (
                <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-4 max-h-[450px] overflow-y-auto font-mono text-[10.5px] text-slate-300 leading-relaxed whitespace-pre-wrap select-text scrollbar-thin">
                  {markdownContent || "# No memories loaded yet. Add items in SQLite Ledger to sync."}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Col: Shared Wiki Catalog & Exporter (Col Span 4) */}
        <div className="lg:col-span-4 space-y-4">
          
          <h4 className="text-xs font-mono font-black text-slate-200 uppercase tracking-tight flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-zinc-500" />
            Static Wiki Manuals
          </h4>

          <div className="space-y-2.5 max-h-[250px] overflow-y-auto scrollbar-thin pr-1">
            {wikiArticles.map(art => (
              <div key={art.id} className="bg-zinc-950/60 border border-zinc-850 p-3.5 rounded-lg flex justify-between items-start hover:border-zinc-700 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono font-bold text-slate-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 uppercase">
                      {art.category}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono">Updated {art.lastUpdated}</span>
                  </div>
                  <strong className="text-xs font-sans text-slate-200 block leading-snug">{art.title}</strong>
                </div>
                
                <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap ml-2">
                  {art.readTime}
                </span>
              </div>
            ))}
          </div>

          {/* AI Context Export Box */}
          <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-zinc-950 border border-indigo-900/30 rounded-lg p-4 space-y-3 shadow-md">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                  AI Context Exporter
                </span>
                <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase bg-emerald-950/30 border border-emerald-900/30 px-1.5 py-0.5 rounded">
                  ZIP ARCHIVE
                </span>
              </div>
              <h5 className="text-xs font-black text-slate-200 mt-1">EMPIRE_SYSTEM_MANUAL PACK</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1">
                Packages the master system manual, SQLite memories, JSON maps, local model settings, and pipeline guides into a single ZIP archive to feed any LLM.
              </p>
            </div>

            <button
              onClick={handleExportAIContext}
              disabled={exporting}
              className={`w-full py-2.5 px-4 rounded-lg font-mono text-xs font-bold uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                exportSuccess
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              }`}
            >
              <Download className="w-4 h-4" />
              {exporting ? "PACKAGING ZIP..." : exportSuccess ? "CONTEXT DOWNLOADED!" : "EXPORT AI CONTEXT"}
            </button>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-850 rounded-lg p-3.5 space-y-2 text-xs">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-black block">Operational Note</span>
            <p className="text-slate-400 leading-normal text-[10.5px]">
              Every transaction committed to SQLite automatically formats and re-compiles the local Markdown file. This provides dual-layer persistent storage and high-fidelity file scraping capability for Oama or external agents.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
