import { Controller, Get, Post, Patch, Delete, Body, Param, Headers, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { OptionalAuthGuard } from '../../auth/optional-auth.guard';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const addItemSchema = z.object({
  serviceId: z.string(),
  quantity: z.number().optional().default(1),
});

class AddItemDto extends createZodDto(addItemSchema) {}

const updateQuantitySchema = z.object({
  quantity: z.number(),
});

class UpdateQuantityDto extends createZodDto(updateQuantitySchema) {}

const migrateCartSchema = z.object({
  anonymousId: z.string(),
});

class MigrateCartDto extends createZodDto(migrateCartSchema) {}

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async getCart(@Req() req: any, @Headers('x-anonymous-id') anonymousId?: string) {
    const userId = req.user?.id || null;
    return await this.cartService.getCart(userId, anonymousId || null);
  }

  @Post('items')
  @UseGuards(OptionalAuthGuard)
  async addItem(
    @Req() req: any,
    @Body() body: AddItemDto,
    @Headers('x-anonymous-id') anonymousId?: string
  ) {
    const userId = req.user?.id || null;
    
    // Validate that we have either user or anonymous ID
    if (!userId && !anonymousId) {
      throw new BadRequestException('User ID or Anonymous ID required');
    }

    const result = await this.cartService.addItem(
      userId,
      anonymousId || null,
      body.serviceId,
      body.quantity
    );

    return { success: true, id: result };
  }

  @Patch('items/:id')
  @UseGuards(OptionalAuthGuard)
  async updateQuantity(
    @Param('id') id: string,
    @Body() body: UpdateQuantityDto
  ) {
    await this.cartService.updateQuantity(id, body.quantity);
    return { success: true };
  }

  @Delete('items/:id')
  @UseGuards(OptionalAuthGuard)
  async removeItem(@Param('id') id: string) {
    await this.cartService.removeItem(id);
    return { success: true };
  }

  @Delete()
  @UseGuards(OptionalAuthGuard)
  async clearCart(@Req() req: any, @Headers('x-anonymous-id') anonymousId?: string) {
    const userId = req.user?.id || null;
    await this.cartService.clearCart(userId, anonymousId || null);
    return { success: true };
  }

  @Post('migrate')
  @UseGuards(OptionalAuthGuard)
  async migrateCart(@Req() req: any, @Body() body: MigrateCartDto) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User must be logged in to migrate cart');
    }
    await this.cartService.migrateCart(body.anonymousId, userId);
    return { success: true };
  }
}
