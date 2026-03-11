import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Settings, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  PlusCircle, 
  Home, 
  Sparkle, 
  Calendar, 
  Menu, 
  X,
  MessageSquare,
  Info,
  Moon,
  Sun
} from 'lucide-react';
import logo from '@assets/logos/LOGO.svg';
import { useCart } from '@context/CartContext';
import { useNavbarStore } from '@context/NavbarStore';
import { useTheme } from '@context/ThemeContext';
import { getAuth0UserById } from '@models/userModel';
import { cn } from '@/lib/utils';

interface NavBarProps {
  user: any;
  previewSettings?: {
    logoUrl?: string;
    brandText?: string;
    showLogo?: boolean;
    showText?: boolean;
    logoSize?: number;
    textSize?: number;
    logoTextSpacing?: number;
    fontFamily?: string;
    customFontUrl?: string;
  };
}

export default function NavBar({ user, previewSettings }: NavBarProps) {
  const settingsFromStore = useNavbarStore();
  
  // Usar settings de preview si existen, si no usar las del store
  const logoUrl = previewSettings?.logoUrl ?? settingsFromStore.logoUrl;
  const brandText = previewSettings?.brandText ?? settingsFromStore.brandText;
  const showLogo = previewSettings?.showLogo ?? settingsFromStore.showLogo;
  const showText = previewSettings?.showText ?? settingsFromStore.showText;
  const logoSize = previewSettings?.logoSize ?? settingsFromStore.logoSize;
  const textSize = previewSettings?.textSize ?? settingsFromStore.textSize;
  const logoTextSpacing = previewSettings?.logoTextSpacing ?? settingsFromStore.logoTextSpacing;
  const fontFamily = previewSettings?.fontFamily ?? settingsFromStore.fontFamily;
  const customFontUrl = previewSettings?.customFontUrl ?? settingsFromStore.customFontUrl;

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (customFontUrl) {
      const fontFace = new FontFace('CustomNavbarFont', `url(${customFontUrl})`);
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
      }).catch(err => console.error("Error cargando fuente personalizada:", err));
    }
  }, [customFontUrl]);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, loginWithRedirect, isAuthenticated } = useAuth0();

  // Cache key for admin role
  const ADMIN_ROLE_CACHE_KEY = 'lspa_admin_role';

  useEffect(() => {
    const checkAdminRole = async () => {
      if (isAuthenticated && user?.sub) {
        // Try to get from cache first for immediate display
        const cachedRole = localStorage.getItem(ADMIN_ROLE_CACHE_KEY);
        if (cachedRole) {
          setIsAdmin(cachedRole === 'admin');
        }
        
        try {
          const dbUser = await getAuth0UserById(user.sub);
          const isAdminUser = dbUser?.role === 'admin';
          setIsAdmin(isAdminUser);
          // Cache the role
          localStorage.setItem(ADMIN_ROLE_CACHE_KEY, dbUser?.role || 'customer');
        } catch (error) {
          console.error("Error verificando rol de admin:", error);
          // Keep cached value or default to false
          if (!cachedRole) {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminRole();
  }, [user, isAuthenticated]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const navLinkClass = (path: string) => cn(
    "text-sm font-bold uppercase tracking-widest transition-all duration-300 relative py-2 px-1",
    location.pathname === path 
      ? "text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full" 
      : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
  );

  const mobileLinkClass = (path: string) => cn(
    "flex items-center gap-4 px-6 py-4 rounded-4xlxl w-full text-left transition-all duration-300 font-bold uppercase tracking-wider text-xs",
    location.pathname === path 
      ? "bg-primary text-white shadow-lg shadow-primary/20" 
      : "text-gray-700 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary-light"
  );

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="shrink-0 flex items-center group">
              {showLogo && (
                <div 
                  className="flex items-center justify-center group-hover:scale-105 transition-all duration-300"
                  style={{ marginRight: showText ? `${logoTextSpacing}px` : '0px' }}
                >
                  <img 
                    src={logoUrl || logo} 
                    alt={`${brandText} Logo`} 
                    style={{ height: `${logoSize}px` }}
                    className="w-auto object-contain" 
                  />
                </div>
              )}
              {showText && (
                <span 
                  style={{ 
                    fontSize: `${textSize}px`,
                    fontFamily: fontFamily === 'custom' ? 'CustomNavbarFont' : fontFamily === 'serif' ? 'serif' : fontFamily === 'mono' ? 'monospace' : 'inherit'
                  }}
                  className={cn(
                    "font-black bg-linear-to-r from-primary to-primary-dark bg-clip-text text-transparent tracking-tighter uppercase transition-all duration-300",
                    fontFamily === 'serif' && "font-serif"
                  )}
                >
                  {brandText}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-10 items-center">
              {!previewSettings && (
                <>
                  <Link to="/home" className={navLinkClass('/home')}>Inicio</Link>
                  <Link to="/services" className={navLinkClass('/services')}>Servicios</Link>
                  <Link to="/contact" className={navLinkClass('/contact')}>Contacto</Link>
                </>
              )}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
{isAuthenticated && !previewSettings ? (
                <>
                  {/* Theme Toggle */}
                  {!previewSettings && (
                    <button
                      onClick={toggleTheme}
                      className="p-2.5 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all duration-300 rounded-4xll hover:bg-primary/5 dark:hover:bg-primary/10"
                      title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                    >
                      {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                    </button>
                  )}

                  <button
                    onClick={() => navigate('/cart')}
                    className="relative p-2.5 text-gray-500 hover:text-primary transition-all duration-300 rounded-4xll hover:bg-primary/5 group"
                  >
                    <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-white animate-in zoom-in">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <div className="hidden md:block relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className={cn(
                        "p-1 rounded-4xlxl flex items-center gap-2 border-2 transition-all duration-300 hover:shadow-md",
                        menuOpen ? "border-primary bg-primary/5 shadow-inner" : "border-gray-100 bg-white"
                      )}
                    >
                      <div className="w-8 h-8 rounded-4xll bg-gray-100 overflow-hidden">
                        {user?.picture ? (
                          <img src={user.picture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <UserIcon size={16} />
                          </div>
                        )}
                      </div>
                      <Settings size={18} className={cn("text-gray-400 mr-1 transition-transform duration-500", menuOpen && "rotate-180 text-primary")} />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-4xlxl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="px-4 py-3 mb-2 border-b border-gray-50">
                          <p className="text-xs font-black text-primary uppercase tracking-widest mb-0.5">Bienvenido</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user?.name || user?.email}</p>
                        </div>
                        
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors">
                          <UserIcon size={18} /> Mi Perfil
                        </Link>
                        
                        <Link to="/appointments" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors">
                          <Calendar size={18} /> Mis Citas
                        </Link>
                        
                        {isAdmin && (
                          <>
                            <div className="px-4 py-2 mt-2">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Administración</p>
                            </div>
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
                              <Settings size={18} /> Panel Admin
                            </Link>
                            <Link to="/admin/services" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
                              <PlusCircle size={18} /> Gestionar Servicios
                            </Link>
                          </>
                        )}

                        <hr className="my-2 border-gray-100" />
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={18} /> Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                !previewSettings && (
                  <div className="hidden md:flex items-center gap-3">
                    <button onClick={() => loginWithRedirect()} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-primary transition-colors">
                      INICIA SESION
                    </button>
                    <button 
                      onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
                      className="px-6 py-2.5 text-sm font-black bg-primary text-white rounded-4xll shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                      REGISTRARSE
                    </button>
                  </div>
                )
              )}

              {/* Mobile Menu Toggle */}
              {!previewSettings && (
                <button 
                  className="md:hidden p-2.5 text-gray-500 hover:text-primary transition-all duration-300 rounded-4xll hover:bg-primary/5"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        {mobileMenuOpen && !previewSettings && (
          <div className={cn(
            "fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out",
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className={cn(
              "absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-500 p-6 flex flex-col",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                 <span className="text-xl font-black text-primary tracking-tighter">MENÚ L-SPA</span>
                 <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400">
                   <X size={24} />
                 </button>
              </div>

<div className="flex flex-col gap-2 grow overflow-y-auto pr-2 custom-scrollbar">
                <Link to="/home" className={mobileLinkClass('/home')}><Home size={20} /> Inicio</Link>
                <Link to="/services" className={mobileLinkClass('/services')}><Sparkle size={20} /> Servicios</Link>
                <Link to="/contact" className={mobileLinkClass('/contact')}><MessageSquare size={20} /> Contacto</Link>
                
                {/* Theme Toggle - Mobile */}
                <button 
                  onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                  className={mobileLinkClass('')}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} 
                  {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                </button>
                
                <hr className="my-4 border-gray-100" />
                
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className={mobileLinkClass('/profile')}><UserIcon size={20} /> Mi Perfil</Link>
                    <Link to="/appointments" className={mobileLinkClass('/appointments')}><Calendar size={20} /> Mis Citas</Link>
                    <Link to="/about-us" className={mobileLinkClass('/about-us')}><Info size={20} /> Información</Link>
                    {isAdmin && (
                      <Link to="/admin" className={cn(mobileLinkClass('/admin'), "text-primary")}><Settings size={20} /> Panel Admin</Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-4xlxl w-full text-left transition-all duration-300 font-bold uppercase tracking-wider text-xs text-red-500 hover:bg-red-50 mt-auto">
                      <LogOut size={20} /> Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <div className="mt-auto space-y-3">
                    <button onClick={() => loginWithRedirect()} className="w-full py-4 text-sm font-black text-gray-700 bg-gray-50 rounded-4xlxl transition-all">
                      INICIAR SESIÓN
                    </button>
                    <button 
                      onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
                      className="w-full py-4 text-sm font-black text-white bg-primary rounded-4xlxl shadow-xl shadow-primary/20 transition-all"
                    >
                      CREAR CUENTA
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

