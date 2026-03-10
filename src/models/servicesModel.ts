import { Service } from '@/types';

const API_URL = '/api/services';

// In-memory cache for services
let servicesCache: Service[] | null = null;
let servicesCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Obtiene todos los servicios desde la API serverless.
 * Usa cache en memoria para mejorar rendimiento.
 * @returns {Promise<Service[]>} Lista de servicios mapeada al formato de la UI.
 */
export async function fetchServices(forceRefresh = false): Promise<Service[]> {
  // Return cached data if available and not expired
  if (!forceRefresh && servicesCache && Date.now() - servicesCacheTime < CACHE_DURATION) {
    return servicesCache;
  }
  
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al cargar servicios');
  const data = await response.json();
  
  const services = data.map((service: any) => ({
    id: service.id,
    name: service.name,
    description: service.description || '',
    price: Number(service.price),
    category: service.category || '',
    imageUrl: service.imageUrl || '',
    imageFileName: service.imageFileName || '',
    duration: Number(service.duration || 60),
    includes: service.includes || '',
    idealFor: service.idealFor || '',
    benefits: service.benefits || '',
    contraindications: service.contraindications || '',
    intensity: Number(service.intensity || 3)
  }));
  
  // Update cache
  servicesCache = services;
  servicesCacheTime = Date.now();
  
  return services;
}

/**
 * Invalida el cache de servicios.
 * Llamar esta función cuando se crean/actualizan/eliminan servicios.
 */
export function invalidateServicesCache() {
  servicesCache = null;
  servicesCacheTime = 0;
}

/**
 * Obtiene un servicio por su ID (UUID).
 * @param {string} serviceId - El UUID del servicio.
 * @returns {Promise<Service | null>} El servicio encontrado o null.
 */
export async function fetchServiceById(serviceId: string): Promise<Service | null> {
  const response = await fetch(`${API_URL}?id=${serviceId}`);
  if (!response.ok) return null;
  const service = await response.json();
  
  return {
    id: service.id,
    name: service.name,
    description: service.description || '',
    price: Number(service.price),
    category: service.category || '',
    imageUrl: service.imageUrl || '',
    imageFileName: service.imageFileName || '',
    duration: Number(service.duration || 60),
    includes: service.includes || '',
    idealFor: service.idealFor || '',
    benefits: service.benefits || '',
    contraindications: service.contraindications || '',
    intensity: Number(service.intensity || 3)
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
 * Actualiza un servicio existente.
 * @param serviceId - ID del servicio a actualizar.
 * @param serviceData - Nuevos datos del servicio.
 */
export async function updateService(serviceId: string, serviceData: any): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: serviceId, ...serviceData })
  });
  if (!response.ok) throw new Error('Error al actualizar servicio');
}

/**
 * Elimina un servicio.
 * @param serviceId - ID del servicio a eliminar.
 */
export async function deleteService(serviceId: string): Promise<void> {
  const response = await fetch(`${API_URL}?id=${serviceId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar servicio');
}

/**
 * Crea un nuevo servicio en la base de datos PostgreSQL.
 * @param {Omit<Service, 'id'>} serviceData - Datos del nuevo servicio.
 */
export async function createService(serviceData: any): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serviceData)
  });
  if (!response.ok) throw new Error('Error al crear servicio');
}
