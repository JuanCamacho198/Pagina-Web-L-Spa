// src/models/citasModel.ts
import { db, appointments, users, services } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { Appointment } from '@types';

/**
 * Agrega una cita a la base de datos PostgreSQL.
 * @param appointmentData - Los datos de la cita.
 * @param auth0Id - El ID de Auth0 del usuario.
 * @returns El ID (UUID) de la nueva cita.
 */
export async function addAppointment(appointmentData: { 
  serviceId: string; 
  appointmentDate: string; 
  appointmentTime: string; 
}, auth0Id: string): Promise<string> {
  try {
    // Buscamos el ID (UUID) del usuario en Postgres usando su Auth0 ID
    const userResult = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.auth0Id, auth0Id))
      .limit(1);

    if (userResult.length === 0) {
      throw new Error("Usuario no encontrado en la base de datos.");
    }

    const userId = userResult[0].id;

    const [newAppointment] = await db.insert(appointments).values({
      userId: userId,
      serviceId: appointmentData.serviceId,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      status: 'pending'
    }).returning();

    return newAppointment.id;
  } catch (e: any) {
    console.error("Error adding appointment to Postgres: ", e);
    throw new Error(e.message || "Failed to save appointment.");
  }
}

/**
 * Obtiene todas las citas de un usuario específico desde Postgres.
 * @param auth0Id - El ID de Auth0 del usuario.
 * @returns Un arreglo de citas.
 */
export async function fetchAppointments(auth0Id: string): Promise<Appointment[]> {
  try {
    // Primero obtenemos el ID (UUID) de Postgres usando el Auth0 ID
    const userResult = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.auth0Id, auth0Id))
      .limit(1);

    if (userResult.length === 0) {
      return [];
    }

    const userId = userResult[0].id;

    // Obtenemos las citas uniéndolas con la tabla de servicios
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
    .where(eq(appointments.userId, userId))
    .orderBy(desc(appointments.appointmentDate));

    return results as unknown as Appointment[];
  } catch (e: any) {
    console.error("Error fetching appointments from Postgres: ", e);
    throw new Error(e.message || "Error al obtener las citas.");
  }
}

/**
 * Elimina (cancela) una cita de la base de datos PostgreSQL.
 * @param appointmentId - El ID (UUID) de la cita a eliminar.
 */
export async function deleteAppointment(appointmentId: string): Promise<void> {
  try {
    await db.delete(appointments).where(eq(appointments.id, appointmentId));
  } catch (e: any) {
    console.error("Error deleting appointment from Postgres: ", e);
    throw new Error(e.message || "Error al cancelar la cita.");
  }
}
