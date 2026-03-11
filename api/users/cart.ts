import { db, cartItems, users, services } from '../db';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const cartItemSchema = z.object({
  auth0Id: z.string().min(1),
  serviceId: z.uuid(),
  quantity: z.number().int().positive().optional().default(1)
});

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { auth0Id } = req.query;
      if (!auth0Id) return res.status(400).json({ error: 'auth0Id es requerido' });
      
      const userResult = await db.select().from(users).where(eq(users.auth0Id, auth0Id)).limit(1);
      if (userResult.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      
      const userId = userResult[0].id;

      // Join with services to get titles, prices, etc.
      const result = await db.select({
        id: cartItems.id,
        serviceId: cartItems.serviceId,
        serviceName: services.name,
        servicePrice: services.price,
        category: services.category,
        imageUrl: services.imageUrl,
        duration: services.duration,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt
      })
      .from(cartItems)
      .innerJoin(services, eq(cartItems.serviceId, services.id))
      .where(eq(cartItems.userId, userId));

      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const { auth0Id, serviceId, quantity } = cartItemSchema.parse(req.body);
      
      const userResult = await db.select().from(users).where(eq(users.auth0Id, auth0Id)).limit(1);
      if (userResult.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      
      const userId = userResult[0].id;
      
      // Check if item already in cart
      const existing = await db.select()
        .from(cartItems)
        .where(and(eq(cartItems.userId, userId), eq(cartItems.serviceId, serviceId)))
        .limit(1);
      
      if (existing.length > 0) {
        const result = await db.update(cartItems)
          .set({ quantity: (existing[0].quantity || 1) + (quantity || 1) })
          .where(eq(cartItems.id, existing[0].id))
          .returning();
        return res.status(200).json(result[0]);
      } else {
        const result = await db.insert(cartItems).values({
          userId,
          serviceId,
          quantity: quantity || 1
        }).returning();
        return res.status(201).json(result[0]);
      }
    }

    if (req.method === 'DELETE') {
      const { id, auth0Id, all } = req.query;
      
      if (all === 'true' && auth0Id) {
        const userResult = await db.select().from(users).where(eq(users.auth0Id, auth0Id)).limit(1);
        if (userResult.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        await db.delete(cartItems).where(eq(cartItems.userId, userResult[0].id));
        return res.status(204).end();
      }

      if (!id) return res.status(400).json({ error: 'ID de item del carrito es requerido' });
      
      await db.delete(cartItems).where(eq(cartItems.id, id));
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Error de validación', details: error.issues });
    }
    return res.status(500).json({ error: error.message });
  }
}
