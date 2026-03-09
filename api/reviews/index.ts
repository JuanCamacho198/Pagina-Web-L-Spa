import { db, reviews, appointments, users } from '../db';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

const reviewSchema = z.object({
  userId: z.string().uuid(),
  serviceId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // GET /api/reviews?serviceId=...
    if (req.method === 'GET') {
      const { serviceId } = req.query;
      
      if (!serviceId) {
        return res.status(400).json({ error: 'serviceId es requerido' });
      }

      const result = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          comment: reviews.comment,
          createdAt: reviews.createdAt,
          user: {
            firstName: users.firstName,
            lastName: users.lastName,
          }
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.serviceId, serviceId))
        .orderBy(desc(reviews.createdAt));

      return res.status(200).json(result);
    }

    // POST /api/reviews
    if (req.method === 'POST') {
      const validatedData = reviewSchema.parse(req.body);
      const { userId, serviceId, rating, comment } = validatedData;

      // Logic: "Verified Review" - check if the user has an appointment with status = 'completed' for that serviceId
      const completedAppointments = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.userId, userId),
            eq(appointments.serviceId, serviceId),
            eq(appointments.status, 'completed')
          )
        )
        .limit(1);

      if (completedAppointments.length === 0) {
        return res.status(403).json({ 
          error: 'Solo puedes dejar una reseña si has completado este servicio.' 
        });
      }

      // Insert review (onConflict is handled by DB unique index, but we let it throw or could handle here)
      const result = await db.insert(reviews).values({
        userId,
        serviceId,
        rating,
        comment,
      }).returning();

      return res.status(201).json(result[0]);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Error de validación', details: error.errors });
    }
    // Handle unique constraint error (user already reviewed)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya has dejado una reseña para este servicio.' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
