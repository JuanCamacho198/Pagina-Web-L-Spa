import { ServiceRepository } from '../repository/ServiceRepository';
import type { ServiceSchema, UpdateServiceSchema } from '@l-spa/shared-types';

export class ServiceService {
  private repository = new ServiceRepository();

  async getAllServices() {
    return await this.repository.findAll();
  }

  async getServiceById(id: string) {
    return await this.repository.findById(id);
  }

  async createService(data: ServiceSchema) {
    return await this.repository.create(data);
  }

  async updateService(id: string, data: Partial<ServiceSchema>) {
    return await this.repository.update(id, data);
  }

  async deleteService(id: string) {
    return await this.repository.delete(id);
  }
}
