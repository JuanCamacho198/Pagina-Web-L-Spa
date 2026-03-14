import { Hono } from 'hono';
import { cartService } from '../services/CartService';

const cart = new Hono();

// Get cart - requires authentication or anonymous ID
cart.get('/', async (c) => {
  try {
    // Get user ID from session if available
    const userId = c.get('userId') as string | null;
    
    // Get anonymous ID from header
    const anonymousId = c.req.header('X-Anonymous-ID') || null;

    const cartData = await cartService.getCart(userId || null, anonymousId);
    
    return c.json(cartData);
  } catch (error) {
    console.error('Error getting cart:', error);
    return c.json({ error: 'Error getting cart' }, 500);
  }
});

// Add item to cart
cart.post('/items', async (c) => {
  try {
    const body = await c.req.json();
    const { serviceId, quantity = 1 } = body;
    
    if (!serviceId) {
      return c.json({ error: 'serviceId is required' }, 400);
    }

    const userId = c.get('userId') as string | null;
    const anonymousId = c.req.header('X-Anonymous-ID') || null;

    const result = await cartService.addItem(
      userId || null,
      anonymousId,
      serviceId,
      quantity
    );

    if (!result.success) {
      return c.json({ error: result.message }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return c.json({ error: 'Error adding item to cart' }, 500);
  }
});

// Update item quantity
cart.patch('/items/:id', async (c) => {
  try {
    const itemId = c.req.param('id');
    const body = await c.req.json();
    const { quantity } = body;

    if (quantity === undefined) {
      return c.json({ error: 'quantity is required' }, 400);
    }

    const result = await cartService.updateQuantity(itemId, quantity);

    if (!result.success) {
      return c.json({ error: result.message }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return c.json({ error: 'Error updating cart item' }, 500);
  }
});

// Remove item from cart
cart.delete('/items/:id', async (c) => {
  try {
    const itemId = c.req.param('id');

    const result = await cartService.removeItem(itemId);

    if (!result.success) {
      return c.json({ error: result.message }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return c.json({ error: 'Error removing cart item' }, 500);
  }
});

// Clear cart
cart.delete('/', async (c) => {
  try {
    const userId = c.get('userId') as string | null;
    const anonymousId = c.req.header('X-Anonymous-ID') || null;

    const result = await cartService.clearCart(userId || null, anonymousId);

    if (!result.success) {
      return c.json({ error: result.message }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return c.json({ error: 'Error clearing cart' }, 500);
  }
});

// Migrate anonymous cart to user cart (called after login)
cart.post('/migrate', async (c) => {
  try {
    const body = await c.req.json();
    const { anonymousId } = body;
    
    const userId = c.get('userId') as string;

    if (!anonymousId || !userId) {
      return c.json({ error: 'anonymousId and userId are required' }, 400);
    }

    const result = await cartService.migrateCart(anonymousId, userId);

    if (!result.success) {
      return c.json({ error: result.message }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error migrating cart:', error);
    return c.json({ error: 'Error migrating cart' }, 500);
  }
});

export default cart;
