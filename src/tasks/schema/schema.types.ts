import { z } from 'zod';
import {
  createNewTaskSchema,
  deleteTaskByIdSchema,
  getTaskByIdSchema,
  searchTaskByParamSchema,
  searchTaskByQuerySchema,
  updateTaskStatusSchema,
} from './schema';

export type CreateNewTask = z.infer<typeof createNewTaskSchema>;

export type GetTaskById = z.infer<typeof getTaskByIdSchema>;

export type DeleteTaskById = z.infer<typeof deleteTaskByIdSchema>;

export type UpdateTaskStatus = z.infer<typeof updateTaskStatusSchema>;

export type SearchTaskByParam = z.infer<typeof searchTaskByParamSchema>;

export type SearchTaskByQuery = z.infer<typeof searchTaskByQuerySchema>;
