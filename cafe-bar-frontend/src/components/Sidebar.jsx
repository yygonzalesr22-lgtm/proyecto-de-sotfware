import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { icon: '🏠', label: 'Inicio', path: '/' },
    { icon: '👥', label: 'Usuarios', path: '/usuarios' },
    { icon: '🗂️', label: 'Categorías', path: '/categorias' },
    { icon: '🍽️', label: 'Productos', path: '/productos' },
    { icon: '📦', label: 'Inventario', path: '/inventario' },
    { icon: '📊', label: 'Mesas', path: '/mesas' },
    { icon: '📋', label: 'Pedidos', path: '/pedidos' },
    { icon: '📈', label: 'Reportes', path: '/reportes' },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 fixed overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-400">☕ Menú</h2>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition font-medium text-gray-200 hover:text-white"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
