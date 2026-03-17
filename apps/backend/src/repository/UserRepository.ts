import { db, user, cartItems, services } from '@l-spa/database';
import { eq, and } from '@l-spa/database';
import type { UserUpdate } from '@l-spa/shared-types';

export class UserRepository {
  async findByAuth0Id(auth0Id: string) {
    // Note: auth0Id might not be in the new Better Auth 'user' table unless added.
    // In Better Auth, 'id' is often the primary identifier.
    const results = await db.select().from(user).where(eq(user.id, auth0Id)).limit(1);
    return results[0] || null;
  }

  async findById(id: string) {
    const results = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return results[0] || null;
  }

  async upsert(data: { auth0Id: string; email: string; firstName?: string; role?: 'admin' | 'employee' | 'customer' }) {
    const results = await db.insert(user).values({
      id: data.auth0Id,
      email: data.email,
      firstName: data.firstName,
      name: data.firstName || '', // Better Auth user table has 'name'
      role: data.role as 'admin' | 'employee' | 'customer',
    }).onConflictDoUpdate({
      target: user.id,
      set: {
        email: data.email,
        firstName: data.firstName,
        name: data.firstName || '',
        role: data.role as 'admin' | 'employee' | 'customer',
      }
    }).returning();
    return results[0];
  }

  async update(id: string, updates: UserUpdate) {
    const results = await db.update(user)
      .set(updates)
      .where(eq(user.id, id))
      .returning();
    return results[0];
  }

  // Cart Repository logic inline or separate? Let's keep it here for now as they are related.
  async getCartItems(userId: string) {
    return await db.select({
      id: cartItems.id,
      serviceId: cartItems.serviceId,
      serviceName: services.name,
      servicePrice: services.price,
      category: services.category,
      imageUrl: services.imageUrl,
      duration: services.duration,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt
    })
    .from(cartItems)
    .innerJoin(services, eq(cartItems.serviceId, services.id))
    .where(eq(cartItems.userId, userId));
  }

  async findCartItem(userId: string, serviceId: string) {
    const results = await db.select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.serviceId, serviceId)))
      .limit(1);
    return results[0] || null;
  }

  async addCartItem(userId: string, serviceId: string, quantity: number = 1) {
    const results = await db.insert(cartItems).values({
      userId,
      serviceId,
      quantity
    }).returning();
    return results[0];
  }

  async updateCartItemQuantity(id: string, newQuantity: number) {
    const results = await db.update(cartItems)
      .set({ quantity: newQuantity })
      .where(eq(cartItems.id, id))
      .returning();
    return results[0];
  }

  async removeCartItem(id: string) {
    const results = await db.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return results[0];
  }

  async clearCart(userId: string) {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Admin: Get all users
  async findAll() {
    return await db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    }).from(user).orderBy(user.createdAt);
  }

  // Admin: Update user role
  async updateRole(id: string, role: 'admin' | 'employee' | 'customer') {
    const results = await db.update(user)
      .set({ role })
      .where(eq(user.id, id))
      .returning();
    return results[0];
  }
}
