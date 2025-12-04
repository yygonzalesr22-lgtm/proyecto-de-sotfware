import React from 'react';

export default function FormField({ label, name, value, onChange, type = 'text', placeholder = '' }) {
  const inputId = `field-${name || Math.random()}`;
  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input id={inputId} name={name} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} type={type} placeholder={placeholder} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
    </div>
  );
}
