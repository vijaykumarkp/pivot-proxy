import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { exec } from 'child_process';
import FormData from "form-data";
import path from "path";
import { fileURLToPath } from "url"
import { Buffer } from 'buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;

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

// Static files
app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   Demo Portal
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/simple-test.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "simple-test.html"));
});

app.get("/test-no-jsx.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "test-no-jsx.js"));
});

app.get("/app-working.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "app-working.js"));
});

app.get("/app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "app.js"));
});

app.get("/app-new.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "app-new.js"));
});

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

app.get("/test-app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "test-app.js"));
});

app.get("/app-simple.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "app-simple.js"));
});

app.get("/assets/pivot-logo.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "assets", "pivot-logo.png"));
});

app.get("/assets/attributum-logo.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "assets", "attributum-logo.png"));
});

/* =========================
   Health check
========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "PIVOT proxy alive" });
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
        'Authorization': 'Api-Key T33fvOdn.n2AO1NH9GmU2jL9066FEOQvIw9zSLJSc',
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
        'Authorization': 'Api-Key T33fvOdn.n2AO1NH9GmU2jL9066FEOQvIw9zSLJSc',
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
   Start server
========================= */
app.listen(PORT, () => {
  console.log(`PIVOT proxy running on port ${PORT}`);
});

