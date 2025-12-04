
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { toggleMenu } = useMenu();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="text-white hover:bg-blue-700 p-2 rounded-lg transition text-2xl"
            title="Mostrar/Esconder menú"
          >
            ☰
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">☕</span>
            <h1 className="text-white font-bold text-2xl">Café Bar</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user.email && <span className="text-blue-100 text-sm">👤 {user.email}</span>}
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
