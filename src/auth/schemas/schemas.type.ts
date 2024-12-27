import { z } from 'zod';
import { signUpSchema, getUserByIdSchema, signInSchema } from './schemas';

export type GetUserById = z.infer<typeof getUserByIdSchema>;

export type SignUp = z.infer<typeof signUpSchema>;

export type SignIn = z.infer<typeof signInSchema>;
