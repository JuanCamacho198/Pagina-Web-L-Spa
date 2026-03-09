import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getAuth0UserById } from '@/models/userModel';
import { Sparkles } from 'lucide-react';

export default function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAdminStatus = async () => {
      if (isAuthenticated && user?.sub) {
        // Primero intentamos leer el cache del NavBar para respuesta rapida
        const cachedRole = localStorage.getItem('lspa_admin_role');
        if (cachedRole === 'admin') {
          if (isMounted) setIsAdmin(true);
          return;
        }

        try {
          const dbUser = await getAuth0UserById(user.sub);
          if (isMounted) {
            setIsAdmin(dbUser?.role === 'admin');
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          if (isMounted) setIsAdmin(false);
        }
      } else {
        if (isMounted) setIsAdmin(false);
      }
    };

    if (!isLoading) {
      checkAdminStatus();
    }

    return () => {
      isMounted = false;
    };
  }, [user, isAuthenticated, isLoading]);

  if (isLoading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-500 font-medium animate-pulse">Verificando accesos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
