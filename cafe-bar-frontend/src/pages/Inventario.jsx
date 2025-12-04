import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiClient.get("/api/inventario");
      setProductos(data || []);
    } catch (error) {
      console.error("Error cargando inventario:", error);
      setError('Error al cargar inventario: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📦 Inventario</h1>
        <p className="text-gray-600">Control de stock de productos</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-4 font-semibold transition"
        onClick={() => alert("Funcionalidad: Agregar producto")}
      >
        ➕ Agregar Producto
      </button>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Cargando inventario...</p>
      ) : productos.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay productos en inventario</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Stock Actual</th>
                <th className="px-6 py-3 text-left">Stock Mínimo</th>
                <th className="px-6 py-3 text-left">Unidad Medida</th>
                <th className="px-6 py-3 text-left">Precio</th>
                <th className="px-6 py-3 text-center">Estado</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id_producto} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-blue-600">#{p.id_producto}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{p.nombre || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-bold ${
                      p.stock_actual > p.stock_minimo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {p.stock_actual || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.stock_minimo || 0}</td>
                  <td className="px-6 py-4 text-gray-600">{p.unidad_medida || '-'}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">${parseFloat(p.precio).toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    {p.stock_actual > p.stock_minimo ? (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        ✅ OK
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                        ⚠️ Bajo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center flex gap-2 justify-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-semibold transition">
                      ✏️ Editar
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold transition">
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
