import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser un número positivo"),
  category: z.string().min(1, "La categoría es requerida"),
  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  duration: z.number().int().min(5, "La duración mínima es de 5 minutos")
});

export const userSchema = z.object({
  auth0Id: z.string().min(1, "Auth0 ID es requerido"),
  email: z.string().email("Email inválido"),
  firstName: z.string().min(2, "El nombre es requerido").optional(),
  lastName: z.string().optional(),
  role: z.enum(['admin', 'employee', 'customer']).default('customer')
});

export const appointmentSchema = z.object({
  auth0Id: z.string().min(1, "Auth0 ID es requerido"),
  serviceId: z.string().uuid("ID de servicio inválido"),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  appointmentTime: z.string().min(1, "La hora es requerida"),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).default('pending')
});
