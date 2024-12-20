import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.types';
import { ZodValidationPipe } from 'src/utils/zod-validation';
import {
  CreateNewTask,
  DeleteTaskById,
  GetTaskById,
  SearchTaskByParam,
  SearchTaskByQuery,
  UpdateTaskStatus,
} from './schema/schema.types';
import {
  createNewTaskSchema,
  deleteTaskByIdSchema,
  getTaskByIdSchema,
  searchTaskByParamSchema,
  searchTaskByQuerySchema,
  updateTaskStatusSchema,
} from './schema/schema';
import { UnifiedRequestData } from 'src/decorators/unified-request-data';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Get('/id/:id')
  @UsePipes(new ZodValidationPipe(getTaskByIdSchema))
  getTaskById(@Param('id') id: GetTaskById) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createNewTaskSchema))
  createNewTask(@Body() createNewTaskInput: CreateNewTask): Task {
    return this.tasksService.createNewTask(createNewTaskInput);
  }

  @Delete('/id/:id')
  @UsePipes(new ZodValidationPipe(deleteTaskByIdSchema))
  deleteTaskById(@Param('id') id: DeleteTaskById) {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/id/:id/status')
  @UsePipes(new ZodValidationPipe(updateTaskStatusSchema))
  updateTaskStatus(
    @UnifiedRequestData() { id, status }: UpdateTaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus({ id, status });
  }

  @Get('/search/:query')
  @UsePipes(new ZodValidationPipe(searchTaskByParamSchema))
  searchTaskByParam(@Param() { query }: SearchTaskByParam) {
    return this.tasksService.searchTask(query);
  }

  @Get('/search')
  @UsePipes(new ZodValidationPipe(searchTaskByQuerySchema))
  searchTaskByQuery(@Query() { query, status }: SearchTaskByQuery) {
    return this.tasksService.searchTaskByQuery({ query, status });
  }
}
