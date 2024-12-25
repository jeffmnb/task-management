import { z } from 'zod';

export const getUserByIdSchema = z.string().uuid();

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
