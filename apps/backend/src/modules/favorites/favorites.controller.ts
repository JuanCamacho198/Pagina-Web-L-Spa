import { Controller, Get, Post, Delete, Body, Param, Headers, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { OptionalAuthGuard } from '../../auth/optional-auth.guard';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const addToFavoritesSchema = z.object({
  serviceId: z.string(),
});

class AddToFavoritesDto extends createZodDto(addToFavoritesSchema) {}

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async getFavorites(@Req() req: any, @Headers('x-anonymous-id') anonymousId?: string) {
    const userId = req.user?.id || null;
    return await this.favoritesService.getFavorites(userId, anonymousId || null);
  }

  @Post()
  @UseGuards(OptionalAuthGuard)
  async addToFavorites(
    @Req() req: any, 
    @Body() body: AddToFavoritesDto,
    @Headers('x-anonymous-id') anonymousId?: string
  ) {
    const userId = req.user?.id || null;
    if (!userId && !anonymousId) {
      throw new BadRequestException('User ID or Anonymous ID required');
    }
    
    const result = await this.favoritesService.addToFavorites(userId, anonymousId || null, body.serviceId);
    return result;
  }

  @Delete(':serviceId')
  @UseGuards(OptionalAuthGuard)
  async removeFromFavorites(
    @Param('serviceId') serviceId: string,
    @Req() req: any,
    @Headers('x-anonymous-id') anonymousId?: string
  ) {
    const userId = req.user?.id || null;
    if (!userId && !anonymousId) {
      throw new BadRequestException('User ID or Anonymous ID required');
    }

    await this.favoritesService.removeFromFavorites(userId, anonymousId || null, serviceId);
    return { success: true };
  }

  @Get('check/:serviceId')
  @UseGuards(OptionalAuthGuard)
  async checkFavorite(
    @Param('serviceId') serviceId: string,
    @Req() req: any,
    @Headers('x-anonymous-id') anonymousId?: string
  ) {
    const userId = req.user?.id || null;
    const isFavorite = await this.favoritesService.checkFavorite(userId, anonymousId || null, serviceId);
    return { isFavorite };
  }

  @Get('count')
  @UseGuards(OptionalAuthGuard)
  async getFavoritesCount(@Req() req: any, @Headers('x-anonymous-id') anonymousId?: string) {
    const userId = req.user?.id || null;
    const count = await this.favoritesService.getFavoritesCount(userId, anonymousId || null);
    return { count };
  }
}
