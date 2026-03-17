import { db } from "@l-spa/database";
import { cartItems, services } from "@l-spa/database/schema";
import { sql, and, eq, asc } from "@l-spa/database";

export class CartRepository {
  async getCartByUserId(userId: string) {
    const items = await db.select({
      id: cartItems.id,
      serviceId: cartItems.serviceId,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
    })
    .from(cartItems)
    .where(eq(cartItems.userId, userId))
    .orderBy(asc(cartItems.createdAt));

    // Get service details for each item
    const itemsWithServices = await Promise.all(
      items.map(async (item) => {
        if (!item.serviceId) return { ...item, service: null };

        const [service] = await db.select({
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

    return itemsWithServices;
  }

  async getCartByAnonymousId(anonymousId: string) {
    const items = await db.select({
      id: cartItems.id,
      serviceId: cartItems.serviceId,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
    })
    .from(cartItems)
    .where(eq(cartItems.anonymousId, anonymousId))
    .orderBy(asc(cartItems.createdAt));

    // Get service details for each item
    const itemsWithServices = await Promise.all(
      items.map(async (item) => {
        if (!item.serviceId) return { ...item, service: null };

        const [service] = await db.select({
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

    return itemsWithServices;
  }

  async addItem(userId: string | null, anonymousId: string | null, serviceId: string, quantity: number = 1) {
    // Check if item already exists
    let existingItem;
    if (userId) {
      const items = await db.select()
        .from(cartItems)
        .where(and(
          eq(cartItems.userId, userId),
          eq(cartItems.serviceId, serviceId)
        ))
        .limit(1);
      existingItem = items[0];
    } else if (anonymousId) {
      const items = await db.select()
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
      await db.update(cartItems)
        .set({ quantity: (existingItem.quantity ?? 0) + quantity })
        .where(eq(cartItems.id, existingItem.id));
      return existingItem.id;
    } else {
      // Insert new item
      const result = await db.insert(cartItems).values({
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
    await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, itemId));
  }

  async removeItem(itemId: string) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  }

  async clearCart(userId: string | null, anonymousId: string | null) {
    if (userId) {
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
    } else if (anonymousId) {
      await db.delete(cartItems).where(eq(cartItems.anonymousId, anonymousId));
    }
  }

  // Migrate anonymous cart to user cart (when user logs in)
  async migrateAnonymousToUser(anonymousId: string, userId: string) {
    // Get all items from anonymous cart
    const anonymousItems = await db.select()
      .from(cartItems)
      .where(eq(cartItems.anonymousId, anonymousId));

    for (const item of anonymousItems) {
      // If serviceId is null, just transfer ownership
      if (!item.serviceId) {
        await db.update(cartItems)
          .set({ userId, anonymousId: null })
          .where(eq(cartItems.id, item.id));
        continue;
      }

      // Check if user already has this service in cart
      const existingUserItems = await db.select()
        .from(cartItems)
        .where(and(
          eq(cartItems.userId, userId),
          eq(cartItems.serviceId, item.serviceId)
        ))
        .limit(1);

      if (existingUserItems && existingUserItems.length > 0) {
        // Merge quantities (handle possible nulls)
        await db.update(cartItems)
          .set({ quantity: (existingUserItems[0].quantity ?? 0) + (item.quantity ?? 0) })
          .where(eq(cartItems.id, existingUserItems[0].id));
        
        // Remove anonymous item
        await db.delete(cartItems).where(eq(cartItems.id, item.id));
      } else {
        // Transfer ownership to user
        await db.update(cartItems)
          .set({ userId, anonymousId: null })
          .where(eq(cartItems.id, item.id));
      }
    }
  }
}

export const cartRepository = new CartRepository();
