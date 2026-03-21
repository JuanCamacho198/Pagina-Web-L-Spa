import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const neonSql = neon(process.env.DATABASE_URL || '');
export const db = drizzle(neonSql, { schema });

// Re-export schema and commonly used Drizzle helpers so consumers
// (apps/backend) import them from the same module instance and keep types aligned.
export * from './schema';
export { eq, and, or, ne, like, desc, asc, sql, count } from 'drizzle-orm';
