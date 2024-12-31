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
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
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
import { TaskEntity } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Req() { user }: { user: UserEntity }): Promise<TaskEntity[]> {
    return this.tasksService.getAllTasks(user);
  }

  @Get('/id/:id')
  @UsePipes(new ZodValidationPipe(getTaskByIdSchema))
  getTaskById(@Param('id') id: GetTaskById): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createNewTaskSchema))
  createNewTask(
    @Body() createNewTaskInput: CreateNewTask,
    @Req() { user }: { user: UserEntity },
  ): Promise<TaskEntity> {
    return this.tasksService.createNewTask(createNewTaskInput, user);
  }

  @Delete('/id/:id')
  @UsePipes(new ZodValidationPipe(deleteTaskByIdSchema))
  deleteTaskById(@Param('id') id: DeleteTaskById): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/id/:id/status')
  @UsePipes(new ZodValidationPipe(updateTaskStatusSchema))
  updateTaskStatus(
    @UnifiedRequestData() { id, status }: UpdateTaskStatus,
  ): Promise<TaskEntity> {
    return this.tasksService.updateTaskStatus({ id, status });
  }

  @Get('/search/:query')
  @UsePipes(new ZodValidationPipe(searchTaskByParamSchema))
  searchTaskByParam(
    @Param() { query }: SearchTaskByParam,
  ): Promise<TaskEntity[]> {
    return this.tasksService.searchTask(query);
  }

  @Get('/search')
  @UsePipes(new ZodValidationPipe(searchTaskByQuerySchema))
  searchTaskByQuery(
    @Query() { query, status }: SearchTaskByQuery,
  ): Promise<TaskEntity[]> {
    return this.tasksService.searchTaskByQuery({ query, status });
  }
}
