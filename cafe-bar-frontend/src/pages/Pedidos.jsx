import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function Pedidos() {
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [mesaNumber, setMesaNumber] = useState('');
  const [meseroName, setMeseroName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchFilter, setSearchFilter] = useState('all'); // 'all', 'nombre', 'id_producto', 'categoria', 'id_categoria'

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/api/productos');
        // Mapear datos como en Productos.jsx
        const mappedData = data.map(item => ({
          ...item,
          id: item.id_producto,
          categoria_id: item.id_categoria
        }));
        setProductos(mappedData);
        setFilteredProducts(mappedData);
      } catch (err) {
        setError('Error al cargar productos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Filtrar productos según búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(productos);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    let filtered = productos;

    if (searchFilter === 'nombre') {
      filtered = productos.filter(p => p.nombre.toLowerCase().includes(term));
    } else if (searchFilter === 'id_producto') {
      filtered = productos.filter(p => p.id_producto.toString().includes(term));
    } else if (searchFilter === 'categoria') {
      filtered = productos.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.id_categoria.toString().includes(term)
      );
    } else if (searchFilter === 'id_categoria') {
      filtered = productos.filter(p => p.id_categoria.toString().includes(term));
    } else {
      // all - buscar en todos los campos
      filtered = productos.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.id_producto.toString().includes(term) ||
        p.id_categoria.toString().includes(term) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(term))
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, searchFilter, productos]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id_producto === product.id_producto);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id_producto === product.id_producto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        id_producto: product.id_producto,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1,
        subtotal: parseFloat(product.precio)
      }]);
    }
  };

  // Actualizar cantidad en carrito
  const updateCartQuantity = (id_producto, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(id_producto);
    } else {
      setCartItems(cartItems.map(item =>
        item.id_producto === id_producto
          ? {
              ...item,
              cantidad,
              subtotal: parseFloat(item.precio) * cantidad
            }
          : item
      ));
    }
  };

  // Remover producto del carrito
  const removeFromCart = (id_producto) => {
    setCartItems(cartItems.filter(item => item.id_producto !== id_producto));
  };

  // Calcular total
  const total = cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  // Crear pedido
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    
    if (!mesaNumber || !meseroName || cartItems.length === 0) {
      setError('Por favor, completa todos los campos y agrega al menos un producto');
      return;
    }

    try {
      setError('');
      setSuccessMessage('');

      // Crear pedido
      const orderResponse = await apiClient.post('/api/pedidos', {
        id_mesa: parseInt(mesaNumber),
        mesero: meseroName,
        estado: 'pendiente'
      });

      const orderId = orderResponse.id_pedido || orderResponse.id;

      // Agregar productos al pedido
      for (const item of cartItems) {
        await apiClient.post(`/api/pedidos/${orderId}/agregar`, {
          id_producto: item.id_producto,
          cantidad: item.cantidad
        });
      }

      setSuccessMessage(`✅ Pedido #${orderId} creado exitosamente para la mesa ${mesaNumber}`);
      
      // Limpiar formulario
      setCartItems([]);
      setMesaNumber('');
      setMeseroName('');
      setSearchTerm('');

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al crear pedido: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📋 Crear Pedido</h1>
          <p className="text-gray-600">Busca productos y crea pedidos asignados a mesas</p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lado izquierdo: Búsqueda y productos */}
          <div className="lg:col-span-2">
            {/* Búsqueda */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Buscar Productos</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por:
                </label>
                <select
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">Todos los campos</option>
                  <option value="nombre">Nombre del producto</option>
                  <option value="id_producto">ID del producto</option>
                  <option value="id_categoria">ID de categoría</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Escribe para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-2"
              />
              <p className="text-sm text-gray-600">
                {filteredProducts.length} de {productos.length} productos encontrados
              </p>
            </div>

            {/* Lista de productos */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Productos Disponibles</h2>
              
              {loading ? (
                <p className="text-gray-500">Cargando productos...</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-gray-500">No hay productos que coincidan con la búsqueda</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id_producto}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-amber-50 transition"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          [{product.id_producto}] {product.nombre}
                        </div>
                        <div className="text-sm text-gray-600">
                          Categoría: {product.id_categoria} | Stock: {product.stock_actual}
                        </div>
                        <div className="text-sm font-bold text-amber-600">
                          ${parseFloat(product.precio).toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="ml-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium"
                      >
                        Agregar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Lado derecho: Carrito y datos del pedido */}
          <div className="lg:col-span-1">
            {/* Datos del pedido */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Detalles del Pedido</h2>
              
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Mesa
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={mesaNumber}
                    onChange={(e) => setMesaNumber(e.target.value)}
                    placeholder="Ej: 1-11"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Mesero
                  </label>
                  <input
                    type="text"
                    value={meseroName}
                    onChange={(e) => setMeseroName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cartItems.length === 0 || !mesaNumber || !meseroName}
                  className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✅ Crear Pedido
                </button>
              </form>
            </div>

            {/* Carrito */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🛒 Carrito ({cartItems.length})
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Carrito vacío</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                    {cartItems.map(item => (
                      <div
                        key={item.id_producto}
                        className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{item.nombre}</div>
                          <div className="text-sm text-gray-600">
                            ${parseFloat(item.precio).toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.id_producto, item.cantidad - 1)}
                            className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold">{item.cantidad}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id_producto, item.cantidad + 1)}
                            className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id_producto)}
                            className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-semibold text-gray-800">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-amber-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
