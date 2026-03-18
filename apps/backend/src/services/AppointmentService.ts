import { AppointmentRepository } from '../repository/AppointmentRepository';
import { UserRepository } from '../repository/UserRepository';

export class AppointmentService {
  private repository = new AppointmentRepository();
  private userRepo = new UserRepository();

  async getAppointmentsByUser(auth0Id: string) {
    const user = await this.userRepo.findByAuth0Id(auth0Id);
    if (!user) return [];
    return await this.repository.findByUser(user.id);
  }

  async getOccupiedTimes(date: string) {
    return await this.repository.getOccupiedTimes(date);
  }

  async createAppointment(data: { auth0Id: string; serviceId: string; appointmentDate: string; appointmentTime: string }) {
    const user = await this.userRepo.findByAuth0Id(data.auth0Id);
    if (!user) throw new Error("Usuario no encontrado.");

    return await this.repository.create({
      userId: user.id,
      serviceId: data.serviceId,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
    });
  }

  async updateAppointmentStatus(id: string, status: any) {
    return await this.repository.updateStatus(id, status);
  }

  async deleteAppointment(id: string) {
    return await this.repository.delete(id);
  }

  // Admin: Get all appointments with filters
  async getAllAppointments(filters?: { status?: string; date?: string; search?: string }) {
    return await this.repository.findAll(filters);
  }

  // Admin: Get dashboard stats
  async getStats() {
    return await this.repository.getStats();
  }

  async getEmployeeAppointments(auth0Id: string, startDate: string, endDate: string) {
    const user = await this.userRepo.findByAuth0Id(auth0Id);
    if (!user) return [];
    return await this.repository.findByDateRange(startDate, endDate, user.id);
  }
}
