// src/api/users.js
import { getTokenCookie } from '../auth/tokenCookie';

const BASE = (import.meta.env.VITE_BASE_API_URL || 'http://localhost:5258').replace(/\/$/, '');

async function apiGet(path) {
  const token = getTokenCookie();
  if (!token) {
    const err = new Error('NoAuth');
    err.status = 401;
    throw err;
  }

  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    // On n'utilise PAS les cookies serveur -> pas besoin de credentials
    mode: 'cors',
    credentials: 'omit',
  });

  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.body = json ?? text;
    throw err;
  }
  return json;
}

export async function fetchUsers() {
  // adapte le path si besoin
  return apiGet('/seih/hospital/user/get/list');
}
