// src/models/adminModel.ts
import { UserProfile } from "@/types";

const API_APPOINTMENTS = '/api/appointments';
const API_USERS = '/api/users';
const API_STATS = '/api/config?id=stats'; // O el endpoint que tengas para stats

/**
 * Obtiene todas las citas para el administrador, incluyendo información del usuario y del servicio.
 */
export async function fetchAllAppointments() {
  try {
    const response = await fetch(API_APPOINTMENTS);
    if (!response.ok) throw new Error('Error al obtener citas');
    return await response.json();
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
    const response = await fetch(API_APPOINTMENTS, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: appointmentId, status })
    });
    if (!response.ok) throw new Error('Error al actualizar estado');
    return await response.json();
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
    const response = await fetch(API_STATS);
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return await response.json();
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
    const response = await fetch(API_USERS);
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return await response.json();
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
    const response = await fetch(API_USERS, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, role })
    });
    if (!response.ok) throw new Error('Error al actualizar rol');
    return await response.json();
  } catch (e: any) {
    console.error("Error updating user role:", e);
    throw new Error(e.message || "Error al actualizar el rol del usuario.");
  }
}
