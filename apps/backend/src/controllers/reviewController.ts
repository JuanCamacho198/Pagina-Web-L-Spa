import { Hono } from 'hono';
import { zodValidator } from '@hono/zod-validator';
import { reviewSchema } from '@l-spa/shared-types';
import { ReviewService } from '../services/ReviewService';

const reviews = new Hono();
const reviewService = new ReviewService();

// Get reviews for a service
reviews.get('/:serviceId', async (c) => {
  const serviceId = c.req.param('serviceId');
  const results = await reviewService.getReviewsByServiceId(serviceId);
  return c.json(results);
});

// Create a new review
reviews.post('/', zodValidator('json', reviewSchema), async (c) => {
  const { userId, serviceId, rating, comment } = c.req.valid('json');

  try {
    const newReview = await reviewService.createReview(userId, serviceId, rating, comment);
    return c.json(newReview, 201);
  } catch (err: any) {
    if (err.message.includes('Solo puedes dejar una reseña') || err.message.includes('Ya has dejado')) {
      return c.json({ error: err.message }, 403);
    }
    return c.json({ error: 'Error interno al procesar la reseña' }, 500);
  }
});

export default reviews;
