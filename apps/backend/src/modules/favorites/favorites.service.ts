import { Inject, Injectable } from '@nestjs/common';
import { db, favorites, services, eq, and, count } from '@l-spa/database';

type Database = typeof db;

@Injectable()
export class FavoritesService {
  constructor(@Inject('DRIZZLE_CONNECTION') private readonly db: Database) {}

  async getFavorites(userId: string | null, anonymousId: string | null) {
    if (!userId && !anonymousId) {
      return { items: [], total: 0 };
    }

    let favoritesList;
    if (userId) {
      favoritesList = await this.db.select()
        .from(favorites)
        .where(eq(favorites.userId, userId));
    } else {
      favoritesList = await this.db.select()
        .from(favorites)
        .where(eq(favorites.anonymousId, anonymousId!));
    }

    const favoritesWithServices = await Promise.all(
      favoritesList.map(async (fav) => {
        const [service] = await this.db.select({
          id: services.id,
          name: services.name,
          description: services.description,
          price: services.price,
          imageUrl: services.imageUrl,
          duration: services.duration,
          category: services.category,
        })
        .from(services)
        .where(eq(services.id, fav.serviceId))
        .limit(1);

        return { ...fav, service };
      })
    );

    return { items: favoritesWithServices, total: favoritesWithServices.length };
  }

  async addToFavorites(userId: string | null, anonymousId: string | null, serviceId: string) {
    if (!userId && !anonymousId) {
      throw new Error('User ID or Anonymous ID required');
    }

    let existing;
    if (userId) {
      [existing] = await this.db.select()
        .from(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.serviceId, serviceId)
        ));
    } else {
      [existing] = await this.db.select()
        .from(favorites)
        .where(and(
          eq(favorites.anonymousId, anonymousId!),
          eq(favorites.serviceId, serviceId)
        ));
    }

    if (existing) {
      return { success: true, message: 'Already in favorites' };
    }

    const result = await this.db.insert(favorites).values({
      userId,
      anonymousId,
      serviceId,
    }).returning();

    return { success: true, item: result[0] };
  }

  async removeFromFavorites(userId: string | null, anonymousId: string | null, serviceId: string) {
    if (!userId && !anonymousId) {
      throw new Error('User ID or Anonymous ID required');
    }

    if (userId) {
      await this.db.delete(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.serviceId, serviceId)
        ));
    } else {
      await this.db.delete(favorites)
        .where(and(
          eq(favorites.anonymousId, anonymousId!),
          eq(favorites.serviceId, serviceId)
        ));
    }
  }

  async checkFavorite(userId: string | null, anonymousId: string | null, serviceId: string) {
    if (!userId && !anonymousId) {
      return false;
    }

    let existing;
    if (userId) {
      [existing] = await this.db.select()
        .from(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.serviceId, serviceId)
        ));
    } else {
      [existing] = await this.db.select()
        .from(favorites)
        .where(and(
          eq(favorites.anonymousId, anonymousId!),
          eq(favorites.serviceId, serviceId)
        ));
    }

    return !!existing;
  }

  async getFavoritesCount(userId: string | null, anonymousId: string | null) {
    if (!userId && !anonymousId) {
      return 0;
    }

    let result;
    if (userId) {
      [result] = await this.db.select({ count: count() })
        .from(favorites)
        .where(eq(favorites.userId, userId));
    } else {
      [result] = await this.db.select({ count: count() })
        .from(favorites)
        .where(eq(favorites.anonymousId, anonymousId!));
    }

    return result?.count || 0;
  }
}
