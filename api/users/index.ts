import { db, users } from '../db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const userSchema = z.object({
  auth0Id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(2).optional(),
  role: z.enum(['admin', 'employee', 'customer']).default('customer')
});

const userUpdateSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional()
});

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
      const validatedData = userSchema.parse(req.body);
      const { auth0Id, email, name, role } = validatedData;
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
      if (!auth0Id) return res.status(400).json({ error: 'auth0Id es requerido' });
      
      const validatedUpdates = userUpdateSchema.partial().parse(updates);
      const result = await db.update(users)
        .set(validatedUpdates)
        .where(eq(users.auth0Id, auth0Id))
        .returning();
      return res.status(200).json(result[0]);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Error de validación', details: error.cause });
    }
    return res.status(500).json({ error: error.message });
  }
}
