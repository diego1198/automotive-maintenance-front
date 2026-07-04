import React from 'react';

const colorMap = {
  SCHEDULED: 'bg-primary-500',
  IN_PROGRESS: 'bg-warning-500',
  COMPLETED: 'bg-success-500',
  CANCELLED: 'bg-danger-500',
};

const Badge = ({ status, children }) => (
  <span className={`px-2 py-1 rounded-lg text-xs font-semibold text-white ${colorMap[status] || 'bg-secondary-500'}`}>{children || status}</span>
);

export default Badge;
