import { Service } from '@/types';

const API_URL = '/api/services';

/**
 * Obtiene todos los servicios desde la API serverless.
 * @returns {Promise<Service[]>} Lista de servicios mapeada al formato de la UI.
 */
export async function fetchServices(): Promise<Service[]> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al cargar servicios');
  const data = await response.json();
  
  return data.map((service: any) => ({
    id: service.id,
    name: service.name,
    price: Number(service.price),
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
  const response = await fetch(`${API_URL}?id=${serviceId}`);
  if (!response.ok) return null;
  const service = await response.json();
  
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
