import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import services from './controllers/servicesController'
import users from './controllers/userController'
import appointments from './controllers/appointmentController'
import reviews from './controllers/reviewController'
import config from './controllers/configController'
import { auth } from './lib/auth'

const app = new Hono().basePath('/api/v1')

app.use('*', logger())
app.use('*', cors())

app.on(["POST", "GET"], "/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.route('/services', services)
app.route('/users', users)
app.route('/appointments', appointments)
app.route('/reviews', reviews)
app.route('/config', config)

export default app
