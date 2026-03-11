import { Hono } from 'hono';
import { ConfigService } from '../services/ConfigService';

const config = new Hono();
const configService = new ConfigService();

// Get specific configuration by ID
config.get('/:id', async (c) => {
  const id = c.req.param('id');
  const result = await configService.getConfig(id);
  
  if (!result) {
    return c.json({ error: 'Configuración no encontrada' }, 404);
  }
  
  return c.json(result);
});

// Create or update configuration
config.post('/', async (c) => {
  const body = await c.req.json();
  const { id, data } = body;

  if (!id || !data) {
    return c.json({ error: 'ID y Data son requeridos' }, 400);
  }

  try {
    const result = await configService.setConfig(id, data);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default config;
