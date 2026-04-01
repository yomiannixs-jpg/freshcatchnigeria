const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const FUNCTIONS_DIR = path.join(ROOT, "api", "functions");

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(ROOT, {
  extensions: ["html"],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith("sw.js")) res.setHeader("Cache-Control", "no-cache");
  }
}));

function loadHandler(name) {
  const safeName = name.replace(/[^a-zA-Z0-9-_]/g, "");
  const filePath = path.join(FUNCTIONS_DIR, `${safeName}.js`);
  if (!fs.existsSync(filePath)) return null;
  delete require.cache[require.resolve(filePath)];
  return require(filePath).handler;
}

function isAdminRoute(name) {
  return /^admin-/.test(name);
}

async function verifySupabaseToken(token) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

  if (!supabaseUrl || !anonKey) {
    return { ok: false, error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY" };
  }

  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.email) return { ok: false, error: data?.message || data?.msg || "Invalid token" };
  if (adminEmails.length && !adminEmails.includes(String(data.email).toLowerCase())) {
    return { ok: false, error: "Email is not allowed for admin access" };
  }
  return { ok: true, user: data };
}

async function runFunction(req, res, name) {
  const handler = loadHandler(name);
  if (!handler) return res.status(404).json({ error: `API route not found: ${name}` });

  let adminUser = null;
  if (isAdminRoute(name)) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return res.status(401).json({ error: "Missing admin bearer token" });
    const verified = await verifySupabaseToken(token);
    if (!verified.ok) return res.status(401).json({ error: verified.error || "Unauthorized" });
    adminUser = verified.user;
  }

  const event = {
    httpMethod: req.method,
    path: req.path,
    headers: req.headers,
    queryStringParameters: req.query || {},
    body: req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : "",
    rawUrl: req.originalUrl,
    adminUser
  };

  try {
    const result = await handler(event);
    const statusCode = result?.statusCode || 200;
    Object.entries(result?.headers || {}).forEach(([k, v]) => res.setHeader(k, v));
    const body = result?.body ?? "";
    if (typeof body === "string") {
      const ct = res.getHeader("Content-Type") || "";
      if (!ct && (body.startsWith("{") || body.startsWith("["))) res.type("application/json");
      return res.status(statusCode).send(body);
    }
    return res.status(statusCode).json(body);
  } catch (error) {
    console.error(`API route ${name} failed`, error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
}

app.all("/api/:name", (req, res) => runFunction(req, res, req.params.name));
app.get("/", (_req, res) => res.sendFile(path.join(ROOT, "index.html")));
app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.get("/:page", (req, res, next) => {
  const filePath = path.join(ROOT, `${req.params.page}.html`);
  if (fs.existsSync(filePath)) return res.sendFile(filePath);
  return next();
});
app.use((_req, res) => res.status(404).sendFile(path.join(ROOT, "index.html")));
app.listen(PORT, () => console.log(`FreshCatch NG running on ${PORT}`));
