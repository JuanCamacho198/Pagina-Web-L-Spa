import { db, services } from '../db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  category: z.string().min(1),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  duration: z.coerce.number().int().min(5)
});

export default async function handler(req: any, res: any) {
  // Configurar CORS básico para desarrollo y producción
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      
      if (id) {
        const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
        if (result.length === 0) {
          return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        return res.status(200).json(result[0]);
      }

      const allServices = await db.select().from(services);
      return res.status(200).json(allServices);
    }

    if (req.method === 'POST') {
      const validatedData = serviceSchema.parse(req.body);
      const { name, description, price, category, imageUrl, duration } = validatedData;
      const result = await db.insert(services).values({
        name,
        description,
        price: price.toString(),
        category,
        imageUrl,
        duration
      }).returning();
      return res.status(201).json(result[0]);
    }

    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return res.status(400).json({ error: 'ID es requerido' });
      
      const validatedData = serviceSchema.partial().parse(data);
      const result = await db.update(services)
        .set({
          ...validatedData,
          price: validatedData.price ? validatedData.price.toString() : undefined
        })
        .where(eq(services.id, id))
        .returning();
      return res.status(200).json(result[0]);
    }


    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID es requerido' });
      
      await db.delete(services).where(eq(services.id, id));
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Error de validación', details: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
