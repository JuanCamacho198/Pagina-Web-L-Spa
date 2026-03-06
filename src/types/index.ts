// src/types/index.ts

export interface Service {
  id: string;
  Nombre: string;
  Precio: number;
  Categoria: string;
  imagenURL?: string;
  imageFileName?: string;
  Duracion: number;
}

export interface Appointment {
  id: string;
  serviceId?: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface UserProfile {
  id?: string;
  uid: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  photoURL?: string;
  role: 'admin' | 'employee' | 'customer';
}

export interface CartItem {
  id: string;
  serviceId: string;
  Nombre: string;
  Precio: number;
  Categoria: string;
  imagenURL: string;
  quantity: number;
  addedAt: string;
  Duracion: number;
}

export interface ServiceFormValues {
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  categoria: string;
  imagenURL?: string;
}

export interface CheckoutFormValues {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  userCC: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}
