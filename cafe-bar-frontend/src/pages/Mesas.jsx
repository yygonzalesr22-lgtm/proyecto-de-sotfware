import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function Mesas() {
  const [mesas, setMesas] = useState([]);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detallesPedidos, setDetallesPedidos] = useState({});
  const [montoRecibido, setMontoRecibido] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [loadingDetalles, setLoadingDetalles] = useState(false);

  useEffect(() => {
    cargarMesasYPedidos();
    const interval = setInterval(cargarMesasYPedidos, 5000);
    return () => clearInterval(interval);
  }, []);

  const cargarMesasYPedidos = async () => {
    try {
      const [mesasData, pedidosData] = await Promise.all([
        apiClient.get('/api/mesas'),
        apiClient.get('/api/pedidos')
      ]);

      const pedidosPorMesa = {};
      pedidosData.forEach(pedido => {
        if (pedido.estado !== 'cancelado' && pedido.estado !== 'cerrado') {
          if (!pedidosPorMesa[pedido.id_mesa]) {
            pedidosPorMesa[pedido.id_mesa] = [];
          }
          pedidosPorMesa[pedido.id_mesa].push(pedido);
        }
      });

      const mesasActualizadas = mesasData.map(mesa => ({
        ...mesa,
        estado: pedidosPorMesa[mesa.id_mesa] ? 'ocupada' : 'disponible',
        pedidos: pedidosPorMesa[mesa.id_mesa] || []
      }));

      setMesas(mesasActualizadas);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const cargarDetallesPedidos = async (mesa) => {
    setLoadingDetalles(true);
    try {
      const detalles = {};
      let totalGeneral = 0;

      for (const pedido of mesa.pedidos) {
        const data = await apiClient.get(`/api/pedidos/${pedido.id_pedido}`);
        const items = data.detalles || [];
        const total = items.reduce((sum, item) => 
          sum + (parseFloat(item.cantidad) * parseFloat(item.precio_unitario)), 0
        );
        detalles[pedido.id_pedido] = { items, total };
        totalGeneral += total;
      }

      setDetallesPedidos(detalles);
      setSelectedMesa({
        ...mesa,
        totalGeneral
      });
    } catch (err) {
      console.error('Error cargando detalles:', err);
    } finally {
      setLoadingDetalles(false);
    }
  };

  const handleMesaClick = async (mesa) => {
    setMontoRecibido('');
    setMetodoPago('efectivo');
    if (mesa.pedidos.length > 0) {
      await cargarDetallesPedidos(mesa);
    } else {
      setSelectedMesa(mesa);
      setDetallesPedidos({});
    }
    setShowModal(true);
  };

  const calcularCambio = () => {
    if (!selectedMesa || !montoRecibido) return 0;
    const monto = parseFloat(montoRecibido) || 0;
    const total = selectedMesa.totalGeneral || 0;
    return monto - total;
  };

  const cerrarMesa = async () => {
    if (!selectedMesa || selectedMesa.pedidos.length === 0) return;

    const cambio = calcularCambio();
    const monto = parseFloat(montoRecibido) || 0;

    if (metodoPago === 'efectivo' && monto < (selectedMesa.totalGeneral || 0)) {
      alert('❌ El monto recibido es menor al total');
      return;
    }

    try {
      for (const pedido of selectedMesa.pedidos) {
        await apiClient.post(`/api/pedidos/${pedido.id_pedido}/cerrar`, {
          metodo_pago: metodoPago,
          monto_recibido: metodoPago === 'efectivo' ? monto : (selectedMesa.totalGeneral || 0)
        });
      }

      await cargarMesasYPedidos();
      setShowModal(false);
      
      if (metodoPago === 'efectivo') {
        alert(`✅ Mesa cerrada correctamente\n💵 Método: ${metodoPago}\n💵 Cambio: $${cambio.toFixed(2)}`);
      } else {
        alert(`✅ Mesa cerrada correctamente\n💳 Método: ${metodoPago}\n💳 Total: $${(selectedMesa.totalGeneral || 0).toFixed(2)}`);
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Mesas</h1>
        <p className="text-gray-600">Estado de las mesas vinculado con pedidos</p>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Cargando...</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-500">
              <p className="text-green-800 font-semibold">✅ Disponible</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg border-2 border-red-500">
              <p className="text-red-800 font-semibold">🚫 Ocupada (con pedido)</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-500">
              <p className="text-blue-800 font-semibold">📋 Haz clic para detalles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mesas.map((mesa) => (
              <button
                key={mesa.id_mesa}
                onClick={() => handleMesaClick(mesa)}
                className={`${
                  mesa.estado === 'disponible'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                } text-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition font-bold text-xl`}
              >
                <div className="text-4xl mb-2">{mesa.estado === 'disponible' ? '✅' : '🚫'}</div>
                <div className="text-2xl mb-2">Mesa {mesa.numero}</div>
                {mesa.pedidos.length > 0 && (
                  <div className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                    📋 {mesa.pedidos.length} pedido(s)
                  </div>
                )}
              </button>
            ))}
          </div>

          {showModal && selectedMesa && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-2">{selectedMesa.estado === 'disponible' ? '✅' : '🚫'}</div>
                  <h2 className="text-3xl font-bold text-gray-800">Mesa {selectedMesa.numero}</h2>
                  <p className="text-gray-600 text-lg mt-2">
                    {selectedMesa.estado === 'disponible' ? '✅ Disponible' : '🚫 Ocupada'}
                  </p>
                </div>

                {selectedMesa.pedidos.length > 0 ? (
                  <>
                    {loadingDetalles ? (
                      <p className="text-gray-500 text-center py-4">Cargando detalles...</p>
                    ) : (
                      <>
                        {/* Historial de Pedidos */}
                        <div className="mb-8">
                          <h3 className="text-2xl font-bold text-gray-800 mb-4">📋 Historial de Pedidos</h3>
                          <div className="space-y-4">
                            {selectedMesa.pedidos.map(pedido => (
                              <div key={pedido.id_pedido} className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="font-bold text-lg text-gray-800">Pedido #{pedido.id_pedido}</p>
                                    <p className="text-sm text-gray-600">Mesero: <span className="font-semibold">{pedido.mesero}</span></p>
                                    <p className="text-sm text-gray-600">Estado: <span className="font-semibold capitalize">{pedido.estado}</span></p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Hora:</p>
                                    <p className="font-semibold">{new Date(pedido.fecha_hora).toLocaleTimeString()}</p>
                                  </div>
                                </div>

                                {/* Productos del Pedido */}
                                {detallesPedidos[pedido.id_pedido] && (
                                  <div className="bg-white rounded p-3 mb-3">
                                    <table className="w-full text-sm">
                                      <thead className="border-b border-gray-300">
                                        <tr>
                                          <th className="text-left font-semibold text-gray-700">Producto</th>
                                          <th className="text-center font-semibold text-gray-700">Cant.</th>
                                          <th className="text-right font-semibold text-gray-700">Precio</th>
                                          <th className="text-right font-semibold text-gray-700">Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {detallesPedidos[pedido.id_pedido].items.map((item, idx) => (
                                          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-2 text-gray-800">{item.nombre}</td>
                                            <td className="text-center text-gray-600">{item.cantidad}</td>
                                            <td className="text-right text-gray-600">${parseFloat(item.precio_unitario).toFixed(2)}</td>
                                            <td className="text-right font-semibold text-green-600">
                                              ${(parseFloat(item.cantidad) * parseFloat(item.precio_unitario)).toFixed(2)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}

                                {detallesPedidos[pedido.id_pedido] && (
                                  <div className="text-right p-2 bg-green-100 rounded">
                                    <p className="text-sm text-gray-600">Total Pedido:</p>
                                    <p className="text-2xl font-bold text-green-600">
                                      ${detallesPedidos[pedido.id_pedido].total.toFixed(2)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Resumen Total y Cálculo de Cambio */}
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg border-2 border-orange-400 mb-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-4">💰 Cálculo de Pago</h3>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <p className="text-gray-700 text-sm font-semibold mb-1">Total a Pagar:</p>
                              <p className="text-3xl font-bold text-red-600">
                                ${(selectedMesa.totalGeneral || 0).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-700 text-sm font-semibold mb-1">Monto Recibido:</p>
                              <input
                                type="number"
                                value={montoRecibido}
                                onChange={(e) => setMontoRecibido(e.target.value)}
                                placeholder="Ingresa monto recibido"
                                disabled={metodoPago !== 'efectivo'}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-2xl font-bold text-blue-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
                              />
                            </div>
                          </div>

                          {/* Selector de Método de Pago */}
                          <div className="mb-6">
                            <p className="text-gray-700 text-sm font-semibold mb-3">Método de Pago:</p>
                            <div className="grid grid-cols-3 gap-3">
                              <button
                                onClick={() => {
                                  setMetodoPago('efectivo');
                                  setMontoRecibido('');
                                }}
                                className={`py-3 px-4 rounded-lg font-bold transition border-2 ${
                                  metodoPago === 'efectivo'
                                    ? 'bg-green-500 text-white border-green-600'
                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                }`}
                              >
                                💵 Efectivo
                              </button>
                              <button
                                onClick={() => setMetodoPago('tarjeta_digital')}
                                className={`py-3 px-4 rounded-lg font-bold transition border-2 ${
                                  metodoPago === 'tarjeta_digital'
                                    ? 'bg-blue-500 text-white border-blue-600'
                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                }`}
                              >
                                💳 Tarjeta Digital
                              </button>
                              <button
                                onClick={() => setMetodoPago('transferencia')}
                                className={`py-3 px-4 rounded-lg font-bold transition border-2 ${
                                  metodoPago === 'transferencia'
                                    ? 'bg-purple-500 text-white border-purple-600'
                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                }`}
                              >
                                🔄 Transferencia
                              </button>
                            </div>
                          </div>

                          {/* Mostrar cambio solo para efectivo */}
                          {metodoPago === 'efectivo' && (
                            <div className="bg-white p-4 rounded-lg border-2 border-green-500">
                              <p className="text-gray-700 text-sm font-semibold mb-2">💵 Cambio a Devolver:</p>
                              <p className={`text-4xl font-bold ${
                                calcularCambio() >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ${calcularCambio().toFixed(2)}
                              </p>
                              {calcularCambio() < 0 && (
                                <p className="text-red-600 font-semibold mt-2">
                                  ⚠️ Falta: ${Math.abs(calcularCambio()).toFixed(2)}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Mostrar confirmación para métodos no efectivo */}
                          {metodoPago !== 'efectivo' && (
                            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-500">
                              <p className="text-blue-700 text-sm font-semibold mb-2">✅ Confirmación de Pago</p>
                              <p className="text-blue-900 text-lg font-bold">
                                Total a cobrar: ${(selectedMesa.totalGeneral || 0).toFixed(2)}
                              </p>
                              <p className="text-blue-600 text-sm mt-2">
                                Método: {metodoPago === 'tarjeta_digital' ? '💳 Tarjeta Digital' : '🔄 Transferencia'}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex gap-3">
                          <button
                            onClick={cerrarMesa}
                            disabled={
                              metodoPago === 'efectivo'
                                ? !montoRecibido || parseFloat(montoRecibido) < (selectedMesa.totalGeneral || 0)
                                : false
                            }
                            className={`flex-1 text-white px-4 py-3 rounded-lg font-bold transition ${
                              metodoPago === 'efectivo'
                                ? 'bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                : metodoPago === 'tarjeta_digital'
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-purple-500 hover:bg-purple-600'
                            }`}
                          >
                            {metodoPago === 'efectivo'
                              ? '💵 Cobrar y Cerrar Mesa'
                              : metodoPago === 'tarjeta_digital'
                              ? '💳 Confirmar Pago Digital'
                              : '🔄 Confirmar Transferencia'}
                          </button>
                          <button
                            onClick={() => setShowModal(false)}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-bold transition"
                          >
                            ❌ Cancelar
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4 text-lg">✅ Mesa disponible</p>
                    <a href="/pedidos" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition">
                      ➕ Crear Nuevo Pedido
                    </a>
                    <button
                      onClick={() => setShowModal(false)}
                      className="block w-full mt-3 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-bold"
                    >
                      ❌ Cerrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
