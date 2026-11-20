import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { exec, spawn } from 'child_process';
import FormData from "form-data";
import path from "path";
import { fileURLToPath } from "url"
import { Buffer } from 'buffer';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readFile, unlink } from 'fs';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import os from 'os';
import { requireAuth, validateAccessCode, generateSessionSecret, getSessionConfig } from './auth.js';
import { logEvent, usageMiddleware, getUsageLog, getUsageSummary, exportCSV } from './usage-logger.js';
import { extractRfqData, saveCorrection, getCorrectionStats } from './rfq-extractor.js';
import { verifyEducationDocument, getProspectById, getAllProspects } from './education-verifier.js';
import XLSX from 'xlsx';

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
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/msword' // doc
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

// Template files with proper download headers for Excel files
app.use('/templates', (req, res, next) => {
  if (req.url.endsWith('.xlsx') || req.url.endsWith('.xls')) {
    res.setHeader('Content-Disposition', `attachment; filename="${req.url.split('/').pop()}"`);
  }
  next();
}, express.static(path.join(__dirname, 'public', 'templates')));

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

// GET /api/templates/download/vendor — download vendor mapping template (no auth required)
app.get('/api/templates/download/vendor', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'templates', 'Vendor_Mapping_Template.xlsx');
  res.setHeader('Content-Disposition', 'attachment; filename="Vendor_Mapping_Template.xlsx"');
  res.download(filePath, 'Vendor_Mapping_Template.xlsx', (err) => {
    if (err && !res.headersSent) {
      console.error('[API] template download error:', err.message);
      res.status(404).json({ error: 'Template file not found' });
    }
  });
});

// GET /api/templates/download/branch — download branch mapping template (no auth required)
app.get('/api/templates/download/branch', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'templates', 'Branch_Mapping_Template.xlsx');
  res.setHeader('Content-Disposition', 'attachment; filename="Branch_Mapping_Template.xlsx"');
  res.download(filePath, 'Branch_Mapping_Template.xlsx', (err) => {
    if (err && !res.headersSent) {
      console.error('[API] template download error:', err.message);
      res.status(404).json({ error: 'Template file not found' });
    }
  });
});

/* =========================
   Invoice Download Endpoints (must be before global auth middleware)
========================= */

