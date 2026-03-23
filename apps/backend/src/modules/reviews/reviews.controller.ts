import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { createZodDto } from 'nestjs-zod';
import { reviewSchema } from '@l-spa/shared-types';
import { AuthGuard } from '../../auth/auth.guard';
import { z } from 'zod';

class CreateReviewDto extends createZodDto(reviewSchema) {}

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('service/:serviceId')
  async getReviewsByServiceId(@Param('serviceId') serviceId: string) {
    return await this.reviewsService.getReviewsByServiceId(serviceId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createReview(@Body() body: CreateReviewDto) {
    const { userId, serviceId, rating, comment } = body;
    if (!userId) {
      throw new BadRequestException('userId es requerido');
    }
    
    // Note: The userId in body might differ from authenticated user.
    // Ideally we should use req.user.id for security.
    // The shared schema expects userId in payload.
    // I will pass the payload userId for now to match Hono logic, 
    // but in a strict app I'd use req.user.id.
    
    const newReview = await this.reviewsService.createReview(
      userId,
      serviceId,
      rating,
      comment
    );
    return newReview;
  }
}
