import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '../../auth/auth.guard';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const setConfigSchema = z.object({
  id: z.string(),
  data: z.any(),
});

class SetConfigDto extends createZodDto(setConfigSchema) {}

@Controller('config') // Route matches existing /api/v1/config
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':id')
  async getConfig(@Param('id') id: string) {
    const config = await this.settingsService.getConfig(id);
    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }
    return config;
  }

  @Post()
  @UseGuards(AuthGuard)
  async setConfig(@Body() body: SetConfigDto) {
    const { id, data } = body;
    if (!id || !data) {
      throw new BadRequestException('ID y Data son requeridos');
    }
    return await this.settingsService.setConfig(id, data);
  }
}
