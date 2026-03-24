import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { exec } from 'child_process';
import FormData from "form-data";
import path from "path";
import { fileURLToPath } from "url"
import { Buffer } from 'buffer';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { requireAuth, validateAccessCode, generateSessionSecret, getSessionConfig } from './auth.js';
import { logEvent, usageMiddleware, getUsageLog, getUsageSummary, exportCSV } from './usage-logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   Phase 4: Security Hardening
========================= */

// ─── Upload safeguards ────────────────────────────
const ALLOWED_MIMETYPES = [
  'application/pdf',
  'image/png', 'image/jpeg', 'image/jpg', 'image/tiff',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/vnd.ms-excel', // xls
  'text/csv'
];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.log(`[SECURITY] Rejected file: ${file.originalname} (${file.mimetype})`);
      cb(new Error(`File type not allowed: ${file.mimetype}. Accepted: PDF, PNG, JPEG, TIFF, XLSX, CSV.`), false);
    }
  }
});

// Multer error handler (file too large, bad type, etc.)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.` });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err && err.message && err.message.startsWith('File type not allowed')) {
    return res.status(415).json({ error: err.message });
  }
  next(err);
});

// ─── Security headers ─────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');         // Prevent MIME sniffing
  res.setHeader('X-Frame-Options', 'DENY');                   // Prevent clickjacking
  res.setHeader('X-XSS-Protection', '1; mode=block');         // XSS filter
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.removeHeader('X-Powered-By');                           // Hide Express fingerprint
  next();
});

// ─── JSON body parser with size limit ─────────────
app.use(express.json({ limit: '1mb' }));

// ─── CORS middleware ──────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Session middleware (must come before auth)
const sessionSecret = process.env.SESSION_SECRET || generateSessionSecret();
app.use(session(getSessionConfig(sessionSecret)));

