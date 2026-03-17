import { db, appointments, services, user as users } from '@l-spa/database';
import { eq, and, desc, sql, ne, like, or } from '@l-spa/database';
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

  // Admin: Get all appointments with filters
  async findAll(filters?: { status?: string; date?: string; search?: string }) {
    let conditions = [];
    
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(appointments.status, filters.status));
    }
    if (filters?.date) {
      conditions.push(eq(appointments.appointmentDate, filters.date));
    }
    
    const results = await db
      .select({
        id: appointments.id,
        userId: appointments.userId,
        serviceId: appointments.serviceId,
        serviceName: services.name,
        servicePrice: services.price,
        serviceDuration: services.duration,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        status: appointments.status,
        createdAt: appointments.createdAt,
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phone,
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(users, eq(appointments.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(appointments.appointmentDate), desc(appointments.appointmentTime));
    
    return results;
  }

  // Admin: Get dashboard statistics
  async getStats() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];

    // Total users
    const [usersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    // Active services (services with price > 0)
    const [servicesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(services);

    // Appointments this month
    const [appointmentsThisMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(appointments)
      .where(and(
        eq(appointments.appointmentDate, firstDayOfMonth)
      ));

    // Revenue this month (sum of completed appointments)
    const [revenueResult] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${services.price}), 0)`
      })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .where(and(
        eq(appointments.status, 'completed')
      ));

    return {
      totalUsers: usersCount?.count || 0,
      activeServices: servicesCount?.count || 0,
      appointmentsThisMonth: appointmentsThisMonth?.count || 0,
      revenueThisMonth: revenueResult?.total || '0'
    };
  }
}
