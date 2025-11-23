const API_URL = "http://localhost:3000/api";

export const api = {
  // -------------------------------
  // USUARIOS
  // -------------------------------
  getUsers: async () => {
    const res = await fetch(`${API_URL}/usuarios`);
    return res.json();
  },

  // -------------------------------
  // PRODUCTOS
  // -------------------------------
  getProductos: async () => {
    const res = await fetch(`${API_URL}/productos`);
    return res.json();
  },

  crearProducto: async (data) => {
    const res = await fetch(`${API_URL}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  eliminarProducto: async (id) => {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // -------------------------------
  // VENTAS
  // -------------------------------
  crearVenta: async (data) => {
    const res = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // -------------------------------
  // REPORTES
  // -------------------------------
  getReportes: async () => {
    const res = await fetch(`${API_URL}/reportes`);
    return res.json();
  },
};
