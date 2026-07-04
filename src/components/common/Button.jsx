import React from 'react';
import clsx from 'clsx';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled, 
  className = '', 
  ...props 
}) => {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring disabled:opacity-60 disabled:cursor-not-allowed';
  
  const sizes = {
    xs: 'px-2 py-1 text-xs rounded-md',
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl',
  };
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-soft hover:shadow-medium',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 shadow-soft hover:shadow-medium',
    success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 shadow-soft hover:shadow-medium',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-soft hover:shadow-medium',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 active:bg-warning-800 shadow-soft hover:shadow-medium',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-soft hover:shadow-medium',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  };
  
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        base, 
        sizes[size], 
        variants[variant], 
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
