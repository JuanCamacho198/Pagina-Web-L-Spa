import { db, siteConfig } from '@l-spa/database';
import { eq } from '@l-spa/database';

export class ConfigRepository {
  async findById(id: string) {
    const results = await db.select().from(siteConfig).where(eq(siteConfig.id, id)).limit(1);
    return results[0] || null;
  }

  async upsert(id: string, data: any) {
    const results = await db.insert(siteConfig).values({
      id,
      data: JSON.stringify(data),
      updatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: [siteConfig.id],
      set: { 
        data: JSON.stringify(data), 
        updatedAt: new Date() 
      }
    })
    .returning();
    return results[0];
  }
}
