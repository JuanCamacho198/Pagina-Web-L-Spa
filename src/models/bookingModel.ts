// src/models/bookingModel.ts
import { db, appointments } from '@/db';
import { eq, and } from 'drizzle-orm';

/**
 * Obtiene las horas que ya están reservadas para una fecha específica.
 * @param date - Fecha en formato YYYY-MM-DD
 * @returns Lista de strings con las horas reservadas (ej: "09:00 AM", "14:30 PM")
 */
export async function fetchReservedTimes(date: string): Promise<string[]> {
  try {
    const results = await db.select({ 
      time: appointments.appointmentTime 
    })
    .from(appointments)
    .where(
      and(
        eq(appointments.appointmentDate, date),
        // Solo considerar citas que no estén canceladas
        sql`${appointments.status} != 'cancelled'`
      )
    );

    return results.map(r => r.time);
  } catch (error) {
    console.error("Error fetching reserved times:", error);
    return [];
  }
}

// Necesitamos importar sql de drizzle-orm para el filtro de status
import { sql } from 'drizzle-orm';
