import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, NotFoundException, BadRequestException, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { createZodDto } from 'nestjs-zod';
import { appointmentSchema, appointmentStatusEnum } from '@l-spa/shared-types';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { z } from 'zod';

class CreateAppointmentDto extends createZodDto(appointmentSchema) {}
class UpdateStatusDto extends createZodDto(z.object({ status: appointmentStatusEnum })) {}

@Controller('appointments')
@UseGuards(AuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('occupied/:date')
  async getOccupiedTimes(@Param('date') date: string) {
    return await this.appointmentsService.getOccupiedTimes(date);
  }

  @Get('user/:auth0Id')
  async getAppointmentsByUser(@Param('auth0Id') auth0Id: string) {
    return await this.appointmentsService.getAppointmentsByUser(auth0Id);
  }

  @Get('employee/:auth0Id')
  @UseGuards(RolesGuard)
  @Roles('employee', 'admin')
  async getEmployeeAppointments(
    @Param('auth0Id') auth0Id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const today = new Date().toISOString().split('T')[0];
    return await this.appointmentsService.getEmployeeAppointments(
      auth0Id, 
      startDate || today, 
      endDate || today
    );
  }

  @Post()
  async createAppointment(@Body() body: CreateAppointmentDto) {
    const { auth0Id, serviceId, appointmentDate, appointmentTime } = body;
    if (!auth0Id) {
      throw new BadRequestException('auth0Id es requerido');
    }

    try {
      const newAppointment = await this.appointmentsService.createAppointment({
        userId: auth0Id, // auth0Id IS the userId
        serviceId,
        appointmentDate,
        appointmentTime,
      });
      return newAppointment;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('employee', 'admin')
  async updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    const result = await this.appointmentsService.updateAppointmentStatus(id, body.status as any);
    if (!result) {
      throw new NotFoundException('Cita no encontrada');
    }
    return result;
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deleteAppointment(@Param('id') id: string) {
    const result = await this.appointmentsService.deleteAppointment(id);
    if (!result) {
      throw new NotFoundException('Cita no encontrada');
    }
    return { message: 'Cita eliminada correctamente', appointment: result };
  }

  // Admin

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllAppointments(
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('search') search?: string
  ) {
    return await this.appointmentsService.getAllAppointments({ status, date, search });
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getStats() {
    return await this.appointmentsService.getStats();
  }
}
