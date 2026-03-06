// src/types/index.ts

export interface Service {
  id: string;
  Nombre: string;
  Precio: number | string;
  Categoria: string;
  imagenURL?: string;
  imageFileName?: string;
  Duracion?: number;
}

export interface Appointment {
  id: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: any;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface UserProfile {
  uid: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento?: string;
  photoURL?: string;
}

export interface CartItem extends Service {
  quantity: number;
}
