import { db, appointments, services, users } from '@l-spa/database';
import { eq, and, desc, sql, ne } from 'drizzle-orm';
import type { Appointment } from '@l-spa/shared-types';

export class AppointmentRepository {
  async findByUser(userId: string) {
    return await db.select({
      id: appointments.id,
      userId: appointments.userId,
      serviceId: appointments.serviceId,
      serviceName: services.name,
      appointmentDate: appointments.appointmentDate,
      appointmentTime: appointments.appointmentTime,
      status: appointments.status,
      createdAt: appointments.createdAt,
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(eq(appointments.userId, userId))
    .orderBy(desc(appointments.appointmentDate));
  }

  async getOccupiedTimes(date: string) {
    const results = await db.select({ time: appointments.appointmentTime })
      .from(appointments)
      .where(and(
        eq(appointments.appointmentDate, date), 
        ne(appointments.status, 'cancelled')
      ));
    return results.map(r => r.time);
  }

  async create(data: { userId: string; serviceId: string; appointmentDate: string; appointmentTime: string }) {
    const [newAppointment] = await db.insert(appointments).values({
      userId: data.userId,
      serviceId: data.serviceId,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      status: 'pending'
    }).returning();
    return newAppointment;
  }

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
    const [updated] = await db.update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    const [deleted] = await db.delete(appointments)
      .where(eq(appointments.id, id))
      .returning();
    return deleted;
  }
}
