import { db, services } from '../db';
import { eq } from 'drizzle-orm';
import { Service } from '../types';

/**
 * Obtiene todos los servicios desde la base de datos PostgreSQL.
 * @returns {Promise<Service[]>} Lista de servicios mapeada al formato de la UI.
 */
export async function fetchServices(): Promise<Service[]> {
  const data = await db.select().from(services);
  
  // Transformamos campos para mantener compatibilidad con la UI si es necesario
  return data.map(service => ({
    id: service.id,
    Nombre: service.nombre,
    Precio: Number(service.precio), // Convertimos de string/decimal a number
    Categoria: service.categoria || '',
    imagenURL: service.imagenUrl || '',
    imageFileName: service.imageFileName || '',
    Duracion: service.duracion || ''
  }));
}

/**
 * Obtiene un servicio por su ID (UUID).
 * @param {string} serviceId - El UUID del servicio.
 * @returns {Promise<Service | null>} El servicio encontrado o null.
 */
export async function fetchServiceById(serviceId: string): Promise<Service | null> {
  const result = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
  
  if (result.length > 0) {
    const service = result[0];
    return {
      id: service.id,
      Nombre: service.nombre,
      Precio: Number(service.precio),
      Categoria: service.categoria || '',
      imagenURL: service.imagenUrl || '',
      imageFileName: service.imageFileName || '',
      Duracion: service.duracion || ''
    };
  } else {
    console.warn("No such document in Postgres with ID:", serviceId);
    return null;
  }
}
