import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signOut } from '../../lib/auth';
import { User } from '../../lib/auth';
import { Settings, ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavBarProps {
  user: User | null;
}

export default function NavBar({ user }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/', { replace: true });
  };

  const navLinkClass = "text-gray-600 hover:text-primary font-medium transition-colors duration-200";
  const mobileMenuBtnClass = "block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 w-full text-left";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              L-Spa
            </Link>
          </div>

          {/* Links Centro */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/services" className={navLinkClass}>Servicios</Link>
            {!user ? (
              <Link to="/sobre-nosotros" className={navLinkClass}>Sobre Nosotros</Link>
            ) : (
              <Link to="/citas" className={navLinkClass}>Citas</Link>
            )}
            <Link to="/contact" className={navLinkClass}>Contacto</Link>
          </div>

          {/* Acciones Derecha */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login" className="btn px-4 py-2 text-gray-700 hover:text-primary transition-colors">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary shadow-md hover:shadow-lg transform transition-all active:scale-95">
                  Registrarse
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Carrito */}
                <button
                  onClick={() => navigate('/carrito')}
                  className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-gray-50"
                  aria-label={`Carrito con ${cartCount} ítems`}
                >
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Menú Usuario */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-gray-50 flex items-center gap-1"
                    aria-label="Abrir menú de configuración"
                  >
                    <Settings size={22} className={cn("transition-transform duration-300", menuOpen && "rotate-90")} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link 
                        to="/profile" 
                        className={mobileMenuBtnClass}
                        onClick={() => setMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <UserIcon size={16} />
                          <span>Mi Perfil</span>
                        </div>
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button 
                        onClick={handleLogout}
                        className={cn(mobileMenuBtnClass, "text-red-600 hover:bg-red-50")}
                      >
                        <div className="flex items-center gap-2">
                          <LogOut size={16} />
                          <span>Cerrar Sesión</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Botón Menú Móvil */}
            <div className="md:hidden flex items-center">
              <button 
                className="text-gray-600 p-2"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                 <Settings size={22} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

