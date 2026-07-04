import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Car, Wrench, Calendar, Building, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/clients', label: 'Clientes', icon: <Users size={20} /> },
  { to: '/vehicles', label: 'Vehículos', icon: <Car size={20} /> },
  { to: '/maintenances', label: 'Mantenimientos', icon: <Wrench size={20} /> },
  { to: '/schedule', label: 'Agenda', icon: <Calendar size={20} /> },
];

const adminLinks = [
  { to: '/workshops', label: 'Talleres', icon: <Building size={20} /> },
];

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isClient = user?.role === 'CLIENT';

  const filteredLinks = links.filter(link => {
    if (isClient) {
      return ['/dashboard', '/vehicles', '/maintenances'].includes(link.to);
    }
    return true;
  });

  return (
    <>
      <aside
        className={`bg-surface shadow-large h-full w-72 flex-col z-50 border-r border-gray-100
          fixed top-0 left-0 md:static md:flex md:w-64
          ${open ? 'flex animate-slide-in' : 'hidden'} md:flex`}
        style={{ height: '100vh', maxHeight: '100vh' }}
      >
        {/* Header del sidebar */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-primary-600 font-bold text-lg">AutoMaint</span>
            </div>
            {/* Botón cerrar solo en mobile */}
            <button 
              className="md:hidden p-1 rounded-lg hover:bg-gray-100 focus-ring" 
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {filteredLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={onClose}
              >
                <span className={`transition-colors ${link.to === '/dashboard' && 'text-primary-600'}`}>
                  {link.icon}
                </span>
                <span className="flex-1">{link.label}</span>
                {link.to === '/dashboard' && (
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Separador para admin */}
          {isAdmin && (
            <>
              <div className="my-4 border-t border-gray-200"></div>
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Administración
                  </span>
                </div>
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                    onClick={onClose}
                  >
                    <span className="transition-colors">{link.icon}</span>
                    <span className="flex-1">{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Users size={16} className="text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
