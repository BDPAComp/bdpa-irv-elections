// OWNER: Student B
// PURPOSE: Validate user inputs to prevent injection attacks and bad data.
//
// REQUIREMENT: 13 (Security — no SQL injection, no XSS)
// DIFFICULTY: ⭐⭐
//
// We use Zod schemas. If a payload doesn't match the schema, it's rejected
// at the API route boundary before any DB queries happen.

import { z } from 'zod';

// Username: alphanumeric + dashes/underscores only (per Req 6)
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(32, 'Username must be at most 32 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username may only contain letters, numbers, dashes, and underscores');

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(254, 'Email address too long');

export const passwordSchema = z
  .string()
  .min(11, 'Password must be more than 10 characters');

export const newUserSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  type: z.enum(['voter', 'moderator', 'administrator', 'reporter']),
  fullName: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  zip: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  captchaId: z.string(),
  captchaAnswer: z.number().int(),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false),
});

export const newElectionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  options: z.array(z.string().min(1).max(100)).min(2, 'Need at least 2 options'),
  opensAt: z.number().int().positive(),
  closesAt: z.number().int().positive(),
}).refine(data => data.closesAt > data.opensAt, {
  message: 'closesAt must be after opensAt',
  path: ['closesAt'],
});

export const ballotSchema = z.object({
  ranking: z.record(z.string(), z.number().int().positive()),
});
