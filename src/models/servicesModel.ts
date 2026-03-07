import { db, services } from '@/db';
import { eq } from 'drizzle-orm';
import { Service } from '@types';

/**
 * Obtiene todos los servicios desde la base de datos PostgreSQL.
 * @returns {Promise<Service[]>} Lista de servicios mapeada al formato de la UI.
 */
export async function fetchServices(): Promise<Service[]> {
  const data = await db.select().from(services);
  
  // Transformamos campos para mantener compatibilidad con la UI si es necesario
  return data.map(service => ({
    id: service.id,
    name: service.name,
    price: Number(service.price), // Convertimos de string/decimal a number
    category: service.category || '',
    imageUrl: service.imageUrl || '',
    imageFileName: service.imageFileName || '',
    duration: Number(service.duration || 60)
  }));
}

/**
 * Obtiene un servicio por su ID (UUID).
 * @param {string} serviceId - El UUID del servicio.
 * @returns {Promise<Service | null>} El servicio encontrado o null.
 */
export async function fetchServiceById(serviceId: string): Promise<Service | null> {
  const result = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
  if (result.length === 0) return null;
  const service = result[0];
  return {
    id: service.id,
    name: service.name,
    price: Number(service.price),
    category: service.category || '',
    imageUrl: service.imageUrl || '',
    imageFileName: service.imageFileName || '',
    duration: Number(service.duration || 60)
  };
}

/**
 * Obtiene un servicio por su nombre (slug-friendly).
 * @param {string} name - El nombre del servicio.
 * @returns {Promise<Service | null>} El servicio encontrado o null.
 */
export async function fetchServiceByName(name: string): Promise<Service | null> {
  // Buscamos todos y filtramos por slug para evitar problemas con tildes/espacios en la query directa si no está normalizado
  const all = await fetchServices();
  const slug = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
  const targetSlug = slug(name);
  
  return all.find(s => slug(s.name) === targetSlug) || null;
}

/**
 * Crea un nuevo servicio en la base de datos PostgreSQL.
 * @param {Omit<Service, 'id'>} serviceData - Datos del nuevo servicio.
 */
export async function createService(serviceData: any): Promise<void> {
  await db.insert(services).values({
    name: serviceData.name,
    description: serviceData.description,
    price: serviceData.price.toString(),
    category: serviceData.category,
    imageUrl: serviceData.imageUrl,
    duration: serviceData.duration
  });
}
