import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { db, services, eq } from '@l-spa/database';
import type { ServiceSchema, UpdateServiceSchema } from '@l-spa/shared-types';

type Database = typeof db;

@Injectable()
export class ServicesService {
  constructor(@Inject('DRIZZLE_CONNECTION') private readonly db: Database) {}

  async getAllServices() {
    return await this.db.select().from(services);
  }

  async getServiceById(id: string) {
    const results = await this.db.select().from(services).where(eq(services.id, id));
    return results[0] || null;
  }

  async createService(data: ServiceSchema) {
    const insertData = {
      name: data.name,
      description: data.description ?? null,
      price: data.price.toString(),
      category: data.category,
      imageUrl: data.imageUrl || null,
      duration: data.duration,
      includes: data.includes ?? null,
      idealFor: data.idealFor ?? null,
      benefits: data.benefits ?? null,
      contraindications: data.contraindications ?? null,
      intensity: data.intensity ?? 3,
    };

    const results = await this.db.insert(services).values(insertData).returning();
    return results[0];
  }

  async updateService(id: string, data: Partial<ServiceSchema>) {
    const service = await this.getServiceById(id);
    if (!service) {
      return null;
    }

    const updateData: any = { ...data };
    if (data.price) updateData.price = data.price.toString();
    
    const results = await this.db.update(services)
      .set(updateData)
      .where(eq(services.id, id))
      .returning();
    return results[0];
  }

  async deleteService(id: string) {
    const service = await this.getServiceById(id);
    if (!service) {
      return null;
    }
    const results = await this.db.delete(services).where(eq(services.id, id)).returning();
    return results[0];
  }
}
