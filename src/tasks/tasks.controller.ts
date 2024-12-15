import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.types';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createNewTask(@Body() createNewTaskInput: Partial<Task>): Task {
    return this.tasksService.createNewTask(createNewTaskInput);
  }
}
