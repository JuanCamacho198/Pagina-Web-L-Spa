// src/controllers/servicesController.ts
import { fetchServices } from '@models/servicesModel';
import { Service } from '@types';

/**
 * Controlador para obtener todos los servicios e informar/actualizar el estado de la UI.
 * @param setServices - Función para actualizar la lista de servicios.
 * @param setError - Función para manejar errores.
 */
export const getAllServices = async (
  setServices: (services: Service[]) => void, 
  setError: (error: string) => void
): Promise<void> => {
  try {
    const services = await fetchServices();
    setServices(services);
  } catch (err: any) {
    console.error('Error cargando servicios:', err);
    setError(err.message || 'Error desconocido al cargar servicios');
  }
};
