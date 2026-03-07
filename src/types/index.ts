// src/types/index.ts

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  imageFileName?: string;
  duration: number;
}

export interface UserProfile {
  id: string;
  auth0Id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  role: 'admin' | 'employee' | 'customer';
  createdAt: string;
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

export interface CheckoutFormValues {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  userCC: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  paymentMethod?: string;
}

export interface CartItem {
  id: string;
  serviceId: string;
  Nombre: string;
  Precio: number;
  Categoria?: string;
  imagenURL?: string;
  quantity?: number;
  addedAt?: string;
  Duracion?: number;
}

export interface ServiceFormValues {
  name: string;
  price: number;
  duration: number;
  description?: string;
  category?: string;
  image?: FileList;
  imageUrl?: string;
}
