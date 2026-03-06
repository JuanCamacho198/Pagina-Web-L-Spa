import { neon } from '@neondatabase/serverless';

// Creamos y exportamos la instancia del cliente SQL de Neon
// Usamos la variable de entorno para la URL de conexión
export const sql = neon(import.meta.env.VITE_DATABASE_URL);
