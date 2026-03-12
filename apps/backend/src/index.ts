import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import services from './controllers/servicesController'
import users from './controllers/userController'
import appointments from './controllers/appointmentController'
import reviews from './controllers/reviewController'
import config from './controllers/configController'
import { auth } from './lib/auth'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

app.get('/api/v1/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.on(['GET', 'POST'], "/api/v1/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.route('/api/v1/services', services)
app.route('/api/v1/users', users)
app.route('/api/v1/appointments', appointments)
app.route('/api/v1/reviews', reviews)
app.route('/api/v1/config', config)

export default app
