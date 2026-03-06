// src/types/index.ts

export interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  imageFileName?: string;
  duration: number;
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
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  photoURL?: string;
  role: 'admin' | 'employee' | 'customer';
}

export interface CartItem {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  quantity: number;
  addedAt: string;
  duration: number;
}

export interface ServiceFormValues {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl?: string;
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
