import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { appointmentSchema, appointmentStatusEnum } from '@l-spa/shared-types';
import { AppointmentService } from '../services/AppointmentService';

const appointments = new Hono();
const appointmentService = new AppointmentService();

// Get occupied times for a specific date
appointments.get('/occupied/:date', async (c) => {
  const date = c.req.param('date');
  const occupiedTimes = await appointmentService.getOccupiedTimes(date);
  return c.json(occupiedTimes);
});

// Get appointments for a user
appointments.get('/user/:auth0Id', async (c) => {
  const auth0Id = c.req.param('auth0Id');
  const results = await appointmentService.getAppointmentsByUser(auth0Id);
  return c.json(results);
});

// Create a new appointment
appointments.post('/', zValidator('json', appointmentSchema), async (c) => {
  const { auth0Id, serviceId, appointmentDate, appointmentTime } = c.req.valid('json');
  if (!auth0Id) return c.json({ error: 'auth0Id es requerido' }, 400);

  try {
    const newAppointment = await appointmentService.createAppointment({
      auth0Id,
      serviceId,
      appointmentDate,
      appointmentTime,
    });
    return c.json(newAppointment, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

// Update appointment status
appointments.patch('/:id/status', zValidator('json', appointmentStatusEnum), async (c) => {
  const id = c.req.param('id');
  const status = c.req.valid('json');

  const result = await appointmentService.updateAppointmentStatus(id, status);
  if (!result) return c.json({ error: 'Cita no encontrada' }, 404);

  return c.json(result);
});

// Delete an appointment
appointments.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const result = await appointmentService.deleteAppointment(id);
  if (!result) return c.json({ error: 'Cita no encontrada' }, 404);

  return c.json({ message: 'Cita eliminada correctamente', appointment: result });
});

export default appointments;
