import React from 'react';

export default function FormField({ label, name, value, onChange, type = 'text' }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input name={name} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} type={type} className="w-full px-3 py-2 border rounded" />
    </div>
  );
}