// POST /api/invoices/test-download — simple public test endpoint
app.post('/api/invoices/test-download', (req, res) => {
  console.log('>>> TEST DOWNLOAD ENDPOINT CALLED');
  try {
    const ws = XLSX.utils.aoa_to_sheet([['Test', 'Data'], ['Hello', 'World']]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Test');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="test.xlsx"');
    res.send(buf);
  } catch (error) {
    console.error('>>> Test download error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/invoices/download — generate Excel from extracted invoices
app.post('/api/invoices/download', (req, res) => {
  console.log('[INVOICE DOWNLOAD] Request received');
  console.log('[INVOICE DOWNLOAD] Body:', JSON.stringify(req.body).substring(0, 200));

  try {
    const invoices = Array.isArray(req.body?.invoices) ? req.body.invoices : [];
    console.log('[INVOICE DOWNLOAD] Invoices count:', invoices.length);

    if (invoices.length === 0) {
      console.log('[INVOICE DOWNLOAD] No invoices provided in body');
      return res.status(400).json({ error: 'No invoices provided' });
    }

    const tempFile = path.join(os.tmpdir(), `invoice_${Date.now()}.xlsx`);
    const jsonData = JSON.stringify(invoices);

    console.log('[INVOICE DOWNLOAD] Temp file path:', tempFile);
    console.log('[INVOICE DOWNLOAD] Spawning Python process...');

    const python = spawn('python3', [
      path.join(__dirname, 'invoice-to-journal.py'),
      tempFile,
      jsonData
    ]);

    let pythonError = '';

    python.on('close', (code) => {
      console.log('[INVOICE DOWNLOAD] Python process closed with code:', code);

      if (code !== 0) {
        console.error('[INVOICE DOWNLOAD] Python error:', pythonError);
        return res.status(500).json({ error: 'Failed to generate Excel: ' + pythonError });
      }

      readFile(tempFile, (err, data) => {
        if (err) {
          console.error('[INVOICE DOWNLOAD] Failed to read temp file:', err.message);
          return res.status(500).json({ error: 'Failed to read generated file: ' + err.message });
        }

        console.log('[INVOICE DOWNLOAD] File read successfully, size:', data.length);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="Invoice_JournalEntry.xlsx"');
        res.send(data);

        unlink(tempFile, () => {
          console.log('[INVOICE DOWNLOAD] Temp file deleted');
        });
      });
    });

    python.stderr.on('data', (data) => {
      pythonError += data.toString();
      console.error('[PYTHON STDERR]', data.toString());
    });

    python.stdout.on('data', (data) => {
      console.log('[PYTHON STDOUT]', data.toString());
    });

  } catch (error) {
    console.error('[INVOICE DOWNLOAD] Exception caught:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
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
   RFQ Corrections (self-learning loop)
========================= */
app.post("/api/rfq/corrections", requireAuth, async (req, res) => {
  try {
    const { clientId, clientName, fieldKey, sectionKey, originalValue, correctedValue, documentHash } = req.body;
    if (!fieldKey || !sectionKey || correctedValue === undefined) {
      return res.status(400).json({ error: "fieldKey, sectionKey and correctedValue are required." });
    }
    await saveCorrection({
      clientId: clientId || req.clientInfo?.client_id || 'unknown',
      clientName: clientName || req.clientInfo?.client_name || 'unknown',
      fieldKey,
      sectionKey,
      originalValue: originalValue ?? null,
      correctedValue,
      documentHash: documentHash || null
    });
    console.log(`[API] rfq/corrections - saved: ${sectionKey}.${fieldKey} by ${req.clientInfo?.client_name}`);
    res.json({ ok: true });
  } catch (error) {
    console.error("[API] rfq/corrections error:", error.message);
    res.status(500).json({ error: "Failed to save correction." });
  }
});

app.get("/api/rfq/corrections/stats", requireAuth, async (req, res) => {
  try {
    const stats = await getCorrectionStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve correction stats." });
  }
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
   RFQ Extraction (AI-powered with self-learning corrections loop)
========================= */
app.post("/api/rfq/extract", (req, res, next) => {
  upload.array("input_files", 10)(req, res, (err) => {
    if (err) {
      console.error("[API] rfq/extract multer error:", err.message);
      return res.status(400).json({ error: err.message || "File upload failed. Check file type and size." });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    req.files.forEach(f => console.log(`[API] rfq/extract - file: ${f.originalname} (${(f.size / 1024).toFixed(1)} KB)`));
    console.log(`[API] rfq/extract - ${req.files.length} file(s) total, client: ${req.clientInfo?.client_name}`);

    // Check if AI keys are configured; fall back to stub if neither is present
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

    if (!hasOpenAI && !hasAnthropic) {
      console.warn("[API] rfq/extract - No AI keys configured (OPENAI_API_KEY / ANTHROPIC_API_KEY). Returning sample data.");
      return res.status(503).json({
        error: "AI extraction is not yet configured. Please add OPENAI_API_KEY or ANTHROPIC_API_KEY to your .env file and restart the server."
      });
    }

    // Run real AI extraction
    const result = await extractRfqData(req.files);
    console.log(`[API] rfq/extract - extraction complete via ${result._meta?.provider || 'unknown'}, pool=${result._meta?.correctionPoolSize}`);
    res.json(result);

  } catch (error) {
    console.error("[API] rfq/extract error:", error.message, error.stack);
    res.status(500).json({ error: `Processing error: ${error.message}` });
  }
});

/* =========================
   RFQ Excel Export
========================= */
app.post("/api/rfq/export-excel", requireAuth, (req, res) => {
  try {
    const { quoteMode, sections } = req.body;
    if (!sections) return res.status(400).json({ error: 'No data to export' });

    const wb = XLSX.utils.book_new();

    // Create a summary sheet with all sections
    const summaryRows = [
      ['PIVOT RFQ Extraction Report'],
      ['Quote Type', quoteMode === 'fresh' ? 'Fresh Quote' : 'Renewal Quote'],
      ['Exported At', new Date().toISOString()],
      ['Exported By', req.clientInfo?.client_name || 'Unknown'],
      [],
      ['Section', 'Field', 'Value', 'Status']
    ];

    Object.entries(sections).forEach(([sectionKey, section]) => {
      const sectionRows = [
        ['Field Name', 'Extracted Value', 'Status']
      ];
      Object.entries(section.fields).forEach(([fieldKey, field]) => {
        sectionRows.push([field.label, field.value || '', field.status || 'missing']);
        summaryRows.push([section.label, field.label, field.value || '', field.status || 'missing']);
      });

      // Create a sheet per section (sheet name max 31 chars)
      const sheetName = section.label.substring(0, 31);
      const ws = XLSX.utils.aoa_to_sheet(sectionRows);
      ws['!cols'] = [{ wch: 35 }, { wch: 40 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    // Add summary sheet at the beginning
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryRows);
    summaryWs['!cols'] = [{ wch: 30 }, { wch: 35 }, { wch: 40 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary', true);

    // Move Summary to first position
    const sheetNames = wb.SheetNames;
    const summaryIdx = sheetNames.indexOf('Summary');
    if (summaryIdx > 0) {
      sheetNames.splice(summaryIdx, 1);
      sheetNames.unshift('Summary');
    }

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="RFQ_Extract_${quoteMode || 'data'}_${new Date().toISOString().slice(0,10)}.xlsx"`);
    res.send(Buffer.from(buffer));

    console.log(`[API] rfq/export-excel - exported by ${req.clientInfo?.client_name}, mode: ${quoteMode}`);
  } catch (error) {
    console.error("[API] rfq/export-excel error:", error.message);
    res.status(500).json({ error: 'Excel export failed' });
  }
});

/* =========================
   Intermediary Management — ARM + Education Verification
========================= */

// Rate limiter for education endpoints (vision calls are expensive)
const eduRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Too many verification requests. Please wait a moment.' },
});

// GET /api/intermediary/arm/prospects — list all prospects (for dropdown/search)
app.get('/api/intermediary/arm/prospects', requireAuth, (req, res) => {
  try {
    const prospects = getAllProspects();
    // Return lightweight list (no _scenario field for production-style)
    const list = prospects.map(p => ({
      prospect_id: p.prospect_id,
      name: p.name,
      claimed_qualification: p.claimed_qualification,
      branch: p.branch,
      agent_type: p.agent_type,
      status: p.status,
    }));
    res.json({ prospects: list, total: list.length });
  } catch (err) {
    console.error('[API] arm/prospects error:', err.message);
    res.status(500).json({ error: 'Failed to load ARM data' });
  }
});

// GET /api/intermediary/arm/prospect/:id — fetch single prospect record
app.get('/api/intermediary/arm/prospect/:id', requireAuth, (req, res) => {
  try {
    const prospect = getProspectById(req.params.id);
    if (!prospect) {
      return res.status(404).json({ error: `Prospect ID "${req.params.id}" not found in ARM system` });
    }
    // Strip internal _scenario annotation before sending to client
    const { _scenario, ...record } = prospect;
    res.json(record);
  } catch (err) {
    console.error('[API] arm/prospect error:', err.message);
    res.status(500).json({ error: 'Failed to load prospect data' });
  }
});

// POST /api/intermediary/education/verify — upload image + prospect ID → extraction + rules
app.post('/api/intermediary/education/verify', requireAuth, eduRateLimit, (req, res, next) => {
  upload.single('document')(req, res, async (multerErr) => {
    if (multerErr) {
      return res.status(400).json({ error: multerErr.message });
    }

    const { prospect_id, arm_record_override } = req.body;
    const armOverride = arm_record_override ? JSON.parse(arm_record_override) : null;

    if (!prospect_id) {
      return res.status(400).json({ error: 'prospect_id is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Document image is required' });
    }

    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;

    if (!hasAnthropic && !hasOpenAI) {
      return res.status(503).json({
        error: 'AI extraction not configured. Add ANTHROPIC_API_KEY or OPENAI_API_KEY to .env and restart the server.',
      });
    }

    console.log(`[API] education/verify - prospect: ${prospect_id}, file: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB), client: ${req.clientInfo?.client_name}`);

    try {
      const result = await verifyEducationDocument(
        req.file.buffer,
        req.file.mimetype,
        prospect_id,
        armOverride
      );

      console.log(`[API] education/verify - done: ${result.overall_status}, provider: ${result.provider}, time: ${result.processing_time_ms}ms`);
      logEvent({
        event_type: 'education_verify',
        client_id: req.clientInfo?.client_id,
        client_name: req.clientInfo?.client_name,
        detail: `prospect=${prospect_id} status=${result.overall_status} provider=${result.provider} high=${result.flags_count?.high} medium=${result.flags_count?.medium}`,
      });

      res.json(result);
    } catch (error) {
      console.error('[API] education/verify error:', error.message);
      res.status(500).json({ error: error.message || 'Verification failed. Please try again.' });
    }
  });
});

/* =========================
   Configuration Management (Vendor & Branch Mapping)
========================= */

// In-memory storage for configurations per session
const configStorage = {};

function getInvoiceConfig(sessionId) {
  if (!configStorage[sessionId]) {
    configStorage[sessionId] = {
      vendorMapping: {},  // { vendorName: { accountCode, tdsPercentage } }
      branchMapping: {}   // { city: branchCode }
    };
  }
  return configStorage[sessionId];
}

// POST /api/config/upload-vendor — upload vendor mapping file
app.post('/api/config/upload-vendor', requireAuth, (req, res, next) => {
  upload.single('vendorFile')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const mapping = {};
    for (const row of data) {
      const vendorName = row['Vendor Name']?.toString().trim();
      const accountCode = row['Account Code']?.toString().trim();
      const tdsPercentage = parseFloat(row['TDS Percentage']) || 0;

      if (vendorName && accountCode) {
        mapping[vendorName.toLowerCase()] = { accountCode, tdsPercentage };
      }
    }

    const sessionConfig = getInvoiceConfig(req.sessionID);
    sessionConfig.vendorMapping = mapping;

    res.json({
      success: true,
      message: `Vendor mapping loaded: ${Object.keys(mapping).length} vendors`,
      count: Object.keys(mapping).length
    });
  } catch (error) {
    console.error('[API] config/upload-vendor error:', error.message);
    res.status(400).json({ error: `Failed to parse vendor file: ${error.message}` });
  }
});

// POST /api/config/upload-branch — upload branch mapping file
app.post('/api/config/upload-branch', requireAuth, (req, res, next) => {
  upload.single('branchFile')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const mapping = {};
    for (const row of data) {
      const city = row['City']?.toString().trim().toLowerCase();
      const branchCode = row['Branch Code']?.toString().trim();

      if (city && branchCode) {
        mapping[city] = branchCode;
      }
    }

    const sessionConfig = getInvoiceConfig(req.sessionID);
    sessionConfig.branchMapping = mapping;

    res.json({
      success: true,
      message: `Branch mapping loaded: ${Object.keys(mapping).length} cities`,
      count: Object.keys(mapping).length
    });
  } catch (error) {
    console.error('[API] config/upload-branch error:', error.message);
    res.status(400).json({ error: `Failed to parse branch file: ${error.message}` });
  }
});

// GET /api/config/status — check current configuration status
app.get('/api/config/status', requireAuth, (req, res) => {
  const sessionConfig = getInvoiceConfig(req.sessionID);
  res.json({
    vendorMappingLoaded: Object.keys(sessionConfig.vendorMapping).length > 0,
    vendorCount: Object.keys(sessionConfig.vendorMapping).length,
    branchMappingLoaded: Object.keys(sessionConfig.branchMapping).length > 0,
    branchCount: Object.keys(sessionConfig.branchMapping).length
  });
});

/* =========================
   Invoice Processing Module
========================= */

// POST /api/invoices/extract — upload invoice PDFs/images → AI extraction
app.post('/api/invoices/extract', requireAuth, (req, res, next) => {
  upload.array('invoices', 10)(req, res, (err) => {
    if (err) {
      console.error('[API] invoices/extract multer error:', err.message);
      return res.status(400).json({ error: err.message || 'File upload failed.' });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No invoice files uploaded' });
    }
    req.files.forEach(f => console.log(`[API] invoices/extract - file: ${f.originalname} (${(f.size / 1024).toFixed(1)} KB)`));

    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
    if (!hasAnthropic) {
      return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured. Please add it to .env and restart.' });
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const invoices = [];

    for (const file of req.files) {
      console.log(`[API] invoices/extract - processing: ${file.originalname}`);
      const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
      const mediaType = isPdf ? 'application/pdf' : (file.mimetype || 'image/jpeg');
      const base64Data = file.buffer.toString('base64');

      const contentBlock = isPdf
        ? { type: 'document', source: { type: 'base64', media_type: mediaType, data: base64Data } }
        : { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } };

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: [
            contentBlock,
            {
              type: 'text',
              text: `Extract all data from this invoice and return a JSON object with these fields:
{
  "vendor_name": "Full vendor/company name",
  "vendor_code": "Vendor code if available",
  "gstin": "16-char GSTIN",
  "pan": "PAN number",
  "vendor_address": "Complete address",
  "invoice_number": "Invoice reference number",
  "invoice_date": "YYYY-MM-DD format",
  "invoice_date_formatted": "YYYY-MM-DD 00:00:00 format for Excel",
  "payment_terms": "Payment terms text",
  "line_items": [
    {
      "description": "Item/service description",
      "hsn_sac": "HSN or SAC code",
      "taxable_value": "numeric amount without Rs. symbol",
      "gst_rate": "GST percentage (0, 5, 12, 18)",
      "qty": "quantity if available"
    }
  ],
  "taxable_value_total": "numeric amount",
  "cgst_amount": "numeric amount or null",
  "sgst_amount": "numeric amount or null",
  "igst_amount": "numeric amount or null",
  "total_tax": "numeric amount",
  "total_amount": "numeric amount"
}
Return ONLY the JSON, no other text. For amounts, use numbers without Rs. or commas. If a field is not found, use null.`
            }
          ]
        }]
      });

      const text = response.content?.[0]?.text || '{}';
      let parsed;
      try {
        // Extract JSON from potential markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
        parsed = JSON.parse(jsonMatch[1].trim());
      } catch (e) {
        parsed = { vendor_name: file.originalname, error: 'Failed to parse extraction result' };
      }
      parsed._source_file = file.originalname;
      invoices.push(parsed);
    }

    console.log(`[API] invoices/extract - completed ${invoices.length} invoice(s)`);

    logEvent({
      action: 'invoice_extract',
      client_id: req.clientInfo?.client_id,
      client_name: req.clientInfo?.client_name,
      detail: `files=${req.files.length} invoices=${invoices.length}`,
    });

    res.json({ invoices, count: invoices.length });

  } catch (error) {
    console.error('[API] invoices/extract error:', error.message);
    res.status(500).json({ error: 'Invoice extraction failed. Please try again.' });
  }
});

// Original complex version (commented out - keeping for reference)
/*
app.post('/api/invoices/download-complex', requireAuth, async (req, res) => {
  try {
    const { invoices } = req.body;
    if (!invoices || !invoices.length) {
      return res.status(400).json({ error: 'No invoice data provided' });
    }

    // Load configurations
    const sessionConfig = getInvoiceConfig(req.sessionID);
    const vendorMapping = sessionConfig.vendorMapping;
    const branchMapping = sessionConfig.branchMapping;

    // Sheet 1: Field reference (details to be captured)
    const refSheet = [
      ['Head', 'Details'],
      ['Acc Period', 'Period of entry'],
      ['Trans Date', 'Date of entry'],
      ['Account Code', 'Respective GL code'],
      ['Curr Code', 'INR'],
      ['Trans Amount', 'Amount'],
      ['Dr_Cr', 'Debit or Credit'],
      ['Jrnal Type', 'SEXPS or HEXPS'],
      ['Jrnal Source', 'Not applicable'],
      ['Reference', 'Vendor code and Name'],
      ['Description', 'Nature of expenses'],
      ['Asset Code', 'to be blank'],
      ['Asset Indicator', 'to be blank'],
      ['Asset / Item Qty', 'to be blank'],
      ['Due Date', 'to be blank'],
      ['Branch Analysis Code', 'Branch code'],
      ['Product  Analysis Code', 'Not applicable'],
      ['ChannelAnalysisCode', 'Respective channel code'],
      ['Sub-Channel  Analysis Code', 'Not applicable'],
      ['Underwriting Year  Analysis Code', 'Not applicable'],
      ['Employee Code  Analysis Code', 'Not applicable'],
      ['TDS Applicability  Analysis Code', 'TD01  if TDS applicable'],
      ['Department   Analysis Code', null],
      ['Sequence Code  Analysis Code', 'Not applicable'],
      ['Vendor Code  Analysis Code', 'Vendor code'],
      ['Invoice Date', 'Invoice date'],
      ['From Date', 'Not applicable'],
      ['To Date', 'Not applicable'],
      ['Addl Date 4', null],
      ['Addl Date 5', null],
      ['Cheque & NEFT Number', 'Vendor GST number'],
      ['Invoice Number', 'Vendor invoice number'],
      ['Additional Remarks', 'NEFT or Cheque'],
      ['Àdditional Remarks 2', 'Not applicable'],
      ['CREDENCE DESCRIPTION', 'Not applicable'],
      ['HSN/SAC NO', 'As per invoice'],
      ['Taxable on Amount', 'Invoice value for GST'],
      ['Reverse Charge (Y/N)', 'Not applicable'],
      ['Reverse charge %', 'Not applicable'],
      ['Item Details (Sr.No)', 'Not applicable'],
      ['Goods/Service', 'Not applicable'],
      ['GST Tax Rate', 'GST rate'],
      ['Orginal Invoice no for Dr/Cr Notes', 'RS GST number'],
      ['Advance Challan No', 'Respective expenses account code']
    ];

    // Sheet 2: Upload format with journal entry lines
    const uploadRows = [];
    let lineId = 1;

    const headers = [
      'L id', 'Acc Period', 'Trans Date', 'Account Code', 'Description', 'Curr Code', 'Trans Amount',
      'Dr_Cr', 'Jrnal Type', 'Jrnal Source', 'Reference', 'Description', 'Asset Code', 'Asset Indicator',
      'Asset / Item Qty', 'Due Date', 'Branch Analysis Code', 'Product  Analysis Code', 'ChannelAnalysisCode',
      'Sub-Channel  Analysis Code', 'Underwriting Year  Analysis Code', 'Employee Code  Analysis Code',
      'TDS Applicability  Analysis Code', 'Department   Analysis Code', 'Sequence Code  Analysis Code',
      'Vendor Code  Analysis Code', 'Invoice Date', 'From Date', 'To Date', 'Addl Date 4', 'Addl Date 5',
      'Cheque & NEFT Number', 'Invoice Number', 'Additional Remarks', 'Àdditional Remarks 2',
      'CREDENCE DESCRIPTION', 'HSN/SAC NO', 'Taxable on Amount', 'Reverse Charge (Y/N)', 'Reverse charge %',
      'Item Details (Sr.No)', 'Goods/Service', 'GST Tax Rate', 'Orginal Invoice no for Dr/Cr Notes',
      'Advance Challan No', 'Addl Description 15', 'Addl Description 16', 'Addl Description 17',
      'Addl Description 18', 'Addl Description 19', 'Addl Description 20', 'Addl Description 21',
      'Addl Description 22', 'Addl Description 23', 'Addl Description 24', 'Addl Description 25'
    ];
    uploadRows.push(headers);

    for (const inv of invoices) {
      // Apply Validation Rules

      // Rule 2: Acc period - Extract FY year only (fixed)
      let accPeriod = '';
      let invDate = '';
      if (inv.invoice_date) {
        const dateStr = String(inv.invoice_date).trim();
        // Extract just the YYYY-MM-DD part if there's time info
        const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          invDate = dateMatch[0]; // YYYY-MM-DD
          const year = parseInt(dateMatch[1], 10);
          const month = parseInt(dateMatch[2], 10);
          const fy = month >= 4 ? year : year - 1; // India FY: April-March
          accPeriod = fy.toString();
        }
      }

      // Rule 3: Account code - From vendor mapping file
      const vendorNameLower = (inv.vendor_name || '').toLowerCase();
      const vendorMapping_ = vendorMapping[vendorNameLower];
      const accountCode = vendorMapping_?.accountCode || '';

      // Rule 13: Branch analysis - Match city from vendor address
      let branchCode = '';
      if (inv.vendor_address) {
        const addressParts = inv.vendor_address.split(',').map(p => p.trim().toLowerCase());
        for (const part of addressParts) {
          if (branchMapping[part]) {
            branchCode = branchMapping[part];
            break;
          }
        }
      }

      // Rule 10: Reference - 15 char limit from invoice number
      const reference = (inv.invoice_number || '').substring(0, 15);

      // Rule 11: Description - 50 char limit
      const description = (inv.line_items?.[0]?.description || '').substring(0, 50);

      // Rule 18: Cheque & NEFT - GST number of vendor
      const gstNumber = inv.gstin || '';

      // Financial amounts
      const taxableVal = parseFloat(inv.taxable_value_total) || 0;
      const totalAmt = parseFloat(inv.total_amount) || 0;
      const cgstAmt = parseFloat(inv.cgst_amount) || 0;
      const sgstAmt = parseFloat(inv.sgst_amount) || 0;
      const igstAmt = parseFloat(inv.igst_amount) || 0;

      const blankRow = () => new Array(56).fill(null);
      let lineCounter = 1; // Rule 1: L Id - Sequential per invoice

      // 1. Expense debit line
      const expenseLine = blankRow();
      expenseLine[0] = lineCounter; // Rule 1: L Id
      expenseLine[1] = accPeriod; // Rule 2: Acc period
      expenseLine[2] = invDate; // Rule 16: Invoice date
      expenseLine[3] = accountCode; // Rule 3: Account code from mapping
      expenseLine[4] = null; // Rule 4: Description - Blank
      expenseLine[5] = 'INR'; // Rule 5: Curr Code
      expenseLine[6] = taxableVal > 0 ? taxableVal.toString() : null; // Rule 6: Trans Amount
      expenseLine[7] = 'D'; // Rule 7: DR_CR
      expenseLine[8] = 'SEXPS'; // Rule 8: Jrnl Type (hardcoded for now)
      expenseLine[9] = null; // Rule 9: Jrnl source - Blank
      expenseLine[10] = reference; // Rule 10: Reference
      expenseLine[11] = description; // Rule 11: Description
      // Rule 12: Asset code to Due Date - Blank (indices 12-15)
      expenseLine[16] = branchCode || null; // Rule 13: Branch analysis
      // Rule 14: Product analysis code - Blank (index 17)
      // Rule 15: Columns M to P and S to X - Blank
      expenseLine[26] = invDate; // Invoice Date column
      expenseLine[31] = gstNumber || null; // Rule 18: Cheque & NEFT - GST number
      expenseLine[39] = null; // Rule 20: Reverse charge - Blank
      expenseLine[41] = gstNumber || null; // Rule 21: GST number
      expenseLine[43] = null; // Rule 22: Advance challan No - Blank
      uploadRows.push(expenseLine);
      lineCounter++;

      // 2. SGST input credit line (if applicable)
      if (sgstAmt > 0) {
        const sgstLine = blankRow();
        sgstLine[0] = lineCounter;
        sgstLine[1] = accPeriod;
        sgstLine[2] = invDate;
        sgstLine[3] = accountCode;
        sgstLine[4] = null;
        sgstLine[5] = 'INR';
        sgstLine[6] = sgstAmt > 0 ? sgstAmt.toString() : null;
        sgstLine[7] = 'D';
        sgstLine[8] = 'SEXPS';
        sgstLine[9] = null;
        sgstLine[10] = reference;
        sgstLine[11] = description;
        sgstLine[16] = branchCode || null;
        sgstLine[26] = invDate;
        sgstLine[31] = gstNumber || null;
        sgstLine[39] = null;
        sgstLine[41] = gstNumber || null;
        sgstLine[43] = null;
        uploadRows.push(sgstLine);
        lineCounter++;
      }

      // 3. CGST input credit line (if applicable)
      if (cgstAmt > 0) {
        const cgstLine = blankRow();
        cgstLine[0] = lineCounter;
        cgstLine[1] = accPeriod;
        cgstLine[2] = invDate;
        cgstLine[3] = accountCode;
        cgstLine[4] = null;
        cgstLine[5] = 'INR';
        cgstLine[6] = cgstAmt > 0 ? cgstAmt.toString() : null;
        cgstLine[7] = 'D';
        cgstLine[8] = 'SEXPS';
        cgstLine[9] = null;
        cgstLine[10] = reference;
        cgstLine[11] = description;
        cgstLine[16] = branchCode || null;
        cgstLine[26] = invDate;
        cgstLine[31] = gstNumber || null;
        cgstLine[39] = null;
        cgstLine[41] = gstNumber || null;
        cgstLine[43] = null;
        uploadRows.push(cgstLine);
        lineCounter++;
      }

      // 4. IGST input credit line (if applicable)
      if (igstAmt > 0) {
        const igstLine = blankRow();
        igstLine[0] = lineCounter;
        igstLine[1] = accPeriod;
        igstLine[2] = invDate;
        igstLine[3] = accountCode;
        igstLine[4] = null;
        igstLine[5] = 'INR';
        igstLine[6] = igstAmt > 0 ? igstAmt.toString() : null;
        igstLine[7] = 'D';
        igstLine[8] = 'SEXPS';
        igstLine[9] = null;
        igstLine[10] = reference;
        igstLine[11] = description;
        igstLine[16] = branchCode || null;
        igstLine[26] = invDate;
        igstLine[31] = gstNumber || null;
        igstLine[39] = null;
        igstLine[41] = gstNumber || null;
        igstLine[43] = null;
        uploadRows.push(igstLine);
        lineCounter++;
      }

      // 5. Vendor credit line
      const vendorLine = blankRow();
      vendorLine[0] = lineCounter;
      vendorLine[1] = accPeriod;
      vendorLine[2] = invDate;
      vendorLine[3] = accountCode; // Account code for vendor liability
      vendorLine[4] = null;
      vendorLine[5] = 'INR';
      vendorLine[6] = totalAmt > 0 ? totalAmt.toString() : null;
      vendorLine[7] = 'C'; // Credit for vendor
      vendorLine[8] = 'SEXPS';
      vendorLine[9] = null;
      vendorLine[10] = reference;
      vendorLine[11] = description;
      vendorLine[16] = branchCode || null;
      vendorLine[26] = invDate;
      vendorLine[31] = gstNumber || null;
      vendorLine[39] = null;
      vendorLine[41] = gstNumber || null;
      vendorLine[43] = null;
      uploadRows.push(vendorLine);

      lineId++;
    }

    // Create workbook with both sheets
    console.log('[API] invoices/download - creating workbook');
    const wb = XLSX.utils.book_new();
    console.log('[API] invoices/download - refSheet rows:', refSheet.length);
    console.log('[API] invoices/download - uploadRows rows:', uploadRows.length);

    const refWs = XLSX.utils.aoa_to_sheet(refSheet);
    console.log('[API] invoices/download - created refWs');
    refWs['!cols'] = [{ wch: 40 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, refWs, 'details to be captured');
    console.log('[API] invoices/download - appended refWs');

    const uploadWs = XLSX.utils.aoa_to_sheet(uploadRows);
    console.log('[API] invoices/download - created uploadWs');
    uploadWs['!cols'] = headers.map(() => ({ wch: 12 }));
    XLSX.utils.book_append_sheet(wb, uploadWs, 'upload format');
    console.log('[API] invoices/download - appended uploadWs');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    console.log('[API] invoices/download - wrote buffer, size:', buf.length);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Invoice_JournalEntry_Upload.xlsx"');
    res.send(Buffer.from(buf));
    console.log('[API] invoices/download - sent file');

  } catch (error) {
    console.error('[API] invoices/download error:', error.message);
    console.error('[API] invoices/download stack:', error.stack);
    res.status(500).json({ error: 'Failed to generate Excel file', detail: error.message });
  }
});
*/

/* =========================
   Error Handlers
========================= */
process.on('uncaughtException', (err) => {
  console.error('[ERROR] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[ERROR] Unhandled Rejection:', reason);
});

/* =========================
   Start server
========================= */
const server = app.listen(PORT, () => {
  console.log(`PIVOT proxy running on port ${PORT}`);
  console.log(`[AUTH] Authentication enabled. Login at http://localhost:${PORT}/login`);
  console.log(`[PORTABILITY] Portability Plus module loaded`);
});

server.keepAliveTimeout = 65000;
