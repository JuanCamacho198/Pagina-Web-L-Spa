import { cartRepository } from "../repository/CartRepository";

export interface CartItemResponse {
  id: string;
  serviceId: string;
  quantity: number;
  createdAt: Date;
  service: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    imageUrl: string | null;
    duration: number | null;
  } | null;
}

export interface CartResponse {
  items: CartItemResponse[];
  totalItems: number;
  totalPrice: number;
}

export class CartService {
  async getCart(userId: string | null, anonymousId: string | null): Promise<CartResponse> {
    let items: any[];
    
    if (userId) {
      items = await cartRepository.getCartByUserId(userId);
    } else if (anonymousId) {
      items = await cartRepository.getCartByAnonymousId(anonymousId);
    } else {
      return { items: [], totalItems: 0, totalPrice: 0 };
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
      const price = item.service?.price ? parseFloat(item.service.price) : 0;
      return sum + (price * item.quantity);
    }, 0);

    return { items, totalItems, totalPrice };
  }

  async addItem(
    userId: string | null, 
    anonymousId: string | null, 
    serviceId: string, 
    quantity: number = 1
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await cartRepository.addItem(userId, anonymousId, serviceId, quantity);
      return { success: true };
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return { success: false, message: 'Error adding item to cart' };
    }
  }

  async updateQuantity(
    itemId: string, 
    quantity: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await cartRepository.updateQuantity(itemId, quantity);
      return { success: true };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { success: false, message: 'Error updating cart item' };
    }
  }

  async removeItem(
    itemId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await cartRepository.removeItem(itemId);
      return { success: true };
    } catch (error) {
      console.error('Error removing cart item:', error);
      return { success: false, message: 'Error removing cart item' };
    }
  }

  async clearCart(
    userId: string | null, 
    anonymousId: string | null
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await cartRepository.clearCart(userId, anonymousId);
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Error clearing cart' };
    }
  }

  async migrateCart(
    anonymousId: string, 
    userId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await cartRepository.migrateAnonymousToUser(anonymousId, userId);
      return { success: true };
    } catch (error) {
      console.error('Error migrating cart:', error);
      return { success: false, message: 'Error migrating cart' };
    }
  }
}

export const cartService = new CartService();
