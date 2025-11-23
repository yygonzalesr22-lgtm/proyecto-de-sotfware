import React from 'react';

export default function Home() {
  const stats = [
    { icon: '🍽️', label: 'Productos', value: '0', color: 'bg-blue-500' },
    { icon: '🗂️', label: 'Categorías', value: '0', color: 'bg-green-500' },
    { icon: '📦', label: 'Inventario', value: '0', color: 'bg-yellow-500' },
    { icon: '📊', label: 'Ventas Hoy', value: '$0', color: 'bg-red-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🏠 Bienvenido al Panel</h1>
        <p className="text-gray-600">Gestiona tu café bar de manera eficiente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition`}>
            <div className="text-3xl mb-2">{stat.icon}</div>
            <h3 className="font-semibold text-lg">{stat.label}</h3>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Actividades Recientes</h2>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3 pb-3 border-b">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-medium text-gray-800">Producto agregado</p>
                <p className="text-sm text-gray-500">Hace 2 horas</p>
              </div>
            </li>
            <li className="flex items-center space-x-3 pb-3 border-b">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-medium text-gray-800">Nueva categoría creada</p>
                <p className="text-sm text-gray-500">Hace 4 horas</p>
              </div>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-medium text-gray-800">Inventario actualizado</p>
                <p className="text-sm text-gray-500">Hace 1 día</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💡 Accesos Rápidos</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition font-semibold">
              ➕ Nuevo Producto
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition font-semibold">
              ➕ Nueva Categoría
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg transition font-semibold">
              📊 Ver Reportes
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg transition font-semibold">
              📋 Gestionar Pedidos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