// Static files: only serve login page assets, logos, and stylesheets without auth
// The main app files (index.html, app-new.js) are served by explicit routes after auth
app.use('/logos', express.static(path.join(__dirname, 'public', 'logos')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/login.html', express.static(path.join(__dirname, 'public', 'login.html')));

/* =========================
   Health check (no auth)
========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "PIVOT proxy alive" });
});

/* =========================
   Auth routes (no auth required)
========================= */

// Login page
app.get("/login", (req, res) => {
  // If already authenticated, redirect to dashboard
  if (req.session && req.session.authenticated) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Login API
app.post("/api/auth/login", (req, res) => {
  const { access_code } = req.body;

  // Input validation: access code must be a non-empty string, max 50 chars, alphanumeric + hyphens
  if (!access_code || typeof access_code !== 'string' || access_code.length > 50) {
    return res.status(400).json({ success: false, error: 'Access code required' });
  }
  const sanitizedCode = access_code.replace(/[^A-Za-z0-9\-]/g, '');
  if (sanitizedCode !== access_code) {
    return res.status(400).json({ success: false, error: 'Invalid access code format' });
  }

  const client = validateAccessCode(sanitizedCode);

  if (!client) {
    console.log(`[AUTH] Failed login attempt with code: ${access_code.substring(0, 4)}****`);
    logEvent({ event_type: 'login_failed', detail: `Code: ${access_code.substring(0, 4)}****` });
    return res.status(401).json({ success: false, error: 'Invalid access code' });
  }

  if (client.expired) {
    console.log(`[AUTH] Expired access attempt: ${client.client_name}`);
    logEvent({ event_type: 'login_failed', client_id: client.client_id, client_name: client.client_name, detail: 'Expired' });
    return res.status(403).json({ success: false, expired: true, error: 'Access has expired' });
  }

  // Session regeneration on login (prevents session fixation attacks)
  req.session.regenerate((err) => {
    if (err) {
      console.error('[AUTH] Session regeneration failed:', err.message);
      return res.status(500).json({ success: false, error: 'Login failed, please retry' });
    }

    // Set session data
    req.session.authenticated = true;
    req.session.clientInfo = {
      client_id: client.client_id,
      client_name: client.client_name,
      role: client.role,
      allowed_modules: client.allowed_modules,
      rate_limit: client.rate_limit,
      expiry_date: client.expiry_date
    };

    // Session fingerprint: tie session to user-agent to detect hijacking
    req.session.fingerprint = crypto
      .createHash('sha256')
      .update(req.headers['user-agent'] || 'unknown')
      .digest('hex')
      .substring(0, 16);

    console.log(`[AUTH] Login successful: ${client.client_name} (${client.role})`);
    logEvent({ event_type: 'login', client_id: client.client_id, client_name: client.client_name, role: client.role });

    res.json({
      success: true,
      client_name: client.client_name,
      role: client.role,
      allowed_modules: client.allowed_modules
    });
  });
});

// Logout API
app.post("/api/auth/logout", (req, res) => {
  const clientName = req.session?.clientInfo?.client_name || 'Unknown';
  const clientId = req.session?.clientInfo?.client_id || null;
  logEvent({ event_type: 'logout', client_id: clientId, client_name: clientName });
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    console.log(`[AUTH] Logout: ${clientName}`);
    res.json({ success: true });
  });
});

// Session check API (frontend can call this to check auth state)
app.get("/api/auth/session", (req, res) => {
  if (req.session && req.session.authenticated) {
    res.json({
      authenticated: true,
      ...req.session.clientInfo
    });
  } else {
    res.json({ authenticated: false });
  }
});

/* =========================
   Auth middleware - everything below requires login
========================= */
app.use(requireAuth);

/* =========================
   Per-client rate limiting
========================= */
const clientRateLimiters = {};

function getClientRateLimiter(clientId, monthlyLimit) {
  if (!clientRateLimiters[clientId]) {
    clientRateLimiters[clientId] = rateLimit({
      windowMs: 30 * 24 * 60 * 60 * 1000,  // 30 days
      max: monthlyLimit || 100,
      keyGenerator: () => clientId,  // Rate limit by client_id, not IP
      message: { error: 'Monthly API limit exceeded. Contact sales to increase your quota.', code: 429 },
      standardHeaders: true,
      legacyHeaders: false
    });
  }
  return clientRateLimiters[clientId];
}

// Apply rate limiting to API endpoints
app.use('/api/portability', (req, res, next) => {
  if (!req.clientInfo) return next();
  getClientRateLimiter(req.clientInfo.client_id, req.clientInfo.rate_limit)(req, res, next);
});
app.use('/api/underwriting', (req, res, next) => {
  if (!req.clientInfo) return next();
  getClientRateLimiter(req.clientInfo.client_id, req.clientInfo.rate_limit)(req, res, next);
});
app.use('/api/ml_process', (req, res, next) => {
  if (!req.clientInfo) return next();
  getClientRateLimiter(req.clientInfo.client_id, req.clientInfo.rate_limit)(req, res, next);
});
app.use('/api/rfq', (req, res, next) => {
  if (!req.clientInfo) return next();
  getClientRateLimiter(req.clientInfo.client_id, req.clientInfo.rate_limit)(req, res, next);
});

/* =========================
   Module access gating
========================= */
// Maps API paths to module names (must match clients.json allowed_modules)
const ENDPOINT_MODULE_MAP = {
  '/api/portability': 'portability',
  '/api/ml_process': 'portability',
  '/ml_process': 'portability',
  '/api/underwriting': 'telemer',
  '/api/rfq': 'rfq'
};

function requireModule(req, res, next) {
  // Find which module this endpoint belongs to
  const matchedPath = Object.keys(ENDPOINT_MODULE_MAP).find(p => req.path.startsWith(p));
  if (!matchedPath) return next();  // Not a module-gated endpoint

  const requiredModule = ENDPOINT_MODULE_MAP[matchedPath];
  const allowed = req.clientInfo?.allowed_modules || [];

  if (!allowed.includes(requiredModule)) {
    console.log(`[ACCESS] BLOCKED: ${req.clientInfo?.client_name} tried ${req.path} (needs "${requiredModule}")`);
    logEvent({ event_type: 'module_blocked', client_id: req.clientInfo?.client_id, client_name: req.clientInfo?.client_name, role: req.clientInfo?.role, module: requiredModule, endpoint: req.path, method: req.method, status_code: 403 });
    return res.status(403).json({
      error: 'Module access denied',
      message: `Your account does not include the ${requiredModule} module. Contact sales to upgrade.`,
      required_module: requiredModule
    });
  }

  next();
}

// Apply module gating to all API routes
app.use(requireModule);

// Usage logging middleware — logs every API call that hits a proxy endpoint
app.use(usageMiddleware(ENDPOINT_MODULE_MAP));

/* =========================
   Dashboard (protected)
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inject session data into app-new.js so frontend knows which modules to show
app.get("/app-new.js", (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, "public", "app-new.js"));
});

// API endpoint for frontend to get session + module permissions
app.get("/api/auth/permissions", (req, res) => {
  res.json({
    client_name: req.clientInfo?.client_name || 'Unknown',
    role: req.clientInfo?.role || 'client',
    allowed_modules: req.clientInfo?.allowed_modules || [],
    rate_limit: req.clientInfo?.rate_limit || 100,
    expiry_date: req.clientInfo?.expiry_date || null
  });
});

/* =========================
   Admin routes (Super Admin only)
========================= */

// Admin guard helper
function requireAdmin(req, res, next) {
  if (!req.clientInfo || req.clientInfo.role !== 'super_admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Admin dashboard page
app.get("/admin", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// ─── Usage APIs ───────────────────────────────────

// GET /api/admin/usage — event log with optional filters
app.get("/api/admin/usage", requireAdmin, (req, res) => {
  const { client_id, event_type, from_date, to_date, limit } = req.query;
  const entries = getUsageLog({
    client_id,
    event_type,
    from_date,
    to_date,
    limit: limit ? parseInt(limit) : 200
  });
  res.json(entries);
});

// GET /api/admin/usage/summary — per-client aggregated stats
app.get("/api/admin/usage/summary", requireAdmin, (req, res) => {
  res.json(getUsageSummary());
});

// GET /api/admin/usage/export — CSV download
app.get("/api/admin/usage/export", requireAdmin, (req, res) => {
  const entries = getUsageLog();
  const csv = exportCSV(entries);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="pivot-usage-${new Date().toISOString().split('T')[0]}.csv"`);
  res.send(csv);
});

// ─── Client Management APIs ───────────────────────

// Helper: load/save clients.json
function loadClientsFile() {
  const data = readFileSync(path.join(__dirname, 'clients.json'), 'utf8');
  return JSON.parse(data);
}

function saveClientsFile(data) {
  writeFileSync(path.join(__dirname, 'clients.json'), JSON.stringify(data, null, 2), 'utf8');
}

function generateAccessCode(role) {
  const prefix = role === 'super_admin' ? 'PIVOT-ADM' : 'PIVOT-CLI';
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${rand}`;
}

// GET /api/admin/clients — list all clients
app.get("/api/admin/clients", requireAdmin, (req, res) => {
  const data = loadClientsFile();
  res.json(data.clients);
});

// POST /api/admin/clients — create new client
app.post("/api/admin/clients", requireAdmin, (req, res) => {
  const { client_name, role, allowed_modules, rate_limit, expiry_date } = req.body;

  if (!client_name) {
    return res.status(400).json({ success: false, error: 'Client name is required' });
  }

  const data = loadClientsFile();
  const clientId = client_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + crypto.randomBytes(2).toString('hex');
  const accessCode = generateAccessCode(role || 'client');

  const newClient = {
    client_id: clientId,
    client_name,
    access_code: accessCode,
    role: role || 'client',
    allowed_modules: allowed_modules || ['portability'],
    rate_limit: rate_limit || 100,
    expiry_date: expiry_date || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true
  };

  data.clients.push(newClient);
  saveClientsFile(data);

  console.log(`[ADMIN] Client created: ${client_name} (${clientId}) by ${req.clientInfo.client_name}`);
  logEvent({ event_type: 'api_call', client_id: req.clientInfo.client_id, client_name: req.clientInfo.client_name, role: 'super_admin', module: 'admin', endpoint: '/api/admin/clients', method: 'POST', detail: `Created client: ${client_name}` });

  res.json({ success: true, client: newClient, access_code: accessCode });
});

// PUT /api/admin/clients/:id — update client
app.put("/api/admin/clients/:id", requireAdmin, (req, res) => {
  const data = loadClientsFile();
  const idx = data.clients.findIndex(c => c.client_id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Client not found' });
  }

  const updates = req.body;
  const allowed = ['client_name', 'role', 'allowed_modules', 'rate_limit', 'expiry_date', 'active'];
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      data.clients[idx][key] = updates[key];
    }
  }

  saveClientsFile(data);

  console.log(`[ADMIN] Client updated: ${data.clients[idx].client_name} by ${req.clientInfo.client_name}`);
  logEvent({ event_type: 'api_call', client_id: req.clientInfo.client_id, client_name: req.clientInfo.client_name, role: 'super_admin', module: 'admin', endpoint: `/api/admin/clients/${req.params.id}`, method: 'PUT', detail: `Updated client: ${data.clients[idx].client_name}` });

  res.json({ success: true, client: data.clients[idx] });
});

/* =========================
   PIVOT Portability Demo Analysis
========================= */
app.post("/api/ml_process", upload.single('input_file'), async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error. Contact administrator.' });
    }

    const externalFormData = new FormData();
    if (req.file) {
      externalFormData.append('input_file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
      console.log(`[API] ml_process file: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB) by ${req.clientInfo?.client_name}`);
    }

    externalFormData.append('insurance_company', 'STAR HEALTH');
    externalFormData.append('data_type', 'specific');

    const response = await fetch('https://PIVOT-Port-PolDoc-Health.Attributum.com/api/ml_process', {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${apiKey}`,
        ...externalFormData.getHeaders()
      },
      body: externalFormData.getBuffer()
    });

    console.log(`[API] ml_process response: ${response.status}`);

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: `API processing error (${response.status})` });
    }

    res.json(data);
  } catch (error) {
    console.error('[API] ml_process proxy error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* =========================
   PIVOT Portability Demo Analysis
========================= */
app.post("/api/portability/analyze", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`[API] portability/analyze: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB) by ${req.clientInfo?.client_name}`);

    const form = new FormData();
    form.append('input_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    form.append('insurance_company', 'demo');
    form.append('data_type', 'specific');

    const response = await fetch("https://PIVOT-Port-PolDoc-Health.Attributum.com/api/ml_process", {
      method: "POST",
      headers: {
        'Authorization': `Api-Key ${process.env.API_KEY}`,
        ...form.getHeaders()
      },
      body: form
    });

    console.log(`[API] portability/analyze response: ${response.status}`);

    if (!response.ok) {
      return res.status(response.status).json({ error: `API processing error (${response.status})` });
    }

    const result = await response.json();
    res.json(result);

  } catch (error) {
    console.error('[API] portability/analyze error:', error.message);
    res.status(500).json({ error: "Processing error. Please try again." });
  }
});

/* =========================
   PIVOT Portability Proxy
========================= */
app.post("/api/portability/upload", upload.single("input_file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Input validation: insurance_company is required
    const insurer = req.body.insurance_company;
    if (!insurer || typeof insurer !== 'string' || insurer.length > 100) {
      return res.status(400).json({ error: "Valid insurance company name is required" });
    }

    console.log(`[API] portability/upload: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB) insurer=${insurer} by ${req.clientInfo?.client_name}`);

    const form = new FormData();
    form.append('input_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    form.append('insurance_company', insurer);
    form.append('data_type', 'specific');

    const response = await fetch("https://PIVOT-Port-PolDoc-Health.Attributum.com/api/ml_process", {
      method: "POST",
      headers: {
        'Authorization': `Api-Key ${process.env.API_KEY}`,
        ...form.getHeaders()
      },
      body: form
    });

    console.log(`[API] portability/upload response: ${response.status}`);

    if (!response.ok) {
      return res.status(response.status).json({ error: `API processing error (${response.status})` });
    }

    const result = await response.json();
    res.json(result);

  } catch (error) {
    console.error('[API] portability/upload error:', error.message);
    res.status(500).json({ error: "Processing error. Please try again." });
  }
});

/* =========================
   ML proxy endpoint
========================= */
app.post("/ml_process", upload.single("input_file"), (req, res) => {
  console.log(`[API] ml_process (mock): ${req.file?.originalname || 'no file'} by ${req.clientInfo?.client_name}`);

  // Return working mock data for demo
  const mockResponse = {
    response: {
      data: {
        proposer_details: {
          first_name: "Demo",
          last_name: "User",
          dob: "01/01/1990"
        },
        policy_and_coverage_details: {
          policy_start_date: "01/01/2024",
          policy_end_date: "31/12/2024",
          policy_number: "POL123456",
          floater_basic_sum_insured: "500000",
          floater_cumulative_bonus: "25%",
          previous_claims: "No"
        },
        insured_details: [
          {
            insured_name: "Demo User",
            declared_ped: "None"
          }
        ]
      }
    }
  };

  res.json(mockResponse);
});


/* =========================
   PIVOT Underwriting CoPilot (TeleMER) Proxy
========================= */
app.post("/api/underwriting/analyze", upload.single("input_file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const apiKey = process.env.TELEMER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server configuration error. Contact administrator." });
    }

    const insurer = req.body.insurance_company || 'telemer_hdfcergo';
    console.log(`[API] underwriting/analyze: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB) insurer=${insurer} by ${req.clientInfo?.client_name}`);

    const form = new FormData();
    form.append("input_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    form.append("insurance_company", insurer);

    const response = await fetch("https://pivot-uwcopilot-telemer-health.attributum.com/api/ml_process", {
      method: "POST",
      headers: {
        "Authorization": `Api-Key ${apiKey}`,
        ...form.getHeaders()
      },
      body: form.getBuffer()
    });

    console.log(`[API] underwriting/analyze response: ${response.status}`);

    if (!response.ok) {
      const errDetail = response.status === 401 ? 'TeleMER API authentication failed. The API key may be expired or invalid. Please check TELEMER_API_KEY in .env.' :
                         response.status === 403 ? 'TeleMER API access forbidden. Check API permissions.' :
                         `TeleMER API error (HTTP ${response.status})`;
      console.error(`[API] underwriting/analyze upstream error: ${response.status} - ${errDetail}`);
      return res.status(502).json({ error: errDetail });
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("[API] underwriting/analyze error:", error.message);
    res.status(500).json({ error: "Processing error. Please try again." });
  }
});

/* =========================
   RFQ Extraction (stub with sample data for UI testing)
========================= */
app.post("/api/rfq/extract", upload.single("input_file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log(`[API] rfq/extract - file: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

    // TODO: Replace with actual extraction API call
    // For now, return sample extracted data to test UI
    const sampleData = {
      companyDetails: {
        company_name: { value: 'Acme Technologies Pvt Ltd', status: 'extracted' },
        industry: { value: 'Information Technology', status: 'extracted' },
        company_address: { value: '2nd Floor, Tower B, Cyber City, Gurgaon 122002', status: 'extracted' },
        gstin: { value: null, status: 'missing', note: 'GSTIN not found in document' },
        contact_person: { value: 'Rahul Mehra (HR Head)', status: 'extracted' },
        contact_email: { value: 'rahul.mehra@acmetech.in', status: 'extracted' },
        contact_phone: { value: null, status: 'clarification', note: 'Multiple phone numbers found — confirm primary contact' },
      },
      policyRequirements: {
        policy_type: { value: 'GMC (Group Mediclaim)', status: 'extracted' },
        policy_start_date: { value: '01-Apr-2026', status: 'extracted' },
        policy_end_date: { value: '31-Mar-2027', status: 'extracted' },
        sum_insured_basis: { value: 'Graded', status: 'extracted' },
        sum_insured_values: { value: 'Grade A: 5L, Grade B: 3L, Grade C: 2L', status: 'extracted' },
        room_rent_limit: { value: 'Single AC Room', status: 'extracted' },
        maternity_cover: { value: null, status: 'clarification', note: 'Document mentions maternity but limits not specified' },
        opd_cover: { value: 'Not Required', status: 'extracted' },
        pre_existing_cover: { value: null, status: 'clarification', note: 'PED cover mentioned but waiting period unclear' },
        waiting_period: { value: null, status: 'missing' },
        co_pay: { value: 'Nil', status: 'extracted' },
        sublimits: { value: null, status: 'missing', note: 'No sub-limit details found' },
      },
      demographics: {
        total_lives: { value: '342', status: 'extracted' },
        employee_count: { value: '156', status: 'extracted' },
        spouse_count: { value: '120', status: 'extracted' },
        child_count: { value: '66', status: 'extracted' },
        parent_count: { value: null, status: 'clarification', note: 'Parent cover requested but count not provided' },
        average_age: { value: '33.5 years', status: 'extracted' },
        age_band_distribution: { value: '18-25: 42, 26-35: 78, 36-45: 56, 46-55: 34, 55+: 12', status: 'extracted' },
        male_female_ratio: { value: '68:32', status: 'extracted' },
      },
      existingPolicy: {
        existing_insurer: { value: 'ICICI Lombard', status: 'extracted' },
        existing_policy_number: { value: null, status: 'missing' },
        existing_premium: { value: '18,50,000', status: 'extracted' },
        existing_sum_insured: { value: '3L - 5L (Graded)', status: 'extracted' },
        claims_ratio: { value: '72%', status: 'extracted' },
        claims_count: { value: '38', status: 'extracted' },
        large_claims: { value: null, status: 'clarification', note: 'Document references large claims but amounts not detailed' },
        renewal_date: { value: '01-Apr-2026', status: 'extracted' },
      },
      brokerDetails: {
        broker_name: { value: 'Marsh India Insurance Brokers', status: 'extracted' },
        broker_contact: { value: null, status: 'missing' },
        broker_license: { value: null, status: 'missing' },
      },
      specialConditions: {
        exclusions: { value: null, status: 'missing' },
        endorsements: { value: 'Day 1 PED Cover requested for Grade A', status: 'clarification', note: 'Confirm if this applies to all members or only new joiners' },
        additional_notes: { value: 'Corporate buffer of 10% requested. Cashless facility at all network hospitals mandatory.', status: 'extracted' },
      }
    };

    // Simulate a brief processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    res.json(sampleData);

  } catch (error) {
    console.error("[API] rfq/extract error:", error.message);
    res.status(500).json({ error: "Processing error. Please try again." });
  }
});

/* =========================
   Start server
========================= */
app.listen(PORT, () => {
  console.log(`PIVOT proxy running on port ${PORT}`);
  console.log(`[AUTH] Authentication enabled. Login at http://localhost:${PORT}/login`);
});
