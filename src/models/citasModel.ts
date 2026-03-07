// src/models/citasModel.ts
import { Appointment } from '@/types';

const API_URL = '/api/appointments';

/**
 * Agrega una cita a la base de datos PostgreSQL via API.
 * @param appointmentData - Los datos de la cita.
 * @param auth0Id - El ID de Auth0 del usuario.
 * @returns El ID (UUID) de la nueva cita.
 */
export async function addAppointment(appointmentData: { 
  serviceId: string; 
  appointmentDate: string; 
  appointmentTime: string; 
}, auth0Id: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...appointmentData, auth0Id })
  });
  if (!response.ok) throw new Error("Error al guardar la cita.");
  const newAppointment = await response.json();
  return newAppointment.id;
}

/**
 * Obtiene todas las citas de un usuario específico desde Postgres via API.
 * @param auth0Id - El ID de Auth0 del usuario.
 * @returns Un arreglo de citas.
 */
export async function fetchAppointments(auth0Id: string): Promise<Appointment[]> {
  const response = await fetch(`${API_URL}?auth0Id=${auth0Id}`);
  if (!response.ok) return [];
  return response.json();
}

/**
 * Elimina (cancela) una cita de la base de datos PostgreSQL via API.
 * @param appointmentId - El ID (UUID) de la cita a eliminar.
 */
export async function deleteAppointment(appointmentId: string): Promise<void> {
  const response = await fetch(`${API_URL}?id=${appointmentId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error("Error al cancelar la cita.");
}

