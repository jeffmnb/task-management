import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.types';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Get('/id/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createNewTask(@Body() createNewTaskInput: Partial<Task>): Task {
    return this.tasksService.createNewTask(createNewTaskInput);
  }

  @Delete('/id/:id')
  deleteTaskById(@Param('id') id: string) {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/id/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus({ id, status });
  }

  @Get('/search/:query')
  searchTaskByParam(@Param('query') query: string) {
    return this.tasksService.searchTask(query);
  }

  @Get('/search')
  searchTaskByQuery(
    @Query('query') query: string,
    @Query('status') status: TaskStatus,
  ) {
    return this.tasksService.searchTaskByQuery({ query, status });
  }
}
