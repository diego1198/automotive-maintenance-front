import React from 'react';

const Select = React.forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="block mb-1 text-sm font-medium text-secondary">{label}</label>}
    <select
      ref={ref}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${error ? 'border-danger' : 'border-gray-300'}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-danger">{error}</p>}
  </div>
));

export default Select;
