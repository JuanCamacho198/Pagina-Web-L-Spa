import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { createZodDto } from 'nestjs-zod';
import { serviceSchema } from '@l-spa/shared-types';
import { AuthGuard } from '../../auth/auth.guard';

class CreateServiceDto extends createZodDto(serviceSchema) {}
class UpdateServiceDto extends createZodDto(serviceSchema.partial()) {}

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices() {
    return await this.servicesService.getAllServices();
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    const service = await this.servicesService.getServiceById(id);
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return service;
  }

  @Post()
  @UseGuards(AuthGuard)
  async createService(@Body() data: CreateServiceDto) {
    return await this.servicesService.createService(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateService(@Param('id') id: string, @Body() data: UpdateServiceDto) {
    const result = await this.servicesService.updateService(id, data);
    if (!result) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return result;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteService(@Param('id') id: string) {
    const result = await this.servicesService.deleteService(id);
    if (!result) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return { message: 'Servicio eliminado correctamente', service: result };
  }
}
