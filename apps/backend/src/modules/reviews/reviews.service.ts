import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { db, reviews, user as users, appointments, eq, and, desc } from '@l-spa/database';

type Database = typeof db;

@Injectable()
export class ReviewsService {
  constructor(@Inject('DRIZZLE_CONNECTION') private readonly db: Database) {}

  async getReviewsByServiceId(serviceId: string) {
    return await this.db
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

  async createReview(userId: string, serviceId: string, rating: number, comment?: string | null) {
    const completedAppointments = await this.db
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
    
    if (completedAppointments.length === 0) {
      throw new BadRequestException('Solo puedes dejar una reseña si has completado este servicio.');
    }

    try {
      const [newReview] = await this.db.insert(reviews).values({
        userId,
        serviceId,
        rating,
        comment,
      }).returning();
      return newReview;
    } catch (error: any) {
      if (error.code === '23505') { // Postgres Unique Violation
        throw new BadRequestException('Ya has dejado una reseña para este servicio.');
      }
      throw error;
    }
  }
}
