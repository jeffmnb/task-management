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
import {
  CreateNewTask,
  DeleteTaskById,
  GetTaskById,
  SearchTaskByParam,
  SearchTaskByQuery,
  UpdateTaskStatus,
} from './schemas/schemas.types';
import {
  createNewTaskSchema,
  deleteTaskByIdSchema,
  getTaskByIdSchema,
  searchTaskByParamSchema,
  searchTaskByQuerySchema,
  updateTaskStatusSchema,
} from './schemas/schemas';
import { TaskEntity } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from '@/utils/zod-validation';
import { UserEntity } from '@/auth/user.entity';
import { UnifiedRequestData } from '@/decorators/unified-request-data';

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
  getTaskById(
    @Param('id') id: GetTaskById,
    @Req() { user }: { user: UserEntity },
  ): Promise<TaskEntity> {
    return this.tasksService.getTaskById({ id, user });
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
  deleteTaskById(
    @Param('id') id: DeleteTaskById,
    @Req() { user }: { user: UserEntity },
  ): Promise<void> {
    return this.tasksService.deleteTaskById({ id, user });
  }

  @Patch('/id/:id/status')
  @UsePipes(new ZodValidationPipe(updateTaskStatusSchema))
  updateTaskStatus(
    @UnifiedRequestData() { id, status }: UpdateTaskStatus,
    @Req() { user }: { user: UserEntity },
  ): Promise<TaskEntity> {
    return this.tasksService.updateTaskStatus({ id, status, user });
  }

  @Get('/search/:query')
  @UsePipes(new ZodValidationPipe(searchTaskByParamSchema))
  searchTaskByParam(
    @Param() { query }: SearchTaskByParam,
    @Req() { user }: { user: UserEntity },
  ): Promise<TaskEntity[]> {
    return this.tasksService.searchTask({ query, user });
  }

  @Get('/search')
  @UsePipes(new ZodValidationPipe(searchTaskByQuerySchema))
  searchTaskByQuery(
    @Query() { query, status }: SearchTaskByQuery,
    @Req() { user }: { user: UserEntity },
  ): Promise<TaskEntity[]> {
    return this.tasksService.searchTaskByQuery({ query, status, user });
  }
}
