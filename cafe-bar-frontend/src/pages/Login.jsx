import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function Login() {
  const [form, setForm] = useState({ usuario: "", password_hash: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Enviando login con:", form);
      const response = await apiClient.post("/api/auth/login", form);
      
      console.log("Respuesta recibida:", response);
      
      if (response.ok && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/");
      } else {
        setError(response.error || "Error en el login");
      }
    } catch (err) {
      console.error("Error capturado:", err);
      setError(err.body?.error || err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🍰 Café Bar
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-bold mb-2">Usuario</label>
            <input
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Contraseña</label>
            <input
              type="password"
              name="password_hash"
              value={form.password_hash}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Test credentials: admin@example.com / pass1234
        </p>
      </div>
    </div>
  );
}
