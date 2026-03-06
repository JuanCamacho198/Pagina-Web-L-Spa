import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// URL de conexión desde variables de entorno
const connectionString = import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL no está definida en el archivo .env');
}

// Cliente HTTP de Neon
const client = neon(connectionString);

// Instancia de base de datos Drizzle con el esquema tipado
export const db = drizzle(client, { schema });

// Exportar todo el esquema para conveniencia
export * from './schema';
