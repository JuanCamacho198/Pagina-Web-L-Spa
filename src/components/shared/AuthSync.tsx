import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { saveUserData } from '../../models/userModel';

/**
 * Componente que se encarga de sincronizar el usuario de Auth0 con la base de datos de Postgres.
 * Se debe colocar dentro del Router para que tenga acceso al contexto de Auth0.
 */
export function AuthSync() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoading && isAuthenticated && user) {
        try {
          // Extraemos los datos necesarios del objeto user de Auth0
          const userData = {
            auth0Id: user.sub || '',
            email: user.email || '',
            name: user.name || user.nickname || '',
            role: 'customer' as const, // Rol por defecto para nuevos usuarios
          };

          if (userData.auth0Id) {
            console.log('Sincronizando usuario con Postgres:', userData.email);
            await saveUserData(userData);
          }
        } catch (error) {
          console.error('Error al sincronizar el usuario con la base de datos:', error);
        }
      }
    };

    syncUser();
  }, [user, isAuthenticated, isLoading]);

  return null; // Este componente no renderiza nada
}
