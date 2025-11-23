import { useEffect, useState } from "react";
import { api } from "../api/api.js";

export default function Settings() {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    const data = await api.getUsers();
    setUsuarios(data);
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
