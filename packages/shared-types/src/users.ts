import { z } from 'zod';

export const userRoleEnum = z.enum(['admin', 'employee', 'customer']);

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  auth0Id: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1).optional().nullable(),
  lastName: z.string().min(1).optional().nullable(),
  phone: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  role: userRoleEnum.default('customer'),
  createdAt: z.date().optional()
});

export const userSyncSchema = z.object({
  auth0Id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1).optional(),
  role: userRoleEnum.optional()
});

export const userUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional()
});

export type User = z.infer<typeof userSchema>;
export type UserSync = z.infer<typeof userSyncSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

// Cart Types
export const cartItemSchema = z.object({
  userId: z.string().uuid().optional(),
  auth0Id: z.string().min(1).optional(),
  serviceId: z.string().uuid(),
  quantity: z.number().int().positive().optional().default(1)
});

export type CartItem = z.infer<typeof cartItemSchema>;
