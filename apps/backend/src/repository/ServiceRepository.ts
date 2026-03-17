import { db, services } from '@l-spa/database';
import { eq } from '@l-spa/database';
import type { ServiceSchema, UpdateServiceSchema } from '@l-spa/shared-types';

export class ServiceRepository {
  async findAll() {
    return await db.select().from(services);
  }

  async findById(id: string) {
    const results = await db.select().from(services).where(eq(services.id, id));
    return results[0] || null;
  }

  async create(data: ServiceSchema) {
    const results = await db.insert(services).values({
      ...data,
      price: data.price.toString(),
      intensity: data.intensity ?? 3,
    }).returning();
    return results[0];
  }

  async update(id: string, data: Partial<ServiceSchema>) {
    const updateData: any = { ...data };
    if (data.price) updateData.price = data.price.toString();
    
    const results = await db.update(services)
      .set(updateData)
      .where(eq(services.id, id))
      .returning();
    return results[0];
  }

  async delete(id: string) {
    const results = await db.delete(services).where(eq(services.id, id)).returning();
    return results[0];
  }
}
