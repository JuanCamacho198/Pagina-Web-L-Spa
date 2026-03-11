import { db, services } from '../db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  category: z.string().min(1),
  imageUrl: z.url().optional().nullable().or(z.literal('')),
  duration: z.coerce.number().int().min(5),
  includes: z.string().optional().nullable(),
  idealFor: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  contraindications: z.string().optional().nullable(),
  intensity: z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.number().int().min(1).max(5).optional())
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
      const { id, name } = req.query;
      
      try {
        const result = await db.select().from(services);

        if (id) {
          const service = result.find(s => s.id === id);
          if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });
          return res.status(200).json(service);
        }

        if (name) {
          const normalizedQuery = (name as string).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
          const service = result.find(s => {
            const normalizedName = s.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
            return normalizedName === normalizedQuery;
          });
          
          if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });
          return res.status(200).json(service);
        }

        return res.status(200).json(result);
      } catch (dbError: any) {
        console.error('DATABASE SELECT ERROR:', dbError);
        return res.status(500).json({ error: 'Error en la base de datos', details: dbError.message });
      }
    }

    if (req.method === 'POST') {
      const validatedData = serviceSchema.parse(req.body);
      const { name, description, price, category, imageUrl, duration, includes, idealFor, benefits, contraindications, intensity } = validatedData as any;
      const result = await db.insert(services).values({
        name,
        description,
        price: price.toString(),
        category,
        imageUrl,
        duration,
        includes,
        idealFor,
        benefits,
        contraindications,
        intensity
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
    console.error('--- API ERROR LOG ---');
    console.error('Path:', req.url);
    console.error('Method:', req.method);
    console.error('Error:', error);
    if (error instanceof z.ZodError) {
      console.error('Zod Details:', JSON.stringify(error.cause, null, 2));
      return res.status(400).json({ error: 'Error de validación', details: error.cause });
    }
    return res.status(500).json({ error: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined });
  }
}
