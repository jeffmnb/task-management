import { z } from 'zod';
import { createUserSchema, getUserByIdSchema } from './schemas';

export type GetUserById = z.infer<typeof getUserByIdSchema>;

export type CreateUser = z.infer<typeof createUserSchema>;
