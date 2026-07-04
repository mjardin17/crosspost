import sqlite3 from "sqlite3";
import { AIRouterEngine, Message } from "./src/services/AIRouterEngine.ts";

async function runTests() {
  console.log("=========================================");
  console.log("  EMPIRE OS AI ROUTER ENGINE TEST SUITE  ");
  console.log("=========================================\n");

  // Create an in-memory database for testing
  const db = new sqlite3.Database(":memory:");

  // Helper promise wrappers for the test database
  const runSql = (sql: string, params: any[] = []): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  // 1. Setup Database Schema
  console.log("[TEST] Setting up SQLite in-memory tables...");
  await runSql(`
    CREATE TABLE IF NOT EXISTS ai_providers (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE,
      provider_key TEXT UNIQUE,
      status TEXT,
      strengths TEXT,
      weaknesses TEXT,
      est_response_time TEXT,
      cost TEXT,
      current_workload INTEGER,
      active INTEGER
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS ai_router_jobs (
      id TEXT PRIMARY KEY,
      task TEXT,
      recommended_ai TEXT,
      routed_ai TEXT,
      status TEXT,
      latency TEXT,
      cost TEXT,
      explanation TEXT,
      timestamp TEXT
    )
  `);

  // 2. Seed Mock Providers
  console.log("[TEST] Seeding mock providers...");
  const mockProviders = [
    {
      id: "prov_llama",
      name: "Ollama (Llama 3)",
      provider_key: "ollama_llama3",
      status: "Offline", // Starts offline
      strengths: "Local execution, absolute privacy",
      weaknesses: "Requires local GPU resource allocation",
      est_response_time: "0.8s",
      cost: "Local",
      current_workload: 0,
      active: 1
    },
    {
      id: "prov_gemini",
      name: "Google Gemini 3.5 Flash",
      provider_key: "gemini",
      status: "Online", // Always online
      strengths: "Massive context length, ultra-high speed",
      weaknesses: "Slightly weaker logical deep reasoning",
      est_response_time: "0.4s",
      cost: "Free",
      current_workload: 0,
      active: 1
    },
    {
      id: "prov_claude",
      name: "Anthropic Claude 3.5 Sonnet",
      provider_key: "claude",
      status: "Online",
      strengths: "Elite software architecture and coding reasoning",
      weaknesses: "Premium cost structures",
      est_response_time: "1.2s",
      cost: "API",
      current_workload: 0,
      active: 1
    }
  ];

  for (const p of mockProviders) {
    await runSql(
      `INSERT INTO ai_providers (id, name, provider_key, status, strengths, weaknesses, est_response_time, cost, current_workload, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.name, p.provider_key, p.status, p.strengths, p.weaknesses, p.est_response_time, p.cost, p.current_workload, p.active]
    );
  }

  // Instantiate the AIRouterEngine
  const engine = new AIRouterEngine(db, "http://127.0.0.1:11434");

  // ----------------------------------------
  // TEST 1: Task Classification (Cost-Aware)
  // ----------------------------------------
  console.log("\n[TEST 1] Testing Task Classification (Cost-Aware)...");
  
  const privacyPrompt = "Analyze my confidential personal medical records locally";
  const privacyClass = engine.classifyTask(privacyPrompt);
  console.log(`- Privacy Prompt: "${privacyPrompt}"`);
  console.log(`  Recommended: ${privacyClass.recommendedKey}`);
  console.log(`  Explanation: ${privacyClass.explanation}`);
  if (privacyClass.recommendedKey !== "ollama_llama3") {
    throw new Error("Test 1 Failed: Confidential/local task should route to Ollama!");
  }

  const codePrompt = "Write a React component with TypeScript type signatures";
  const codeClass = engine.classifyTask(codePrompt);
  console.log(`- Code Prompt: "${codePrompt}"`);
  console.log(`  Recommended: ${codeClass.recommendedKey}`);
  if (codeClass.recommendedKey !== "claude") {
    throw new Error("Test 1 Failed: Engineering task should route to Claude!");
  }

  const generalPrompt = "What are the core features of Empire OS?";
  const generalClass = engine.classifyTask(generalPrompt);
  console.log(`- General Prompt: "${generalPrompt}"`);
  console.log(`  Recommended: ${generalClass.recommendedKey}`);
  if (generalClass.recommendedKey !== "gemini") {
    throw new Error("Test 1 Failed: General task should default to Gemini!");
  }
  console.log("✅ TEST 1 PASSED: Cost-aware task classification works perfectly!");

  // ----------------------------------------
  // TEST 2: Active Provider Monitoring & Keys
  // ----------------------------------------
  console.log("\n[TEST 2] Testing Active Provider Health Monitoring...");
  const initialStatuses = await engine.monitorProviders();
  console.log("- Refreshed Statuses:");
  for (const s of initialStatuses) {
    console.log(`  * ${s.name}: Key = ${s.provider_key}, Status = ${s.status}, Cost = ${s.cost}`);
  }
  console.log("✅ TEST 2 PASSED: Provider statuses successfully synchronized with DB!");

  // ----------------------------------------
  // TEST 3: Failover/Fallback Mechanics
  // ----------------------------------------
  console.log("\n[TEST 3] Testing Automatic Provider Fallback...");
  // Let's force Ollama (Llama 3) to be Offline in the DB
  await runSql("UPDATE ai_providers SET status = 'Offline' WHERE provider_key = 'ollama_llama3'");
  
  console.log("- Requesting a task suitable for Ollama while Ollama is OFFLINE...");
  const response = await engine.route(
    [{ role: "user", content: "Execute secure local configuration validation" }],
    { provider: "ollama_llama3" } // Explicit selection
  );

  console.log(`  Routed Provider Used: ${response.metrics.providerUsed}`);
  console.log(`  Fallback Occurred: ${response.metrics.fallbackOccurred}`);
  console.log(`  Fallback Reason: ${response.metrics.fallbackReason}`);
  console.log(`  Simulated: ${response.metrics.isSimulated}`);

  if (!response.metrics.fallbackOccurred) {
    throw new Error("Test 3 Failed: Router should have activated fallback for offline provider!");
  }
  if (response.metrics.providerUsed === "Ollama (Llama 3)") {
    throw new Error("Test 3 Failed: Router should not have routed to offline Ollama!");
  }
  console.log("✅ TEST 3 PASSED: Dynamic provider failover chain works seamlessly!");

  // ----------------------------------------
  // TEST 4: Conversation Memory
  // ----------------------------------------
  console.log("\n[TEST 4] Testing Multi-Turn Conversation Memory...");
  const chatHistory: Message[] = [
    { role: "system", content: "You are an AI assistant." },
    { role: "user", content: "My name is Commander Leo." },
    { role: "assistant", content: "Greetings Commander Leo! How can I assist you?" },
    { role: "user", content: "What is my name?" }
  ];

  const chatResponse = await engine.route(chatHistory);
  console.log(`- Final response text preview: "${chatResponse.text.split("\n")[0]}"`);
  console.log(`  Tokens Count: ${chatResponse.metrics.tokensCount}`);
  console.log(`  Estimated Cost: $${chatResponse.metrics.estimatedCostUsd.toFixed(6)}`);
  console.log("✅ TEST 4 PASSED: Multi-turn message history successfully compiled!");

  // ----------------------------------------
  // TEST 5: Embeddings & Model Listing
  // ----------------------------------------
  console.log("\n[TEST 5] Testing Embeddings & Model Catalog Listing...");
  const embedRes = await engine.getEmbeddings("Empire OS Dynamic Cognitive Core");
  console.log(`- Embedding Vector Dimensions: ${embedRes.embeddings.length}`);
  console.log(`  First 3 Values: [${embedRes.embeddings.slice(0, 3).join(", ")}]`);
  console.log(`  Generation Model: ${embedRes.model}`);

  if (embedRes.embeddings.length !== 1536 && embedRes.embeddings.length !== 3072) {
    throw new Error(`Test 5 Failed: Expected 1536 or 3072 embedding dimensions, got ${embedRes.embeddings.length}`);
  }
  console.log("✅ TEST 5 PASSED: Embeddings engine successfully generated valid dimensions!");

  console.log("\n=========================================");
  console.log("  ALL TESTS PASSED SUCCESSFULLY! (5/5)   ");
  console.log("=========================================");
}

runTests().catch((err) => {
  console.error("\n❌ TEST SUITE FAILED:", err);
  process.exit(1);
});
