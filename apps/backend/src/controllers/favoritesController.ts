import { Hono } from 'hono';
import { db } from '@l-spa/database';
import { favorites, services } from '@l-spa/database/schema';
import { eq, and, count } from 'drizzle-orm';

const favorite = new Hono();

// Get user favorites
favorite.get('/', async (c) => {
  try {
    const userId = c.req.header('X-User-ID') || null;
    const anonymousId = c.req.header('X-Anonymous-ID') || null;

    let favoritesList;
    if (userId) {
      favoritesList = await db.select()
        .from(favorites)
        .where(eq(favorites.userId, userId));
    } else if (anonymousId) {
      favoritesList = await db.select()
        .from(favorites)
        .where(eq(favorites.anonymousId, anonymousId));
    } else {
      return c.json({ items: [], total: 0 });
    }

    // Get service details for each favorite
    const favoritesWithServices = await Promise.all(
      favoritesList.map(async (fav) => {
        const [service] = await db.select({
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

    return c.json({ items: favoritesWithServices, total: favoritesWithServices.length });
  } catch (error) {
    console.error('Error getting favorites:', error);
    return c.json({ error: 'Error al obtener favoritos' }, 500);
  }
});

// Add to favorites
favorite.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { serviceId } = body;
    
    const userId = c.req.header('X-User-ID') || null;
    const anonymousId = c.req.header('X-Anonymous-ID') || null;

    if (!userId && !anonymousId) {
      return c.json({ error: 'User ID or Anonymous ID required' }, 400);
    }

    if (!serviceId) {
      return c.json({ error: 'serviceId is required' }, 400);
    }

    // Check if already favorited
    let existing;
    if (userId) {
      [existing] = await db.select()
        .from(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.serviceId, serviceId)
        ));
    } else if (anonymousId) {
      [existing] = await db.select()
        .from(favorites)
        .where(and(
          eq(favorites.anonymousId, anonymousId),
          eq(favorites.serviceId, serviceId)
        ));
    }

    if (existing) {
      return c.json({ success: true, message: 'Already in favorites' });
    }

    // Add to favorites
    const result = await db.insert(favorites).values({
      userId,
      anonymousId,
      serviceId,
    }).returning();

    return c.json({ success: true, item: result[0] });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return c.json({ error: 'Error al añadir a favoritos' }, 500);
  }
});

// Remove from favorites
favorite.delete('/:serviceId', async (c) => {
  try {
    const serviceId = c.req.param('serviceId');
    
    const userId = c.req.header('X-User-ID') || null;
    const anonymousId = c.req.header('X-Anonymous-ID') || null;

    if (!userId && !anonymousId) {
      return c.json({ error: 'User ID or Anonymous ID required' }, 400);
    }

    if (userId) {
      await db.delete(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.serviceId, serviceId)
        ));
    } else if (anonymousId) {
      await db.delete(favorites)
        .where(and(
          eq(favorites.anonymousId, anonymousId),
          eq(favorites.serviceId, serviceId)
        ));
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return c.json({ error: 'Error al eliminar de favoritos' }, 500);
  }
});

// Check if service is favorited
favorite.get('/check/:serviceId', async (c) => {
  try {
    const serviceId = c.req.param('serviceId');
    
    const userId = c.req.header('X-User-ID') || null;
    const anonymousId = c.req.header('X-Anonymous-ID') || null;

    if (!userId && !anonymousId) {
      return c.json({ isFavorite: false });
    }

    let existing;
    if (userId) {
      [existing] = await db.select()
        .from(favorites)
        .where(and(
          eq(favorites.userId, userId),
          eq(favorites.serviceId, serviceId)
        ));
    } else if (anonymousId) {
      [existing] = await db.select()
        .from(favorites)
        .where(and(
          eq(favorites.anonymousId, anonymousId),
          eq(favorites.serviceId, serviceId)
        ));
    }

    return c.json({ isFavorite: !!existing });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return c.json({ error: 'Error al verificar favorito' }, 500);
  }
});

// Get favorites count
favorite.get('/count', async (c) => {
  try {
    const userId = c.req.header('X-User-ID') || null;
    const anonymousId = c.req.header('X-Anonymous-ID') || null;

    let result;
    if (userId) {
      [result] = await db.select({ count: count() })
        .from(favorites)
        .where(eq(favorites.userId, userId));
    } else if (anonymousId) {
      [result] = await db.select({ count: count() })
        .from(favorites)
        .where(eq(favorites.anonymousId, anonymousId));
    } else {
      return c.json({ count: 0 });
    }

    return c.json({ count: result?.count || 0 });
  } catch (error) {
    console.error('Error getting favorites count:', error);
    return c.json({ error: 'Error al contar favoritos' }, 500);
  }
});

export default favorite;
