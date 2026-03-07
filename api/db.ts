import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';

// Utilizar process.env para Node.js (Vercel Serverless)
const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL no está definida');
}

const client = neon(connectionString);
export const db = drizzle(client, { schema });
export * from '../src/db/schema';
