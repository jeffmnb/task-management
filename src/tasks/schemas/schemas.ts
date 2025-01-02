import { z } from 'zod';
import { TaskStatus } from '../tasks.types';
import { UserEntity } from 'src/auth/user.entity';

export const createNewTaskSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(5),
});

export const getTaskByIdSchema = z.string().uuid();

export const deleteTaskByIdSchema = z.string().uuid();

export const updateTaskStatusSchema = z.object({
  id: z.string().uuid().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  user: z.instanceof(UserEntity).optional(),
});

export const searchTaskByParamSchema = z.object({
  query: z.string().min(3),
});

export const searchTaskByQuerySchema = z.object({
  query: z.string().min(3),
  status: z.nativeEnum(TaskStatus),
  user: z.instanceof(UserEntity).optional(),
});
