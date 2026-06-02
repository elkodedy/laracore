/**
 * Example Zod schemas for API validation and TypeScript types
 *
 * These schemas are used for:
 * 1. Runtime validation of API responses
 * 2. TypeScript type inference
 * 3. Form validation with React Hook Form
 */

import { z } from 'zod';

/**
 * User schema
 */
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  email_verified_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Create user request schema
 */
export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;

/**
 * API error response schema
 */
export const ApiErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.array(z.string())).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * Paginated response schema
 */
export const PaginatedSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    links: z.object({
      first: z.string().nullable(),
      last: z.string().nullable(),
      prev: z.string().nullable(),
      next: z.string().nullable(),
    }),
    meta: z.object({
      current_page: z.number(),
      from: z.number().nullable(),
      last_page: z.number(),
      path: z.string(),
      per_page: z.number(),
      to: z.number().nullable(),
      total: z.number(),
    }),
  });

export const PaginatedUsersSchema = PaginatedSchema(UserSchema);
export type PaginatedUsers = z.infer<typeof PaginatedUsersSchema>;
