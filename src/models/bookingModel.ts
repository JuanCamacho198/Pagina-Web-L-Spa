// src/models/bookingModel.ts
const API_URL = '/api/appointments';

/**
 * Obtiene las horas que ya están reservadas para una fecha específica.
 * @param date - Fecha en formato YYYY-MM-DD
 * @returns Lista de strings con las horas reservadas (ej: "09:00 AM", "14:30 PM")
 */
export async function fetchReservedTimes(date: string): Promise<string[]> {
  const response = await fetch(`${API_URL}?date=${date}`);
  if (!response.ok) return [];
  return response.json();
}

