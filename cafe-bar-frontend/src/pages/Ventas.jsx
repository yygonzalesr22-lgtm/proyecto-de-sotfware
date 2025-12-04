import { useState } from "react";
import apiClient from "../api/apiClient";

export default function ventas() {
  const [mesa, setMesa] = useState("");
  const [total, setTotal] = useState("");

  const enviarVenta = async () => {
    if (!mesa || !total) return alert("Completa todos los campos");

    try {
      const data = await apiClient.post('/api/pedidos', {
        mesa,
        total,
        fecha: new Date()
      });

    console.log("Venta creada:", data);
    alert("Venta creada");
  };

  return (
    <div>
      <h1>Registrar Venta</h1>

      <input placeholder="Mesa" value={mesa} onChange={(e) => setMesa(e.target.value)} />
      <input placeholder="Total" value={total} onChange={(e) => setTotal(e.target.value)} />

      <button onClick={enviarVenta}>Enviar Venta</button>
    </div>
  );
}
