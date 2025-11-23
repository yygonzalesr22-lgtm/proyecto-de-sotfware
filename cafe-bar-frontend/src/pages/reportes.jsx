import { useEffect, useState } from "react";
import { api } from "../api/api.js";

export default function reportes() {
  const [reportes, setReportes] = useState([]);

  const cargarReportes = async () => {
    const data = await api.getReportes();
    setReportes(data);
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  return (
    <div>
      <h1>Reportes</h1>
      <ul>
        {reportes.map((r) => (
          <li key={r.id}>
            {r.tipo} - {r.fecha} - ${r.total}
          </li>
        ))}
      </ul>
    </div>
  );
}


