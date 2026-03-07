import { db } from '../db';
import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

// Definición local de siteConfig por si no se importa bien
const siteConfig = pgTable('site_config', {
  id: varchar('id', { length: 50 }).primaryKey(),
  data: text('data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      if (!id) return res.status(400).json({ error: 'Config ID es requerido' });
      const result = await db.select().from(siteConfig).where(eq(siteConfig.id, id)).limit(1);
      if (result.length === 0) return res.status(404).json({ error: 'Configuración no encontrada' });
      return res.status(200).json(JSON.parse(result[0].data));
    }

    if (req.method === 'POST') {
      const { id: configId, data } = req.body;
      if (!configId || !data) return res.status(400).json({ error: 'ID y Data son requeridos' });

      await db.insert(siteConfig).values({
        id: configId,
        data: JSON.stringify(data),
      }).onConflictDoUpdate({
        target: [siteConfig.id],
        set: { data: JSON.stringify(data), updatedAt: new Date() }
      });

      return res.status(200).json({ message: 'Configuración actualizada' });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
