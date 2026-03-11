import { z } from 'zod';

export const siteConfigSchema = z.object({
  id: z.string().min(1),
  data: z.record(z.any()), // Objeto JSON genérico para configuración
  updatedAt: z.date().optional()
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
