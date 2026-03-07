import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load client config
function loadClients() {
  try {
    const data = readFileSync(path.join(__dirname, 'clients.json'), 'utf8');
    return JSON.parse(data).clients;
  } catch (error) {
    console.error('Failed to load clients.json:', error.message);
    return [];
  }
}

// Validate access code and return client info
export function validateAccessCode(code) {
  const clients = loadClients();
  const client = clients.find(c => c.access_code === code && c.active);

  if (!client) return null;

  // Check expiry
  const now = new Date();
  const expiry = new Date(client.expiry_date);
  if (now > expiry) {
    return { ...client, expired: true };
  }

  return { ...client, expired: false };
}

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  '/api/health',
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/session',
  '/login.html'
];

// Static file extensions that should be publicly accessible for login page
const PUBLIC_EXTENSIONS = ['.css', '.js', '.png', '.jpg', '.ico', '.svg', '.woff', '.woff2'];

// Auth middleware - protects all routes except public ones
export function requireAuth(req, res, next) {
  const reqPath = req.path;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => reqPath === p || reqPath.startsWith(p + '?'))) {
    return next();
  }

  // Allow static assets needed for login page (logos, fonts, etc.)
  const ext = path.extname(reqPath).toLowerCase();
  if (PUBLIC_EXTENSIONS.includes(ext) && (reqPath.startsWith('/logos/') || reqPath.startsWith('/assets/'))) {
    return next();
  }

  // Check session
  if (!req.session || !req.session.authenticated) {
    // API requests get 401
    if (reqPath.startsWith('/api/')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    // Browser requests get redirected to login
    return res.redirect('/login');
  }

  // Phase 4: Session fingerprint check — detect session hijacking
  if (req.session.fingerprint) {
    const currentFingerprint = crypto
      .createHash('sha256')
      .update(req.headers['user-agent'] || 'unknown')
      .digest('hex')
      .substring(0, 16);

    if (req.session.fingerprint !== currentFingerprint) {
      console.log(`[SECURITY] Session fingerprint mismatch for ${req.session.clientInfo?.client_name} — possible hijack attempt`);
      req.session.destroy(() => {});
      if (reqPath.startsWith('/api/')) {
        return res.status(401).json({ error: 'Session invalid. Please log in again.' });
      }
      return res.redirect('/login');
    }
  }

  // Session is valid - attach client info to request
  req.clientInfo = req.session.clientInfo;
  next();
}

// Generate session secret (stable per server instance)
export function generateSessionSecret() {
  return crypto.randomBytes(32).toString('hex');
}

// Session configuration
export function getSessionConfig(secret) {
  return {
    secret: secret,
    name: 'pivot_session',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,  // Set to true when using HTTPS in production
      maxAge: 4 * 60 * 60 * 1000,  // 4 hours
      sameSite: 'lax'
    }
  };
}
