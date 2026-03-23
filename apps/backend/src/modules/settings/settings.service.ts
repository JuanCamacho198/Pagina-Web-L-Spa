import { Inject, Injectable } from '@nestjs/common';
import { db, siteConfig, eq } from '@l-spa/database';

type Database = typeof db;

@Injectable()
export class SettingsService {
  constructor(@Inject('DRIZZLE_CONNECTION') private readonly db: Database) {}

  async getConfig(id: string) {
    const results = await this.db.select().from(siteConfig).where(eq(siteConfig.id, id)).limit(1);
    const config = results[0] || null;
    if (!config) return null;
    // data is stored as JSON string in DB?
    // ConfigRepository says: data: JSON.stringify(data).
    // Drizzle might parse it automatically if type is json/jsonb.
    // Assuming siteConfig.data is 'json' type in Drizzle schema, it returns object.
    // If it's string, need parse.
    // ConfigService (old) did: JSON.parse(config.data).
    // This implies it is a string in DB or Drizzle returns it as string (e.g. text column).
    // I'll assume it's string based on old service.
    
    try {
      return typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch (e) {
      return config.data;
    }
  }

  async setConfig(id: string, data: any) {
    // Drizzle json column usually handles stringify automatically if passed object, 
    // but old repo used JSON.stringify(data).
    // If column type is text, must stringify. If json, passing object works.
    // I'll stick to old repo logic: stringify.
    
    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);

    const results = await this.db.insert(siteConfig).values({
      id,
      data: stringifiedData,
      updatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: siteConfig.id,
      set: { 
        data: stringifiedData, 
        updatedAt: new Date() 
      }
    })
    .returning();
    return results[0];
  }
}
