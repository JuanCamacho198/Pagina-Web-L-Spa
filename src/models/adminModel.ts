// src/models/adminModel.ts
import { db, appointments, users, services } from '@/db';
import { eq, desc, sql } from 'drizzle-orm';

/**
 * Obtiene todas las citas para el administrador, incluyendo información del usuario y del servicio.
 */
export async function fetchAllAppointments() {
  try {
    const results = await db.select({
      id: appointments.id,
      appointmentDate: appointments.appointmentDate,
      appointmentTime: appointments.appointmentTime,
      status: appointments.status,
      createdAt: appointments.createdAt,
      userName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
      userEmail: users.email,
      serviceName: services.name,
      servicePrice: services.price,
    })
    .from(appointments)
    .innerJoin(users, eq(appointments.userId, users.id))
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .orderBy(desc(appointments.appointmentDate), desc(appointments.appointmentTime));

    return results;
  } catch (e: any) {
    console.error("Error fetching all appointments:", e);
    throw new Error(e.message || "Error al obtener todas las citas.");
  }
}

/**
 * Actualiza el estado de una cita.
 * @param appointmentId - ID de la cita.
 * @param status - Nuevo estado ('pending', 'confirmed', 'cancelled', 'completed').
 */
export async function updateAppointmentStatus(appointmentId: string, status: string) {
  try {
    await db.update(appointments)
      .set({ status })
      .where(eq(appointments.id, appointmentId));
  } catch (e: any) {
    console.error("Error updating appointment status:", e);
    throw new Error(e.message || "Error al actualizar el estado de la cita.");
  }
}

/**
 * Obtiene estadísticas básicas para el dashboard administrativo.
 */
export async function fetchAdminStats() {
  try {
    const totalAppointments = await db.select({ count: sql<number>`count(*)` }).from(appointments);
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'customer'));
    const totalServices = await db.select({ count: sql<number>`count(*)` }).from(services);
    
    // Ingresos estimados de citas completadas
    const revenue = await db.select({ 
      sum: sql<number>`sum(CAST(${services.price} AS DECIMAL))` 
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(eq(appointments.status, 'completed'));

    return {
      totalAppointments: totalAppointments[0].count,
      totalUsers: totalUsers[0].count,
      totalServices: totalServices[0].count,
      estimatedRevenue: revenue[0].sum || 0
    };
  } catch (e: any) {
    console.error("Error fetching admin stats:", e);
    throw new Error(e.message || "Error al obtener estadísticas.");
  }
}

/**
 * Obtiene todos los usuarios para la gestión administrativa.
 */
export async function fetchAllUsers() {
  try {
    const results = await db.select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      phone: users.phone,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

    return results;
  } catch (e: any) {
    console.error("Error fetching all users:", e);
    throw new Error(e.message || "Error al obtener todos los usuarios.");
  }
}

/**
 * Actualiza el rol de un usuario.
 * @param userId - ID del usuario.
 * @param role - Nuevo rol ('admin', 'employee', 'customer').
 */
export async function updateUserRole(userId: string, role: 'admin' | 'employee' | 'customer') {
  try {
    await db.update(users)
      .set({ role })
      .where(eq(users.id, userId));
  } catch (e: any) {
    console.error("Error updating user role:", e);
    throw new Error(e.message || "Error al actualizar el rol del usuario.");
  }
}
