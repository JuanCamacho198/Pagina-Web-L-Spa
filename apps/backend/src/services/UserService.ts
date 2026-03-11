import { UserRepository } from '../repository/UserRepository';
import type { UserSync, UserUpdate } from '@l-spa/shared-types';

export class UserService {
  private repository = new UserRepository();

  async syncUser(data: UserSync) {
    return await this.repository.upsert({
      auth0Id: data.auth0Id,
      email: data.email,
      firstName: data.name,
      role: data.role as 'admin' | 'employee' | 'customer',
    });
  }

  async getUserByAuth0Id(auth0Id: string) {
    return await this.repository.findByAuth0Id(auth0Id);
  }

  async updateUser(auth0Id: string, updates: UserUpdate) {
    return await this.repository.update(auth0Id, updates);
  }

  async getCart(auth0Id: string) {
    const user = await this.getUserByAuth0Id(auth0Id);
    if (!user) throw new Error('Usuario no encontrado');
    return await this.repository.getCartItems(user.id);
  }

  async addToCart(auth0Id: string, serviceId: string, quantity: number = 1) {
    const user = await this.getUserByAuth0Id(auth0Id);
    if (!user) throw new Error('Usuario no encontrado');

    const existingItem = await this.repository.findCartItem(user.id, serviceId);
    if (existingItem) {
      return await this.repository.updateCartItemQuantity(existingItem.id, (existingItem.quantity || 1) + quantity);
    } else {
      return await this.repository.addCartItem(user.id, serviceId, quantity);
    }
  }

  async removeFromCart(itemId: string) {
    return await this.repository.removeCartItem(itemId);
  }

  async clearCart(auth0Id: string) {
    const user = await this.getUserByAuth0Id(auth0Id);
    if (!user) throw new Error('Usuario no encontrado');
    await this.repository.clearCart(user.id);
  }
}
