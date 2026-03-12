import { db, reviews, user as users, appointments } from '@l-spa/database';
import { eq, and, desc } from 'drizzle-orm';
import type { Review } from '@l-spa/shared-types';

export class ReviewRepository {
  async findByServiceId(serviceId: string) {
    return await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.serviceId, serviceId))
      .orderBy(desc(reviews.createdAt));
  }

  async checkCompletedAppointment(userId: string, serviceId: string) {
    const results = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          eq(appointments.serviceId, serviceId),
          eq(appointments.status, 'completed')
        )
      )
      .limit(1);
    return results.length > 0;
  }

  async create(data: { userId: string; serviceId: string; rating: number; comment?: string | null }) {
    const [newReview] = await db.insert(reviews).values({
      userId: data.userId,
      serviceId: data.serviceId,
      rating: data.rating,
      comment: data.comment,
    }).returning();
    return newReview;
  }
}
