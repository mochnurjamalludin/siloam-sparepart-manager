
import { serial, text, pgTable, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

// Define enums for PostgreSQL
export const sparePartCategoryEnum = pgEnum('spare_part_category', ['Mekanikal', 'Elektrikal', 'Sipil', 'Plumbing', 'Others']);
export const userRoleEnum = pgEnum('user_role', ['Manager', 'Teknisi']);

// Spare parts table
export const sparePartsTable = pgTable('spare_parts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  current_quantity: integer('current_quantity').notNull().default(0),
  minimum_quantity: integer('minimum_quantity').notNull().default(0),
  maximum_quantity: integer('maximum_quantity').notNull().default(0),
  reorder_quantity: integer('reorder_quantity').notNull().default(1),
  category: sparePartCategoryEnum('category').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// TypeScript types for the table schemas
export type SparePart = typeof sparePartsTable.$inferSelect;
export type NewSparePart = typeof sparePartsTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = { 
  spareParts: sparePartsTable, 
  users: usersTable 
};
