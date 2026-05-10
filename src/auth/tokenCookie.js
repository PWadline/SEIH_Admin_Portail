// src/auth/tokenCookie.js
const NAME = 'SessionId';
const REFRESH_NAME = 'RefreshToken';
const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

function setCookie(name, value, { days = 1 } = {}) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = isHttps ? ' Secure;' : '';     // <- clé
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax;${secure}`;
}
function getCookie(name){ const v=document.cookie.split('; ').find(r=>r.startsWith(name+'=')); return v?decodeURIComponent(v.split('=')[1]):null; }
function clearCookie(name){ document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax;`; }

export const setTokenCookie = (t,d=1)=>setCookie(NAME,t,{days:d});
export const getTokenCookie = ()=>getCookie(NAME);
export const clearTokenCookie = ()=>clearCookie(NAME);
export const setRefreshCookie = (t,d=7)=>setCookie(REFRESH_NAME,t,{days:d});
export const getRefreshCookie = ()=>getCookie(REFRESH_NAME);
export const clearRefreshCookie = ()=>clearCookie(REFRESH_NAME);
