import React from 'react';
import { Inbox, Users, Car, Wrench, Calendar, Building } from 'lucide-react';

const EmptyState = ({ 
  message = 'No hay datos para mostrar', 
  description = 'Comienza agregando nuevos registros',
  icon = 'inbox',
  className = '',
  action
}) => {
  const icons = {
    inbox: <Inbox size={48} className="text-gray-400" />,
    users: <Users size={48} className="text-gray-400" />,
    car: <Car size={48} className="text-gray-400" />,
    wrench: <Wrench size={48} className="text-gray-400" />,
    calendar: <Calendar size={48} className="text-gray-400" />,
    building: <Building size={48} className="text-gray-400" />,
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icons[icon] || icons.inbox}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-6">{description}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
