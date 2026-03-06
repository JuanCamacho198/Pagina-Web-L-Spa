import { pgTable, uuid, text, decimal, integer, timestamp, varchar, date, time } from 'drizzle-orm/pg-core';

// Definición de la Tabla de Usuarios
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firebaseUid: varchar('firebase_uid', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  nombre: varchar('nombre', { length: 100 }),
  apellido: varchar('apellido', { length: 100 }),
  telefono: varchar('telefono', { length: 20 }),
  fechaNacimiento: date('fecha_nacimiento'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Definición de la Tabla de Servicios
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  precio: decimal('precio', { precision: 10, scale: 2 }).notNull(),
  categoria: varchar('categoria', { length: 100 }),
  imagenUrl: text('imagen_url'),
  imageFileName: text('imagen_filename'),
  duracion: integer('duracion').default(60), // en minutos
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Definición de la Tabla de Citas (Appointments)
export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'set null' }),
  appointmentDate: date('appointment_date').notNull(),
  appointmentTime: time('appointment_time').notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // pending, confirmed, cancelled, completed
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Definición de la Tabla de Carrito
export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
