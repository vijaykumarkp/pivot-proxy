import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { exec } from 'child_process';
import FormData from "form-data";
import path from "path";
import { fileURLToPath } from "url"
import { Buffer } from 'buffer';
import session from 'express-session';
import { requireAuth, validateAccessCode, generateSessionSecret, getSessionConfig } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;

// JSON body parser (needed for login POST)
app.use(express.json());

// CORS middleware
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

  if (!access_code) {
    return res.status(400).json({ success: false, error: 'Access code required' });
  }

  const client = validateAccessCode(access_code);

  if (!client) {
    console.log(`[AUTH] Failed login attempt with code: ${access_code.substring(0, 4)}****`);
    return res.status(401).json({ success: false, error: 'Invalid access code' });
  }

  if (client.expired) {
    console.log(`[AUTH] Expired access attempt: ${client.client_name}`);
    return res.status(403).json({ success: false, expired: true, error: 'Access has expired' });
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

  console.log(`[AUTH] Login successful: ${client.client_name} (${client.role})`);

  res.json({
    success: true,
    client_name: client.client_name,
    role: client.role,
    allowed_modules: client.allowed_modules
  });
});

// Logout API
app.post("/api/auth/logout", (req, res) => {
  const clientName = req.session?.clientInfo?.client_name || 'Unknown';
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
   Dashboard (protected)
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/app-new.js", (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, "public", "app-new.js"));
});

/* =========================
   Admin route (Super Admin only)
========================= */
app.get("/admin", (req, res) => {
  if (!req.clientInfo || req.clientInfo.role !== 'super_admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  res.json({
    message: 'Admin dashboard placeholder',
    note: 'Full admin dashboard will be built in Phase 3',
    admin: req.clientInfo.client_name
  });
});

/* =========================
   PIVOT Portability Demo Analysis
========================= */
app.post("/api/ml_process", upload.single('input_file'), async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    console.log('API Key available:', !!apiKey);
    console.log('API Key length:', apiKey?.length);

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured on server' });
    }

    // Create a new FormData object for the external API
    const externalFormData = new FormData();

    // Add the file if it exists
    if (req.file) {
      externalFormData.append('input_file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
      console.log('File added:', req.file.originalname, 'size:', req.file.size, 'type:', req.file.mimetype);
    }

    // Add other form fields
    externalFormData.append('insurance_company', 'STAR HEALTH');
    externalFormData.append('data_type', 'specific');

    console.log('FormData fields created');

    const response = await fetch('https://PIVOT-Port-PolDoc-Health.Attributum.com/api/ml_process', {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${apiKey}`,
        ...externalFormData.getHeaders()
      },
      body: externalFormData.getBuffer()
    });

    console.log('External API response status:', response.status);

    const data = await response.json();
    console.log('External API response:', data);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* =========================
   PIVOT Portability Demo Analysis
========================= */
app.post("/api/portability/analyze", upload.single("document"), async (req, res) => {
  try {
    console.log('=== PIVOT Portability Demo Analysis ===');
    console.log('File:', req.file ? req.file.originalname : 'No file');

    if (!req.file) {
      console.log('ERROR: No file uploaded');
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Build multipart form using form-data package
    const form = new FormData();
    form.append('input_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    form.append('insurance_company', 'demo');
    form.append('data_type', 'specific');

    console.log('Calling PIVOT API...');

    // Forward request to PIVOT API with Authorization
    const response = await fetch("https://PIVOT-Port-PolDoc-Health.Attributum.com/api/ml_process", {
      method: "POST",
      headers: {
        'Authorization': `Api-Key ${process.env.API_KEY}`,
        ...form.getHeaders()
      },
      body: form
    });

    console.log('PIVOT API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PIVOT API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: `PIVOT API Error: ${response.status}`,
        details: errorText
      });
    }

    const result = await response.json();
    console.log('PIVOT API Success - Response keys:', Object.keys(result));
    res.json(result);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      error: "Proxy server error",
      details: error.message
    });
  }
});

/* =========================
   PIVOT Portability Proxy
========================= */
app.post("/api/portability/upload", upload.single("input_file"), async (req, res) => {
  try {
    console.log('=== PIVOT Portability Upload ===');
    console.log('File:', req.file ? req.file.originalname : 'No file');
    console.log('Insurance Company:', req.body.insurance_company);
    console.log('Data Type:', req.body.data_type);
    console.log('Request body keys:', Object.keys(req.body));

    if (!req.file) {
      console.log('ERROR: No file uploaded');
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Build multipart form using form-data package
    const form = new FormData();
    form.append('input_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    form.append('insurance_company', req.body.insurance_company);
    form.append('data_type', 'specific');

    console.log('Calling PIVOT API...');

    // Forward request to PIVOT API with Authorization
    const response = await fetch("https://PIVOT-Port-PolDoc-Health.Attributum.com/api/ml_process", {
      method: "POST",
      headers: {
        'Authorization': `Api-Key ${process.env.API_KEY}`,
        ...form.getHeaders()
      },
      body: form
    });

    console.log('PIVOT API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PIVOT API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: `PIVOT API Error: ${response.status}`,
        details: errorText
      });
    }

    const result = await response.json();
    console.log('PIVOT API Success - Response keys:', Object.keys(result));
    res.json(result);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      error: "Proxy server error",
      details: error.message
    });
  }
});

/* =========================
   ML proxy endpoint
========================= */
app.post("/ml_process", upload.single("input_file"), (req, res) => {
  console.log('=== UPLOAD RECEIVED ===');
  console.log('File:', req.file?.originalname);
  console.log('Insurance company:', req.body.insurance_company);

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

  console.log('Returning mock data');
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
    const form = new FormData();
    form.append("input_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    form.append("insurance_company", req.body.insurance_company || req.body.insurance_company || 'telemer_hdfcergo');
    const apiKey = process.env.TELEMER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "TeleMER API key not configured" });
    }
    console.log("=== PIVOT Underwriting TeleMER Analysis ===");
    const response = await fetch("https://pivot-uwcopilot-telemer-health.attributum.com/api/ml_process", {
      method: "POST",
      headers: {
        "Authorization": `Api-Key ${apiKey}`,
        ...form.getHeaders()
      },
      body: form.getBuffer()
    });
    console.log("TeleMER API Response Status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("TeleMER API Error:", response.status, errorText);
      return res.status(response.status).json({ error: "TeleMER API Error: " + response.status });
    }
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("TeleMER Proxy Error:", error.message);
    res.status(500).json({ error: "Proxy server error" });
  }
});

/* =========================
   Start server
========================= */
app.listen(PORT, () => {
  console.log(`PIVOT proxy running on port ${PORT}`);
  console.log(`[AUTH] Authentication enabled. Login at http://localhost:${PORT}/login`);
});
