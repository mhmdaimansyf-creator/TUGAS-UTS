const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'abadi_motor_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      saveToken(null);
      window.dispatchEvent(new Event('abadi:unauthorized'));
    }
    throw new Error(payload.message || 'Permintaan gagal. Silakan coba kembali.');
  }
  return payload;
}

export function jsonBody(value) {
  return JSON.stringify(value);
}
