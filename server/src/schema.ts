
import { z } from 'zod';

// Enum for spare part categories
export const sparePartCategorySchema = z.enum(['Mekanikal', 'Elektrikal', 'Sipil', 'Plumbing', 'Others']);
export type SparePartCategory = z.infer<typeof sparePartCategorySchema>;

// Enum for user roles
export const userRoleSchema = z.enum(['Manager', 'Teknisi']);
export type UserRole = z.infer<typeof userRoleSchema>;

// Spare part schema
export const sparePartSchema = z.object({
  id: z.number(),
  name: z.string(),
  current_quantity: z.number().int().nonnegative(),
  minimum_quantity: z.number().int().nonnegative(),
  maximum_quantity: z.number().int().nonnegative(),
  reorder_quantity: z.number().int().positive(),
  category: sparePartCategorySchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type SparePart = z.infer<typeof sparePartSchema>;

// Input schema for creating spare parts
export const createSparePartInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  current_quantity: z.number().int().nonnegative(),
  minimum_quantity: z.number().int().nonnegative(),
  maximum_quantity: z.number().int().nonnegative(),
  reorder_quantity: z.number().int().positive(),
  category: sparePartCategorySchema
}).refine(data => data.maximum_quantity >= data.minimum_quantity, {
  message: "Maximum quantity must be greater than or equal to minimum quantity",
  path: ["maximum_quantity"]
});

export type CreateSparePartInput = z.infer<typeof createSparePartInputSchema>;

// Input schema for updating spare parts
export const updateSparePartInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required").optional(),
  current_quantity: z.number().int().nonnegative().optional(),
  minimum_quantity: z.number().int().nonnegative().optional(),
  maximum_quantity: z.number().int().nonnegative().optional(),
  reorder_quantity: z.number().int().positive().optional(),
  category: sparePartCategorySchema.optional()
});

export type UpdateSparePartInput = z.infer<typeof updateSparePartInputSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Input schema for creating users
export const createUserInputSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  role: userRoleSchema
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Input schema for updating users
export const updateUserInputSchema = z.object({
  id: z.number(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  role: userRoleSchema.optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Search schema for spare parts
export const searchSparePartsInputSchema = z.object({
  name: z.string().optional(),
  category: sparePartCategorySchema.optional(),
  low_stock_only: z.boolean().optional()
});

export type SearchSparePartsInput = z.infer<typeof searchSparePartsInputSchema>;
