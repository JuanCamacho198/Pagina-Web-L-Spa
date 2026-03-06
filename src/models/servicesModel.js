// src/models/servicesModel.js
import { db, services } from '../db';
import { eq } from 'drizzle-orm';

// Obtiene todos los servicios
export async function fetchServices() {
  const data = await db.select().from(services);
  // Transformamos campos para mantener compatibilidad con la UI si es necesario
  return data.map(service => ({
    id: service.id,
    Nombre: service.nombre,
    Precio: service.precio,
    Categoria: service.categoria,
    imagenURL: service.imagenUrl,
    imageFileName: service.imageFileName,
    Duracion: service.duracion
  }));
}

// Obtiene un servicio por su ID
export async function fetchServiceById(serviceId) {
  const result = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
  
  if (result.length > 0) {
    const service = result[0];
    return {
      id: service.id,
      Nombre: service.nombre,
      Precio: service.precio,
      Categoria: service.categoria,
      imagenURL: service.imagenUrl,
      imageFileName: service.imageFileName,
      Duracion: service.duracion
    };
  } else {
    console.log("No such document!");
    return null;
  }
}
