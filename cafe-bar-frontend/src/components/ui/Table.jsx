import React from 'react';

export default function Table({ columns = [], data = [], onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="w-full bg-white">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            {columns.map((c) => (
              <th key={c.key} className="px-6 py-3 text-left font-semibold text-sm">{c.title}</th>
            ))}
            <th className="px-6 py-3 text-left font-semibold text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">No hay datos</td></tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition">
                {columns.map((c) => (
                  <td key={c.key} className="px-6 py-4 text-sm text-gray-700">{row[c.key]}</td>
                ))}
                <td className="px-6 py-4 text-sm">
                  <button onClick={() => onEdit?.(row)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition mr-2">Editar</button>
                  <button onClick={() => onDelete?.(row)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
