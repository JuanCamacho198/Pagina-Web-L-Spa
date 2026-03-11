import { ReviewRepository } from '../repository/ReviewRepository';

export class ReviewService {
  private repository = new ReviewRepository();

  async getReviewsByServiceId(serviceId: string) {
    return await this.repository.findByServiceId(serviceId);
  }

  async createReview(userId: string, serviceId: string, rating: number, comment?: string | null) {
    const hasCompleted = await this.repository.checkCompletedAppointment(userId, serviceId);
    
    if (!hasCompleted) {
      throw new Error('Solo puedes dejar una reseña si has completado este servicio.');
    }

    try {
      return await this.repository.create({ userId, serviceId, rating, comment });
    } catch (error: any) {
      if (error.code === '23505') { // Postgres Unique Violation
        throw new Error('Ya has dejado una reseña para este servicio.');
      }
      throw error;
    }
  }
}
