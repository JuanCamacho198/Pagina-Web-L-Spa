import { ConfigRepository } from '../repository/ConfigRepository';

export class ConfigService {
  private repository = new ConfigRepository();

  async getConfig(id: string) {
    const config = await this.repository.findById(id);
    if (!config) return null;
    return JSON.parse(config.data);
  }

  async setConfig(id: string, data: any) {
    return await this.repository.upsert(id, data);
  }
}
