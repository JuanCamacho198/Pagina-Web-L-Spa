import { Hono } from 'hono';
import { zodValidator } from '@hono/zod-validator';
import { serviceSchema } from '@l-spa/shared-types';
import { ServiceService } from '../services/ServiceService';

const services = new Hono();
const serviceService = new ServiceService();

services.get('/', async (c) => {
  const result = await serviceService.getAllServices();
  return c.json(result);
});

services.get('/:id', async (c) => {
  const id = c.req.param('id');
  const service = await serviceService.getServiceById(id);
  if (!service) return c.json({ error: 'Servicio no encontrado' }, 404);
  return c.json(service);
});

services.post('/', zodValidator('json', serviceSchema), async (c) => {
  const data = c.req.valid('json');
  const result = await serviceService.createService(data);
  return c.json(result, 201);
});

services.put('/:id', zodValidator('json', serviceSchema.partial()), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  const result = await serviceService.updateService(id, data);
  if (!result) return c.json({ error: 'Servicio no encontrado' }, 404);
  return c.json(result);
});

services.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const result = await serviceService.deleteService(id);
  if (!result) return c.json({ error: 'Servicio no encontrado' }, 404);
  return c.json({ message: 'Servicio eliminado correctamente', service: result });
});

export default services;
