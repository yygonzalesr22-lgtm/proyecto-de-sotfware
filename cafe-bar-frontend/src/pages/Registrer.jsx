import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import apiClient from "../api/apiClient";

export default function Register() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrar = async () => {
    setLoading(true);
    try {
      const respuesta = await apiClient.post('/api/auth/register', form);
      setLoading(false);

      if (respuesta.ok) {
        setToast("Usuario registrado correctamente");
      } else {
        setToast(respuesta.error || 'Error al registrar');
      }
    } catch (err) {
      setLoading(false);
      setToast(err.message || 'Error de conexión');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white p-6">
      <Card className="bg-neutral-800 border-none rounded-2xl shadow-xl w-full max-w-md">
        <CardContent className="p-6 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-center mb-2">Registro</h1>

          <input
            name="nombre"
            onChange={handleChange}
            placeholder="Nombre completo"
            className="p-2 bg-neutral-700 rounded-xl"
          />

          <input
            name="email"
            onChange={handleChange}
            placeholder="Correo"
            className="p-2 bg-neutral-700 rounded-xl"
          />

          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Contraseña"
            className="p-2 bg-neutral-700 rounded-xl"
          />

          <Button onClick={registrar} className="rounded-xl w-full mt-4">
            {loading ? <Loader /> : "Crear cuenta"}
          </Button>
        </CardContent>
      </Card>

      {toast && <Toast message={toast} />}
    </div>
  );
}
