import { useEffect, useState } from "react";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 1. Llamada real al backend
  const cargarProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/inventario");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => alert("Agregar producto (luego lo hacemos real)")}
      >
        ➕ Agregar Producto
      </button>

      {loading ? (
        <p>Cargando inventario...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Producto</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td className="border p-2">{p.id}</td>
                <td className="border p-2">{p.nombre}</td>
                <td className="border p-2">{p.stock}</td>
                <td className="border p-2">${p.precio}</td>
                <td className="border p-2 flex gap-2">
                  <button className="bg-blue-600 text-white px-2 py-1 rounded">
                    Editar
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
