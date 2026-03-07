import { db, users } from '../db';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { auth0Id } = req.query;
      if (!auth0Id) return res.status(400).json({ error: 'auth0Id es requerido' });
      
      const result = await db.select().from(users).where(eq(users.auth0Id, auth0Id)).limit(1);
      if (result.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      return res.status(200).json(result[0]);
    }

    if (req.method === 'POST') {
      const { auth0Id, email, name, role } = req.body;
      const result = await db.insert(users).values({
        auth0Id,
        firstName: name,
        email,
        role: role || 'customer',
      }).onConflictDoUpdate({
        target: [users.auth0Id],
        set: { firstName: name, email }
      }).returning();
      return res.status(200).json(result[0]);
    }

    if (req.method === 'PUT') {
      const { auth0Id, ...updates } = req.body;
      const result = await db.update(users)
        .set(updates)
        .where(eq(users.auth0Id, auth0Id))
        .returning();
      return res.status(200).json(result[0]);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
