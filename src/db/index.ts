import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// URL de conexión desde variables de entorno
const connectionString = (import.meta as any).env.VITE_DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL no está definida en el archivo .env');
}

// Cliente HTTP de Neon
const client = neon(connectionString);

// Instancia de base de datos Drizzle con el esquema tipado
export const db = drizzle(client, { 
  schema,
  logger: false 
});

// Configuración opcional para suprimir advertencias en el navegador de Neon
// @ts-ignore
if (typeof window !== 'undefined') {
  (client as any).disableWarningInBrowsers = true;
}

// Exportar todo el esquema para conveniencia
export * from './schema';
