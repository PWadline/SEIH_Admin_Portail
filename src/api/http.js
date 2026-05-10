// src/api/http.js
import { getAccessToken, setAccessToken, clearAccessToken } from "../auth/tokenStore";

const BASE = (import.meta.env.VITE_BASE_API_URL || "").replace(/\/$/, "");

async function apiFetch(path, opts = {}) {
  const headers = new Headers(opts.headers || {});
  headers.set("Accept", "application/json");
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(`${BASE}${path}`, { ...opts, headers });

  if (res.status === 401) {
    // tente refresh (cookie HttpOnly Strict, donc il faut include credentials)
    const r = await fetch(`${BASE}/seih/identity/user/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (r.ok) {
      const data = await r.json();
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        // retry
        const headers2 = new Headers(opts.headers || {});
        headers2.set("Accept", "application/json");
        headers2.set("Authorization", `Bearer ${data.accessToken}`);
        res = await fetch(`${BASE}${path}`, { ...opts, headers: headers2 });
      }
    } else {
      clearAccessToken();
    }
  }

  return res;
}

export default apiFetch;
