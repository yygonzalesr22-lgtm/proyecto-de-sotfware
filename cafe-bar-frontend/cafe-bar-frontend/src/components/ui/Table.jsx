import React from 'react';

export default function Table({ columns = [], data = [], onEdit, onDelete }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 text-left">{c.title}</th>
            ))}
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-2">{row[c.key]}</td>
              ))}
              <td className="px-4 py-2">
                <button onClick={() => onEdit?.(row)} className="mr-2 text-blue-600">Editar</button>
                <button onClick={() => onDelete?.(row)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
