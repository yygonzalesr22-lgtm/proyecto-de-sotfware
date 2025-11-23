import React from 'react';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg w-11/12 max-w-2xl">
        <div className="px-4 py-2 border-b flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-600">Cerrar</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
