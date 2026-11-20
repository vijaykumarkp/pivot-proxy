# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

PIVOT Automation Suite — a single Node/Express app (ESM, `"type": "module"`) that acts as an
authenticated proxy + AI document-extraction backend for several insurance-ops tools used by
Attributum's clients (brokers/intermediaries): Portability (policy comparison), TeleMER
(underwriting), RFQ extraction, Invoice extraction, and Education verification. There is no
separate frontend build — the UI is a single server-rendered React app loaded via CDN React +
Babel-standalone (compiled in the browser, no bundler).

## Commands

- Install deps: `npm install`
- Run server: `npm start` (runs `node server.js`, defaults to port 3000) or `./restart.sh`
  (kills any existing `node server.js` process first, then starts in background)
- There are no lint/test/build scripts configured in `package.json`.
- Required env vars live in `.env` (see `.env.example` for the documented subset — note the
  code also reads `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, and `SESSION_SECRET`, which aren't
  listed there). Key vars: `PORT`, `API_BASE_URL`, `API_KEY` (Portability ML backend),
  `TELEMER_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `SESSION_SECRET`.

## Architecture

### Request pipeline (server.js)
Everything is one Express app in `server.js`. Middleware is layered in a specific, load-bearing
order — read the comment banners in the file (`Phase 4: Security Hardening`, `Auth middleware`,
`Per-client rate limiting`, `Module access gating`) before adding new routes:

1. Multer upload config + error handler (file type/size allowlist, 15MB max).
2. Security headers, JSON body limit, manual CORS middleware.
3. `express-session` (cookie-based, 4h expiry) — session secret is generated at boot if
   `SESSION_SECRET` isn't set (meaning sessions won't survive a restart unless it's set).
4. Public static routes (`/logos`, `/assets`, `/templates`, `/login.html`) and `/api/health` —
   these bypass auth.
5. `requireAuth` (`auth.js`) — applied via `app.use(requireAuth)` partway through the file, so
   routes defined **above** that line (health check, login, template downloads) are
   unauthenticated, and everything defined **below** it requires a valid session.
6. Per-client rate limiting, keyed by `client_id` (not IP), for `/api/portability`,
   `/api/underwriting`, `/api/ml_process`, `/api/rfq`.
7. `requireModule` — module access gating. `ENDPOINT_MODULE_MAP` in `server.js` maps URL
   prefixes to module names (`portability`, `telemer`, `rfq`) that must appear in the logged-in
   client's `allowed_modules` (from `clients.json`), or the request gets a 403.
8. `usageMiddleware` (`usage-logger.js`) — logs every call hitting a mapped endpoint to
   `usage-log.json`, keyed by client.

When adding a new API endpoint for an existing module, add its path prefix to
`ENDPOINT_MODULE_MAP` so it gets rate-limited/gated/logged consistently.

### Auth & client model
- No user accounts/passwords — clients authenticate with a single shared `access_code` per
  client, validated against `clients.json` (`auth.js: validateAccessCode`). Each client record
  has `role` (`client` | `super_admin`), `allowed_modules`, `rate_limit`, `expiry_date`.
- `super_admin` role unlocks `/admin` and `/api/admin/*` (client CRUD, usage dashboard) via the
  `requireAdmin` guard in `server.js`.
- Session carries a UA-based fingerprint; a mismatch destroys the session (hijack detection).

### AI extraction modules
Each document-processing module follows a similar pattern: parse the uploaded file
(`pdf-parse`, `mammoth` for docx, `xlsx` for spreadsheets) into text, then call an AI provider
to extract structured JSON.
- **RFQ extraction** (`rfq-extractor.js`, routes under `/api/rfq`): dual-provider extraction —
  tries OpenAI (GPT-4o) first, falls back to Claude. Includes a corrections-learning loop:
  user-submitted corrections are appended to `data/rfq-corrections.json` (capped at last 500) and
  fed back into future extraction prompts to improve accuracy over time.
- **Education verification** (`education-verifier.js`, routes under
  `/api/intermediary/education`): similar dual-provider (Anthropic/OpenAI) image/doc extraction
  for verifying candidate education documents against `data/arm-prospects.json`.
- **Invoice extraction** (`/api/invoices/extract`, inline in `server.js`): Claude-only, sends
  PDFs/images directly as base64 document/image blocks (no text pre-extraction).
- **Portability/TeleMER** (`/api/portability/*`, `/api/underwriting/*`, `/api/ml_process`):
  these proxy to an external ML backend (`API_BASE_URL` + `API_KEY`) rather than calling an LLM
  directly in-process.

### Important: unused/legacy files at repo root
The root directory also contains a set of files from an earlier **Portability Plus**
prototype that are **not wired into `server.js`** and are dead code as of now:
`portability-routes.js`, `portability-engines.js`, `portability-synthetic-data.js`,
`PortabilityDashboard.jsx`, `PortabilitySteps.jsx`, `Step1Upload.jsx` … `Step6Recommendation.jsx`,
`StepIndicator.jsx`, `ReportViewer.jsx`, and the `PORTABILITY_PLUS_*.md` docs. Don't assume these
are reachable from the running app — check `server.js` imports before treating them as live
code. The actual Portability feature in production is the inline Express routes in `server.js`
plus the React code in `public/app-new.js`.

### Frontend
`public/app-new.js` is a single ~7k-line file containing the entire client app (main `App`
component plus page components like `ScoreConfigPage`, `TeleMERConfigPage`), compiled in-browser
via Babel-standalone — there is no webpack/vite build step. `public/index.html` just loads React
UMD + Babel + this file. It fetches `/api/auth/permissions` on load to determine which module
tabs (`allowed_modules`) to show for the logged-in client. `/app-new.js` is served via an
explicit route (not `express.static`) specifically to set `Cache-Control: no-store`, since the
session-derived module list changes per client.

### Data persistence
No database — state is flat JSON files: `clients.json` (client/access-code registry, gitignored
implicitly via file perms but not `.gitignore` — treat as sensitive), `usage-log.json`
(gitignored, append-only event log), `data/rfq-corrections.json`, `data/arm-prospects.json`.
