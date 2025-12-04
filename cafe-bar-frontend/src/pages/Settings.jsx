import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function Settings() {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    try {
      const data = await apiClient.get('/api/usuarios');
      setUsuarios(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div>
      <h1>Usuarios del Sistema</h1>

      {usuarios.map((u) => (
        <p key={u.id}>
          {u.nombre} — {u.email}
        </p>
      ))}
    </div>
  );
}
