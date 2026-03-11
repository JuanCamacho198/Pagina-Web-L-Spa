import { pgTable, uuid, text, decimal, integer, timestamp, varchar, date, time, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';

// Roles Definition
export const userRoleEnum = pgEnum('user_role', ['admin', 'employee', 'customer']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  auth0Id: varchar('auth0_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  birthDate: date('birth_date'),
  role: userRoleEnum('role').default('customer').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Services Table
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }),
  imageUrl: text('image_url'),
  imageFileName: text('image_filename'),
  duration: integer('duration').default(60),
  includes: text('includes'),
  idealFor: text('ideal_for'),
  benefits: text('benefits'),
  contraindications: text('contraindications'),
  intensity: integer('intensity').default(3),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Appointments Table
export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'set null' }),
  appointmentDate: date('appointment_date').notNull(),
  appointmentTime: time('appointment_time').notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Cart Items Table
export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Site Configuration Table
export const siteConfig = pgTable('site_config', {
  id: varchar('id', { length: 50 }).primaryKey(),
  data: text('data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Reviews Table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    user_service_idx: uniqueIndex('user_service_review_idx').on(table.userId, table.serviceId),
  };
});
