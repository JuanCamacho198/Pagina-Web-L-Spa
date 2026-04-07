import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, NotFoundException, BadRequestException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CartService } from '../cart/cart.service';
import { createZodDto } from 'nestjs-zod';
import { userSyncSchema, userUpdateSchema, cartItemSchema } from '@l-spa/shared-types';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { LockoutService } from '../../auth/services/lockout.service';
import { z } from 'zod';

class UserSyncDto extends createZodDto(userSyncSchema) {}
class UserUpdateDto extends createZodDto(userUpdateSchema.partial()) {}
class AddCartItemDto extends createZodDto(cartItemSchema) {}

const updateRoleSchema = z.object({
  role: z.enum(['admin', 'employee', 'customer']),
});
class UpdateRoleDto extends createZodDto(updateRoleSchema) {}

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cartService: CartService,
    private readonly lockoutService: LockoutService
  ) {}

  @Get('profile/stats')
  async getProfileStats(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User ID required');
    }
    const stats = await this.usersService.getProfileStats(userId);
    if (!stats) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return stats;
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Patch('admin/:userId/role')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateUserRole(@Param('userId') userId: string, @Body() body: UpdateRoleDto) {
    const updatedUser = await this.usersService.updateUserRole(userId, body.role);
    if (!updatedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return updatedUser;
  }

  @Patch('admin/:userId/unlock')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async unlockUser(@Param('userId') userId: string) {
    const unlocked = await this.lockoutService.unlockAccount(userId);
    if (!unlocked) {
      throw new NotFoundException('Usuario no encontrado o no estaba bloqueado');
    }
    return { message: 'Usuario desbloqueado exitosamente' };
  }

  @Get(':auth0Id')
  async getUserByAuth0Id(@Param('auth0Id') auth0Id: string) {
    const user = await this.usersService.getUserByAuth0Id(auth0Id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  @Post('sync')
  async syncUser(@Body() data: UserSyncDto) {
    return await this.usersService.syncUser(data);
  }

  @Put(':auth0Id')
  async updateUser(@Param('auth0Id') auth0Id: string, @Body() data: UserUpdateDto) {
    const result = await this.usersService.updateUser(auth0Id, data);
    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return result;
  }

  // Cart Endpoints (Proxy to CartService)

  @Get(':auth0Id/cart')
  async getCart(@Param('auth0Id') auth0Id: string) {
    // Assuming auth0Id is the userId
    return await this.cartService.getCart(auth0Id, null);
  }

  @Post('cart')
  async addToCart(@Body() body: AddCartItemDto) {
    const { auth0Id, serviceId, quantity } = body;
    if (!auth0Id) {
      throw new BadRequestException('auth0Id es requerido');
    }
    const result = await this.cartService.addItem(auth0Id, null, serviceId, quantity);
    return { success: true, id: result };
  }

  @Delete('cart/:itemId')
  async removeFromCart(@Param('itemId') itemId: string) {
    await this.cartService.removeItem(itemId);
    return { message: 'Item eliminado correctamente' };
  }

  @Delete(':auth0Id/cart/clear')
  async clearCart(@Param('auth0Id') auth0Id: string) {
    await this.cartService.clearCart(auth0Id, null);
    return { message: 'Carrito vaciado' };
  }
}
