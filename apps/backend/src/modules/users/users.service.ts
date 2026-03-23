import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { db, user, eq, count, appointments, cartItems, favorites } from '@l-spa/database';
import type { UserSync, UserUpdate } from '@l-spa/shared-types';

type Database = typeof db;

@Injectable()
export class UsersService {
  constructor(@Inject('DRIZZLE_CONNECTION') private readonly db: Database) {}

  async syncUser(data: UserSync) {
    const results = await this.db.insert(user).values({
      id: data.auth0Id,
      email: data.email,
      firstName: data.name,
      name: data.name || '',
      role: data.role as 'admin' | 'employee' | 'customer',
    }).onConflictDoUpdate({
      target: user.id,
      set: {
        email: data.email,
        firstName: data.name,
        name: data.name || '',
        role: data.role as 'admin' | 'employee' | 'customer',
      }
    }).returning();
    return results[0];
  }

  async getUserByAuth0Id(auth0Id: string) {
    const results = await this.db.select().from(user).where(eq(user.id, auth0Id)).limit(1);
    return results[0] || null;
  }

  async updateUser(auth0Id: string, updates: UserUpdate) {
    const results = await this.db.update(user)
      .set(updates)
      .where(eq(user.id, auth0Id))
      .returning();
    return results[0];
  }

  async getAllUsers() {
    return await this.db.select({
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

  async updateUserRole(id: string, role: 'admin' | 'employee' | 'customer') {
    const results = await this.db.update(user)
      .set({ role })
      .where(eq(user.id, id))
      .returning();
    return results[0];
  }

  async getProfileStats(userId: string) {
    const [userData] = await this.db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      birthDate: user.birthDate,
      role: user.role,
      createdAt: user.createdAt,
    }).from(user).where(eq(user.id, userId));
    
    if (!userData) {
      return null;
    }
    
    const [appointmentsResult] = await this.db.select({ count: count() })
      .from(appointments)
      .where(eq(appointments.userId, userId));
    
    const appointmentsCount = appointmentsResult?.count || 0;
    
    const [cartResult] = await this.db.select({ count: count() })
      .from(cartItems)
      .where(eq(cartItems.userId, userId));
    
    const cartCount = cartResult?.count || 0;
    
    const [favoritesResult] = await this.db.select({ count: count() })
      .from(favorites)
      .where(eq(favorites.userId, userId));
    
    const favoritesCount = favoritesResult?.count || 0;
    
    return {
      user: userData,
      stats: {
        appointmentsCount,
        cartCount,
        favoritesCount,
      }
    };
  }
}
