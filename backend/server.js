const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config(); // ✅ loads .env

const app = express();
app.use(cors());
app.use(express.json());

// ✅ env-based config (safe for GitHub)
const PORT = Number(process.env.PORT || 3001);

const HF_TOKEN = process.env.HF_TOKEN; // ✅ from env
const HF_CHAT_MODEL = process.env.HF_CHAT_MODEL || "google/gemma-2-2b-it";

const db_config = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "products_db",
  port: Number(process.env.DB_PORT || 3306),
};

let db;

async function connectDB() {
  try {
    db = await mysql.createConnection(db_config);
    console.log("✅ MySQL connected");
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
}

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT 1 AS ok");
    res.json({ ok: true, db: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/seed", async (req, res) => {
  try {
    const products_from_dummy = await fetch("https://dummyjson.com/products");
    if (!products_from_dummy.ok) throw new Error("Failed to fetch products from DummyJson");

    const data = await products_from_dummy.json();
    const products = data.products || [];

    const sql_query = `
      INSERT INTO products (id, title, brand, category, price, thumbnail, raw_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title=VALUES(title),
        brand=VALUES(brand),
        category=VALUES(category),
        price=VALUES(price),
        thumbnail=VALUES(thumbnail),
        raw_json=VALUES(raw_json)
    `;

    for (const p of products) {
      const values = [
        p.id,
        p.title ?? null,
        p.brand ?? null,
        p.category ?? null,
        p.price ?? null,
        p.thumbnail ?? null,
        JSON.stringify(p),
      ];
      await db.execute(sql_query, values);
    }

    res.json({ ok: true, insertedOrUpdated: products.length });
  } catch (e) {
    console.error("Seed error:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      return res.status(400).json({ ok: false, error: "Invalid product id" });
    }

    const [rows] = await db.execute("SELECT raw_json FROM products WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ ok: false, error: "Product not found" });
    }

    const raw = rows[0].raw_json;
    const product = typeof raw === "string" ? JSON.parse(raw) : raw;

    return res.json({ ok: true, product });
  } catch (e) {
    console.error("GET /api/products/:id error:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

async function getProductById(productId) {
  const [rows] = await db.execute("SELECT raw_json FROM products WHERE id = ?", [productId]);
  if (!rows.length) return null;

  const raw = rows[0].raw_json;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

app.get("/api/products/:id/ai-summary", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const [rows] = await db.execute(
      "SELECT summary_json, model, updated_at FROM product_ai_summaries WHERE product_id = ?",
      [productId]
    );

    if (!rows.length) return res.status(404).json({ ok: false, error: "No summary yet" });

    const row = rows[0];
    const summary =
      typeof row.summary_json === "string" ? JSON.parse(row.summary_json) : row.summary_json;

    res.json({ ok: true, summary, meta: { model: row.model, updatedAt: row.updated_at } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/products/:id/ai-summary", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    // ✅ Require HF token only for generation endpoint
    if (!HF_TOKEN) {
      return res.status(500).json({ ok: false, error: "HF_TOKEN missing in server env" });
    }

    // 1) If already cached, return it
    const [cached] = await db.execute(
      "SELECT summary_json, model, updated_at FROM product_ai_summaries WHERE product_id = ?",
      [productId]
    );

    if (cached.length) {
      const row = cached[0];
      const summary = typeof row.summary_json === "string" ? JSON.parse(row.summary_json) : row.summary_json;
      return res.json({ ok: true, summary, cached: true });
    }

    // 2) Load product
    const product = await getProductById(productId);
    if (!product) return res.status(404).json({ ok: false, error: "Product not found" });

    const productText = `
Title: ${product.title ?? ""}
Brand: ${product.brand ?? ""}
Category: ${product.category ?? ""}
Price: ${product.price ?? ""}
Description: ${product.description ?? ""}
    `.trim();

    const system = "You are a helpful assistant for an e-commerce app. Be concise and neutral.";
    const user = `
Based ONLY on this product data, create a structured JSON summary.

Return JSON with EXACT keys:
{
  "one_liner": string,
  "pros": string[],
  "cons": string[],
  "best_for": string[]
}

Rules:
- pros: 2 to 5 items
- cons: 1 to 4 items
- best_for: 1 to 3 items
- No marketing fluff, no fake specs, be cautious if info missing.
- Output ONLY valid JSON. No extra text.

PRODUCT DATA:
${productText}
    `.trim();

    const hfRes = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: HF_CHAT_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: 350,
        temperature: 0.4,
      }),
    });

    const data = await hfRes.json();

    if (!hfRes.ok) {
      return res.status(500).json({
        ok: false,
        error: data?.error || "HF chat failed",
        details: data,
      });
    }

    const content = data?.choices?.[0]?.message?.content || "";

    let summary;
    try {
      summary = JSON.parse(content);
    } catch {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("AI did not return JSON");
      summary = JSON.parse(content.slice(start, end + 1));
    }

    await db.execute(
      `
      INSERT INTO product_ai_summaries (product_id, summary_json, provider, model)
      VALUES (?, ?, 'huggingface', ?)
      `,
      [productId, JSON.stringify(summary), HF_CHAT_MODEL]
    );

    res.json({ ok: true, summary, cached: false });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
