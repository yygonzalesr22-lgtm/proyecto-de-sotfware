import React from 'react';

export default function FormField({ label, name, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input name={name} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} type={type} placeholder={placeholder} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
    </div>
  );
}
