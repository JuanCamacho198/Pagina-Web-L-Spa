import { z } from 'zod';

export const appointmentStatusEnum = z.enum(['pending', 'confirmed', 'cancelled', 'completed']);

export const appointmentSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  auth0Id: z.string().min(1).optional(), // Para facilitar la creación desde el front
  serviceId: z.string().uuid(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointmentTime: z.string().min(1),
  status: appointmentStatusEnum.default('pending'),
  createdAt: z.date().optional()
});

export type Appointment = z.infer<typeof appointmentSchema>;
export type AppointmentStatus = z.infer<typeof appointmentStatusEnum>;
