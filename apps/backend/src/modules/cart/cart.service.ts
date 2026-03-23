import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db, cartItems, services, eq, and, asc } from '@l-spa/database';

type Database = typeof db;

@Injectable()
export class CartService {
  constructor(@Inject('DRIZZLE_CONNECTION') private readonly db: Database) {}

  async getCart(userId: string | null, anonymousId: string | null) {
    if (!userId && !anonymousId) {
      return { items: [], totalItems: 0, totalPrice: 0 };
    }

    let items;
    if (userId) {
      items = await this.db.select({
        id: cartItems.id,
        serviceId: cartItems.serviceId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
      })
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .orderBy(asc(cartItems.createdAt));
    } else {
      items = await this.db.select({
        id: cartItems.id,
        serviceId: cartItems.serviceId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
      })
      .from(cartItems)
      .where(eq(cartItems.anonymousId, anonymousId!)) // Non-null assertion safe because if check above
      .orderBy(asc(cartItems.createdAt));
    }

    const itemsWithServices = await Promise.all(
      items.map(async (item) => {
        if (!item.serviceId) return { ...item, service: null };

        const [service] = await this.db.select({
          id: services.id,
          name: services.name,
          description: services.description,
          price: services.price,
          imageUrl: services.imageUrl,
          duration: services.duration,
        })
        .from(services)
        .where(eq(services.id, item.serviceId))
        .limit(1);

        return { ...item, service };
      })
    );

    const totalItems = itemsWithServices.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalPrice = itemsWithServices.reduce((sum, item) => {
      const price = item.service?.price ? parseFloat(item.service.price) : 0;
      return sum + (price * (item.quantity || 0));
    }, 0);

    return { items: itemsWithServices, totalItems, totalPrice };
  }

  async addItem(userId: string | null, anonymousId: string | null, serviceId: string, quantity: number = 1) {
    if (!userId && !anonymousId) {
      throw new BadRequestException('User ID or Anonymous ID required');
    }

    // Check if item already exists
    let existingItem;
    if (userId) {
      const items = await this.db.select()
        .from(cartItems)
        .where(and(
          eq(cartItems.userId, userId),
          eq(cartItems.serviceId, serviceId)
        ))
        .limit(1);
      existingItem = items[0];
    } else if (anonymousId) {
      const items = await this.db.select()
        .from(cartItems)
        .where(and(
          eq(cartItems.anonymousId, anonymousId),
          eq(cartItems.serviceId, serviceId)
        ))
        .limit(1);
      existingItem = items[0];
    }

    if (existingItem) {
      // Update quantity
      await this.db.update(cartItems)
        .set({ quantity: (existingItem.quantity ?? 0) + quantity })
        .where(eq(cartItems.id, existingItem.id));
      return existingItem.id;
    } else {
      // Insert new item
      const result = await this.db.insert(cartItems).values({
        userId,
        anonymousId,
        serviceId,
        quantity,
      }).returning();
      return result[0].id;
    }
  }

  async updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }
    await this.db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, itemId));
  }

  async removeItem(itemId: string) {
    await this.db.delete(cartItems).where(eq(cartItems.id, itemId));
  }

  async clearCart(userId: string | null, anonymousId: string | null) {
    if (userId) {
      await this.db.delete(cartItems).where(eq(cartItems.userId, userId));
    } else if (anonymousId) {
      await this.db.delete(cartItems).where(eq(cartItems.anonymousId, anonymousId));
    }
  }

  async migrateCart(anonymousId: string, userId: string) {
    const anonymousItems = await this.db.select()
      .from(cartItems)
      .where(eq(cartItems.anonymousId, anonymousId));

    for (const item of anonymousItems) {
      if (!item.serviceId) {
        await this.db.update(cartItems)
          .set({ userId, anonymousId: null })
          .where(eq(cartItems.id, item.id));
        continue;
      }

      const existingUserItems = await this.db.select()
        .from(cartItems)
        .where(and(
          eq(cartItems.userId, userId),
          eq(cartItems.serviceId, item.serviceId)
        ))
        .limit(1);

      if (existingUserItems && existingUserItems.length > 0) {
        await this.db.update(cartItems)
          .set({ quantity: (existingUserItems[0].quantity ?? 0) + (item.quantity ?? 0) })
          .where(eq(cartItems.id, existingUserItems[0].id));
        
        await this.db.delete(cartItems).where(eq(cartItems.id, item.id));
      } else {
        await this.db.update(cartItems)
          .set({ userId, anonymousId: null })
          .where(eq(cartItems.id, item.id));
      }
    }
  }
}
