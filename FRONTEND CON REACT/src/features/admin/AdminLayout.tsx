import React from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Users, 
  Settings, 
  ChevronLeft,
  Sparkles,
  Link,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    label: 'Dashboard', 
    href: '/admin', 
    icon: LayoutDashboard 
  },
  { 
    label: 'Reservas', 
    href: '/admin/bookings', 
    icon: Calendar 
  },
  { 
    label: 'Servicios', 
    href: '/admin/services', 
    icon: Scissors 
  },
  { 
    label: 'Usuarios', 
    href: '/admin/users', 
    icon: Users 
  },
  { 
    label: 'Navbar', 
    href: '/admin/navbar', 
    icon: Layout 
  },
  { 
    label: 'Footer', 
    href: '/admin/footer', 
    icon: LayoutDashboard 
  },
  { 
    label: 'Redes Sociales', 
    href: '/admin/social', 
    icon: Link 
  },
];

export default function AdminLayout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200/60 dark:border-gray-700 shadow-sm z-40">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">L-Spa</span>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-orange-700 dark:text-orange-400 shadow-sm border border-orange-100 dark:border-orange-900/30" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-orange-600 dark:text-orange-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                )} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                )}
              </NavLink>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Administrador</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Panel de control</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700 sticky top-0 z-30">
          <div className="h-full px-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {navItems.find(item => 
                  location.pathname === item.href || 
                  (item.href !== '/admin' && location.pathname.startsWith(item.href))
                )?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
