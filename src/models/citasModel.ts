// src/models/citasModel.ts
import { db, appointments, users, services } from '../db';
import { eq, desc } from 'drizzle-orm';
import { getAuth } from '@/lib/auth'; 
import { Appointment } from '../types';

/**
 * Agrega una cita a la base de datos PostgreSQL.
 * @param appointmentData - Los datos de la cita, incluyendo serviceId, date, y time.
 * @returns El ID (UUID) de la nueva cita.
 */
export async function addAppointment(appointmentData: { 
  serviceId: string; 
  appointmentDate: string; 
  appointmentTime: string; 
}): Promise<string> {
  try {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      throw new Error("Usuario no autenticado.");
    }

    // Buscamos el ID (UUID) del usuario en Postgres usando su Firebase UID
    const userResult = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.firebaseUid, firebaseUser.uid))
      .limit(1);

    if (userResult.length === 0) {
      throw new Error("Usuario no encontrado en la base de datos de Postgres.");
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
 * Obtiene las citas del usuario actual desde Postgres filtrando por Firebase UID.
 * @param firebaseUid - El UID de Firebase del usuario.
 */
export async function fetchAppointments(firebaseUid: string): Promise<Appointment[]> {
  try {
    const result = await db.select({
      id: appointments.id,
      serviceName: services.nombre,
      serviceId: appointments.serviceId,
      appointmentDate: appointments.appointmentDate,
      appointmentTime: appointments.appointmentTime,
      status: appointments.status,
      createdAt: appointments.createdAt
    })
    .from(appointments)
    .innerJoin(users, eq(appointments.userId, users.id))
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(eq(users.firebaseUid, firebaseUid))
    .orderBy(desc(appointments.createdAt));

    // Mapeamos para mantener la estructura de la interfaz `Appointment`
    return result.map(appointment => ({
      id: appointment.id,
      serviceName: appointment.serviceName,
      serviceId: appointment.serviceId || undefined,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status as "pending" | "confirmed" | "cancelled" | "completed",
      createdAt: appointment.createdAt?.toISOString() || new Date().toISOString()
    }));
  } catch (e) {
    console.error("Error fetching appointments from Postgres: ", e);
    throw new Error("Failed to fetch appointments.");
  }
}

/**
 * Borra una cita por su ID.
 * @param id - El UUID de la cita.
 */
export async function deleteAppointment(id: string): Promise<void> {
  try {
    await db.delete(appointments).where(eq(appointments.id, id));
  } catch (e) {
    console.error("Error deleting appointment from Postgres: ", e);
    throw new Error("Failed to delete appointment.");
  }
}
