import React from 'react';

export default function Alert({ type = 'info', children }) {
  const styles = {
    error: 'bg-red-50 border-l-4 border-red-500 text-red-700',
    success: 'bg-green-50 border-l-4 border-green-500 text-green-700',
    info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
  };

  return (
    <div className={`${styles[type] || styles.info} px-4 py-3 rounded-r-lg mb-4 font-medium`}>{children}</div>
  );
}
