import { getTokenCookie } from '../auth/tokenCookie';

const BASE = (import.meta.env.VITE_BASE_API_URL || '').replace(/\/$/, ''); // ex: https://localhost:7254

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export async function apiGet(path, options = {}) {
  const token = getTokenCookie();
  const headers = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE}${path}`, {
    method: 'GET',
    credentials: 'omit', // pas de cookies serveur; on passe par Bearer
    ...options,
    headers,
  });
  return handle(res);
}
