import React from 'react';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import { User, Menu, LogOut } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="w-full h-16 bg-surface shadow-card border-b border-gray-100 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Botón menú solo en mobile */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus-ring transition-colors" 
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <Menu size={24} className="text-primary-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-primary-600 font-bold text-xl tracking-tight">AutoMaint</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 text-sm">{user.name}</span>
              <span className="text-xs text-gray-500">{user.role}</span>
            </div>
          </div>
        )}
        <Button 
          variant="danger" 
          onClick={logout} 
          className="flex items-center gap-2 px-3 py-2 text-sm"
          size="sm"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
