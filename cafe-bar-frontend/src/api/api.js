const BASE = "http://localhost:3000";

export const api = {
  registrar: async (data) => {
    try {
      const r = await fetch(`${BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await r.json();
    } catch (e) {
      return { ok: false, error: "Error de conexión" };
    }
  },

  login: async (data) => {
    try {
      const r = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await r.json();
    } catch {
      return { ok: false, error: "Error de conexión" };
    }
  },
};
