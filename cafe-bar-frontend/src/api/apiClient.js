export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const url = `${API_BASE}${path}`;
  const opts = { method, headers: { ...headers } };

  // take token automatically from localStorage if not passed
  const localToken = token || localStorage.getItem('token');
  if (localToken) opts.headers['Authorization'] = `Bearer ${localToken}`;
  if (body && !(body instanceof FormData)) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    opts.body = body;
  }

  const res = await fetch(url, opts);
  const contentType = res.headers.get('content-type') || '';

  let data = null;
  if (contentType.includes('application/json')) data = await res.json();
  else data = await res.text();

  if (!res.ok) {
    const error = new Error(data?.msg || res.statusText || 'Request failed');
    error.status = res.status;
    error.body = data;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: (path, opts = {}) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts = {}) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts = {}) => request(path, { ...opts, method: 'PUT', body }),
  del: (path, opts = {}) => request(path, { ...opts, method: 'DELETE' }),
};

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}
