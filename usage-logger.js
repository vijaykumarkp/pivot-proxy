/**
 * PIVOT Sandbox — Usage Logger (Phase 3)
 *
 * Logs every API call and login event to usage-log.json.
 * Provides query helpers for the admin dashboard.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE = path.join(__dirname, 'usage-log.json');

// ─── Helpers ────────────────────────────────────────────

function loadLog() {
  try {
    if (!existsSync(LOG_FILE)) return [];
    const raw = readFileSync(LOG_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLog(entries) {
  writeFileSync(LOG_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

// ─── Public API ─────────────────────────────────────────

/**
 * Record an event. Called from server.js middleware.
 */
export function logEvent({ event_type, client_id, client_name, role, module, endpoint, method, status_code, detail }) {
  const entries = loadLog();
  entries.push({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    event_type,        // 'api_call' | 'login' | 'login_failed' | 'logout' | 'module_blocked'
    client_id:    client_id   || null,
    client_name:  client_name || null,
    role:         role        || null,
    module:       module      || null,
    endpoint:     endpoint    || null,
    method:       method      || null,
    status_code:  status_code || null,
    detail:       detail      || null
  });
  saveLog(entries);
}

/**
 * Express middleware — logs every API call that reaches a proxy endpoint.
 * Attach AFTER auth middleware so req.clientInfo is available.
 */
export function usageMiddleware(endpointModuleMap) {
  return (req, res, next) => {
    // Only log actual API processing endpoints, not static/page requests
    const matchedPath = Object.keys(endpointModuleMap).find(p => req.path.startsWith(p));
    if (!matchedPath) return next();

    // Capture response status after the response is sent
    const originalSend = res.send;
    const originalJson = res.json;
    let logged = false;

    const doLog = (statusCode) => {
      if (logged) return;
      logged = true;
      logEvent({
        event_type: 'api_call',
        client_id:   req.clientInfo?.client_id,
        client_name: req.clientInfo?.client_name,
        role:        req.clientInfo?.role,
        module:      endpointModuleMap[matchedPath],
        endpoint:    req.path,
        method:      req.method,
        status_code: statusCode
      });
    };

    res.send = function (...args) {
      doLog(res.statusCode);
      return originalSend.apply(this, args);
    };

    res.json = function (...args) {
      doLog(res.statusCode);
      return originalJson.apply(this, args);
    };

    next();
  };
}

/**
 * Get all log entries, optionally filtered.
 */
export function getUsageLog({ client_id, event_type, from_date, to_date, limit } = {}) {
  let entries = loadLog();

  if (client_id)  entries = entries.filter(e => e.client_id === client_id);
  if (event_type) entries = entries.filter(e => e.event_type === event_type);
  if (from_date)  entries = entries.filter(e => e.timestamp >= from_date);
  if (to_date)    entries = entries.filter(e => e.timestamp <= to_date);

  // Most recent first
  entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  if (limit) entries = entries.slice(0, limit);
  return entries;
}

/**
 * Aggregate per-client usage summary.
 * Returns an array of { client_id, client_name, role, total_calls, calls_by_module, last_active }.
 */
export function getUsageSummary() {
  const entries = loadLog();
  const apiCalls = entries.filter(e => e.event_type === 'api_call');

  const map = {};

  for (const e of apiCalls) {
    const cid = e.client_id || 'unknown';
    if (!map[cid]) {
      map[cid] = {
        client_id: cid,
        client_name: e.client_name || 'Unknown',
        role: e.role || 'client',
        total_calls: 0,
        calls_by_module: {},
        last_active: e.timestamp
      };
    }
    map[cid].total_calls++;
    const mod = e.module || 'other';
    map[cid].calls_by_module[mod] = (map[cid].calls_by_module[mod] || 0) + 1;
    if (e.timestamp > map[cid].last_active) {
      map[cid].last_active = e.timestamp;
    }
  }

  return Object.values(map).sort((a, b) => b.total_calls - a.total_calls);
}

/**
 * Generate CSV string from log entries.
 */
export function exportCSV(entries) {
  const headers = ['timestamp', 'event_type', 'client_id', 'client_name', 'role', 'module', 'endpoint', 'method', 'status_code', 'detail'];
  const rows = entries.map(e =>
    headers.map(h => {
      const val = e[h] ?? '';
      // Escape commas and quotes
      const str = String(val);
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}
