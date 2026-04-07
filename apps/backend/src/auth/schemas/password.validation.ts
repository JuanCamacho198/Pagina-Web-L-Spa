import { z } from 'zod';

export const passwordValidationSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const passwordStrengthSchema = z.object({
  password: passwordValidationSchema,
});

export type PasswordValidation = z.infer<typeof passwordValidationSchema>;

export function getPasswordStrength(password: string): { score: number; feedback: string[] } {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters required');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letter');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letter');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Add number');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Add special character');

  return { score, feedback };
}
