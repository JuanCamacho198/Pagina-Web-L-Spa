import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { userSyncSchema, userUpdateSchema, cartItemSchema } from '@l-spa/shared-types';
import { UserService } from '../services/UserService';
import { db } from '@l-spa/database';
import { user, appointments, cartItems } from '@l-spa/database/schema';
import { eq, count, and } from 'drizzle-orm';

const users = new Hono();
const userService = new UserService();

// Get User Profile
users.get('/:auth0Id', async (c) => {
  const auth0Id = c.req.param('auth0Id');
  const user = await userService.getUserByAuth0Id(auth0Id);
  if (!user) return c.json({ error: 'Usuario no encontrado' }, 404);
  return c.json(user);
});

// Sync User Profile (Upsert)
users.post('/sync', zValidator('json', userSyncSchema), async (c) => {
  const data = c.req.valid('json');
  const result = await userService.syncUser(data);
  return c.json(result);
});

// Update User Profile
users.put('/:auth0Id', zValidator('json', userUpdateSchema.partial()), async (c) => {
  const auth0Id = c.req.param('auth0Id');
  const updates = c.req.valid('json');
  const result = await userService.updateUser(auth0Id, updates);
  if (!result) return c.json({ error: 'Usuario no encontrado' }, 404);
  return c.json(result);
});

// CART ROUTES
// Get Cart
users.get('/:auth0Id/cart', async (c) => {
  try {
    const auth0Id = c.req.param('auth0Id');
    const result = await userService.getCart(auth0Id);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

// Add to Cart
users.post('/cart', zValidator('json', cartItemSchema), async (c) => {
  const { auth0Id, serviceId, quantity } = c.req.valid('json');
  if (!auth0Id) return c.json({ error: 'auth0Id es requerido' }, 400);
  
  try {
    const result = await userService.addToCart(auth0Id, serviceId, quantity);
    return c.json(result, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

// Remove from Cart
users.delete('/cart/:itemId', async (c) => {
  const itemId = c.req.param('itemId');
  const result = await userService.removeFromCart(itemId);
  if (!result) return c.json({ error: 'Item no encontrado' }, 404);
  return c.json({ message: 'Item eliminado correctamente', item: result });
});

// Clear Cart
users.delete('/:auth0Id/cart/clear', async (c) => {
  const auth0Id = c.req.param('auth0Id');
  try {
    await userService.clearCart(auth0Id);
    return c.json({ message: 'Carrito vaciado' });
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

// Get User Profile Stats (for /perfil page) - uses Better Auth user ID
users.get('/profile/stats', async (c) => {
  try {
    // Get user ID from header (sent by frontend when logged in)
    const userId = c.req.header('X-User-ID');
    
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400);
    }
    
    // Get user data
    const [userData] = await db.select({
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
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }
    
    // Get appointments count
    const [appointmentsResult] = await db.select({ count: count() })
      .from(appointments)
      .where(eq(appointments.userId, userId));
    
    const appointmentsCount = appointmentsResult?.count || 0;
    
    // Get cart items count
    const [cartResult] = await db.select({ count: count() })
      .from(cartItems)
      .where(eq(cartItems.userId, userId));
    
    const cartCount = cartResult?.count || 0;
    
    return c.json({
      user: userData,
      stats: {
        appointmentsCount,
        cartCount,
        // Favorites count - placeholder for now (would need favorites table)
        favoritesCount: 0,
      }
    });
  } catch (error) {
    console.error('Error getting user profile stats:', error);
    return c.json({ error: 'Error al obtener datos del perfil' }, 500);
  }
});

export default users;
