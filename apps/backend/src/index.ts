import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import services from './controllers/servicesController'
import users from './controllers/userController'
import appointments from './controllers/appointmentController'
import reviews from './controllers/reviewController'
import config from './controllers/configController'
import cart from './controllers/cartController'
import favorites from './controllers/favoritesController'
import { auth } from './lib/auth'
import { csrf } from './middleware/csrf'
import { securityHeaders } from './middleware/security-headers'

const app = new Hono()

app.use('*', logger())
app.use('*', securityHeaders())
app.use('*', csrf())
app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Anonymous-ID', 'X-User-ID'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))


app.get('/api/v1/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.all("/api/v1/auth/*", (c) => {
  return auth.handler(c.req.raw);
});


app.route('/api/v1/services', services)
app.route('/api/v1/users', users)
app.route('/api/v1/appointments', appointments)
app.route('/api/v1/reviews', reviews)
app.route('/api/v1/config', config)
app.route('/api/v1/cart', cart)
app.route('/api/v1/favorites', favorites)

export default app
