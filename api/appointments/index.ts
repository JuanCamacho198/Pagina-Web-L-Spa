import { db, appointments, users, services } from '../db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { z } from 'zod';

const appointmentSchema = z.object({
  auth0Id: z.string().min(1),
  serviceId: z.string().uuid(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointmentTime: z.string().min(1)
});

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { auth0Id, date } = req.query;
      
      if (date) { // Obtener horas reservadas
        const results = await db.select({ time: appointments.appointmentTime })
          .from(appointments)
          .where(and(eq(appointments.appointmentDate, date), sql`${appointments.status} != 'cancelled'`));
        return res.status(200).json(results.map(r => r.time));
      }

      if (auth0Id) { // Obtener citas de un usuario
        const userResult = await db.select({ id: users.id }).from(users).where(eq(users.auth0Id, auth0Id)).limit(1);
        if (userResult.length === 0) return res.status(200).json([]);
        
        const results = await db.select({
          id: appointments.id,
          userId: appointments.userId,
          serviceId: appointments.serviceId,
          appointmentDate: appointments.appointmentDate,
          appointmentTime: appointments.appointmentTime,
          status: appointments.status,
          createdAt: appointments.createdAt,
          serviceName: services.name,
        })
        .from(appointments)
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .where(eq(appointments.userId, userResult[0].id))
        .orderBy(desc(appointments.appointmentDate));
        
        return res.status(200).json(results);
      }
    }

    if (req.method === 'POST') {
      const validatedData = appointmentSchema.parse(req.body);
      const { auth0Id, serviceId, appointmentDate, appointmentTime } = validatedData;
      const userResult = await db.select({ id: users.id }).from(users).where(eq(users.auth0Id, auth0Id)).limit(1);
      if (userResult.length === 0) throw new Error("Usuario no encontrado.");

      const [newAppointment] = await db.insert(appointments).values({
        userId: userResult[0].id,
        serviceId,
        appointmentDate,
        appointmentTime,
        status: 'pending'
      }).returning();
      return res.status(201).json(newAppointment);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID es requerido' });
      await db.delete(appointments).where(eq(appointments.id, id));
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Error de validación', details: error.errors });
    }
    return res.status(500).json({ error: error.message });
  }
}
