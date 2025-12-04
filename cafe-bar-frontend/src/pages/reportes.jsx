import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function Reportes() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // todos, activos, cerrados
  const [loading, setLoading] = useState(true);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalEfectivo, setTotalEfectivo] = useState(0);
  const [totalTransferencia, setTotalTransferencia] = useState(0);
  const [totalTarjeta, setTotalTarjeta] = useState(0);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [loadingDetalles, setLoadingDetalles] = useState(false);

  useEffect(() => {
    cargarPedidos();
    const interval = setInterval(cargarPedidos, 5000);
    return () => clearInterval(interval);
  }, []);

  const cargarPedidos = async () => {
    try {
      const data = await apiClient.get('/api/pedidos');
      setPedidos(data || []);
      
      // Calcular totales por método de pago
      let totalEf = 0;
      let totalTrans = 0;
      let totalTarj = 0;

      data.forEach(pedido => {
        if (pedido.estado === 'cerrado') {
          const monto = parseFloat(pedido.monto_recibido) || 0;
          
          if (pedido.metodo_pago === 'efectivo') {
            totalEf += monto;
          } else if (pedido.metodo_pago === 'transferencia') {
            totalTrans += monto;
          } else if (pedido.metodo_pago === 'tarjeta_digital') {
            totalTarj += monto;
          }
        }
      });

      setTotalEfectivo(totalEf);
      setTotalTransferencia(totalTrans);
      setTotalTarjeta(totalTarj);
      setTotalVentas(totalEf + totalTrans + totalTarj);
      setLoading(false);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setLoading(false);
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtro === 'activos') return p.estado !== 'cerrado' && p.estado !== 'cancelado';
    if (filtro === 'cerrados') return p.estado === 'cerrado';
    return true;
  });

  const getMesaInfo = (id_mesa) => {
    if (id_mesa === null) return 'Para llevar';
    return `Mesa ${id_mesa}`;
  };

  const abrirDetalles = async (pedido) => {
    setMesaSeleccionada(pedido);
    setLoadingDetalles(true);
    try {
      const data = await apiClient.get(`/api/pedidos/${pedido.id_pedido}`);
      setDetallesPedido(data.detalles || []);
    } catch (err) {
      console.error('Error cargando detalles:', err);
      setDetallesPedido([]);
    } finally {
      setLoadingDetalles(false);
    }
  };

  const calcularTotal = () => {
    return detallesPedido.reduce((sum, item) => {
      return sum + (parseFloat(item.cantidad) * parseFloat(item.precio_unitario));
    }, 0);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Reportes de Pedidos</h1>
        <p className="text-gray-600">Historial completo de pedidos y ventas</p>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Cargando reportes...</p>
      ) : (
        <>
          {/* Cards de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-600 font-semibold mb-2">Total de Pedidos</p>
              <p className="text-3xl font-bold text-blue-600">{pedidos.length}</p>
            </div>
            <div className="bg-yellow-100 p-6 rounded-lg border-l-4 border-yellow-500">
              <p className="text-gray-600 font-semibold mb-2">Pedidos Activos</p>
              <p className="text-3xl font-bold text-yellow-600">
                {pedidos.filter(p => p.estado !== 'cerrado' && p.estado !== 'cancelado').length}
              </p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg border-l-4 border-green-500">
              <p className="text-gray-600 font-semibold mb-2">💵 Total Efectivo</p>
              <p className="text-3xl font-bold text-green-600">${totalEfectivo.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 p-6 rounded-lg border-l-4 border-purple-500">
              <p className="text-gray-600 font-semibold mb-2">🔄 Total Transferencias</p>
              <p className="text-3xl font-bold text-purple-600">${totalTransferencia.toFixed(2)}</p>
            </div>
            <div className="bg-red-100 p-6 rounded-lg border-l-4 border-red-500 md:col-span-2">
              <p className="text-gray-600 font-semibold mb-2">💳 Total Tarjeta Digital</p>
              <p className="text-3xl font-bold text-red-600">${totalTarjeta.toFixed(2)}</p>
            </div>
            <div className="bg-indigo-100 p-6 rounded-lg border-l-4 border-indigo-600 md:col-span-2">
              <p className="text-gray-600 font-semibold mb-2">💰 Monto Total (Todas las Ventas)</p>
              <p className="text-4xl font-bold text-indigo-600">${totalVentas.toFixed(2)}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setFiltro('todos')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filtro === 'todos'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              📋 Todos ({pedidos.length})
            </button>
            <button
              onClick={() => setFiltro('activos')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filtro === 'activos'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              ⏳ Activos
            </button>
            <button
              onClick={() => setFiltro('cerrados')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filtro === 'cerrados'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              ✅ Cerrados
            </button>
          </div>

          {/* Tabla de pedidos */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Mesa</th>
                  <th className="px-6 py-3 text-left">Mesero</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Método de Pago</th>
                  <th className="px-6 py-3 text-left">Hora</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No hay pedidos disponibles
                    </td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id_pedido} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-blue-600">#{pedido.id_pedido}</td>
                      <td className="px-6 py-4">{getMesaInfo(pedido.id_mesa)}</td>
                      <td className="px-6 py-4">{pedido.mesero}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          pedido.estado === 'cerrado' ? 'bg-green-100 text-green-800' :
                          pedido.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pedido.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          pedido.metodo_pago === 'efectivo' ? 'bg-green-100 text-green-800' :
                          pedido.metodo_pago === 'tarjeta_digital' ? 'bg-blue-100 text-blue-800' :
                          pedido.metodo_pago === 'transferencia' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pedido.metodo_pago === 'efectivo' ? '💵 Efectivo' :
                           pedido.metodo_pago === 'tarjeta_digital' ? '💳 Tarjeta' :
                           pedido.metodo_pago === 'transferencia' ? '🔄 Transferencia' :
                           'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(pedido.fecha_hora).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => abrirDetalles(pedido)}
                          className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal de detalles */}
          {mesaSeleccionada && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full max-h-96 overflow-y-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  📋 Pedido #{mesaSeleccionada.id_pedido}
                </h2>
                
                {/* Información General */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Mesa</p>
                    <p className="text-lg font-bold text-blue-600">{getMesaInfo(mesaSeleccionada.id_mesa)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Mesero</p>
                    <p className="text-lg font-bold">{mesaSeleccionada.mesero}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Estado</p>
                    <p className={`text-lg font-bold uppercase ${
                      mesaSeleccionada.estado === 'cerrado' ? 'text-green-600' :
                      mesaSeleccionada.estado === 'cancelado' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {mesaSeleccionada.estado}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Fecha y Hora</p>
                    <p className="text-lg font-bold">{new Date(mesaSeleccionada.fecha_hora).toLocaleString()}</p>
                  </div>
                </div>

                {/* Productos del Pedido */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">🛍️ Productos del Pedido</h3>
                  
                  {loadingDetalles ? (
                    <p className="text-gray-500 text-center py-4">Cargando detalles...</p>
                  ) : detallesPedido.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay productos en este pedido</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-200 border-b-2 border-gray-400">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Producto</th>
                            <th className="px-4 py-2 text-right font-semibold text-gray-700">Cantidad</th>
                            <th className="px-4 py-2 text-right font-semibold text-gray-700">Precio Unit.</th>
                            <th className="px-4 py-2 text-right font-semibold text-gray-700">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detallesPedido.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 font-semibold text-gray-800">{item.nombre}</td>
                              <td className="px-4 py-3 text-right text-gray-600">{item.cantidad}</td>
                              <td className="px-4 py-3 text-right text-gray-600">
                                ${parseFloat(item.precio_unitario).toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-green-600">
                                ${(parseFloat(item.cantidad) * parseFloat(item.precio_unitario)).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-lg border-2 border-green-500">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total del Pedido:</span>
                    <span className="text-3xl font-bold text-green-600">
                      ${calcularTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Información de Pago */}
                {mesaSeleccionada.metodo_pago && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Método de Pago</p>
                    <p className="text-lg font-bold text-blue-600 capitalize">{mesaSeleccionada.metodo_pago}</p>
                  </div>
                )}

                <button
                  onClick={() => setMesaSeleccionada(null)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-bold transition"
                >
                  ❌ Cerrar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


