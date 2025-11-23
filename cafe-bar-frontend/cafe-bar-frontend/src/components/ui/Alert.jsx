import React from 'react';

export default function Alert({ type = 'info', children }) {
  const bg = type === 'error' ? 'bg-red-100' : type === 'success' ? 'bg-green-100' : 'bg-blue-100';
  const text = type === 'error' ? 'text-red-800' : type === 'success' ? 'text-green-800' : 'text-blue-800';

  return (
    <div className={`${bg} ${text} px-4 py-2 rounded`}>{children}</div>
  );
}
