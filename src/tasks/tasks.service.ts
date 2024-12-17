import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.types';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(taskId: string) {
    return this.tasks.find(({ id }) => taskId === id);
  }

  createNewTask(createNewTaskInput: Partial<Task>): Task {
    const { title, description } = createNewTaskInput;
    const newTask: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  deleteTaskById(taskId: string) {
    return (this.tasks = this.tasks.filter(({ id }) => taskId !== id));
  }

  updateTaskStatus({ status, id }: { status: TaskStatus; id: string }): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  searchTask(query: string) {
    return this.tasks.filter(({ title }) =>
      title.toLowerCase().includes(query.toLowerCase()),
    );
  }

  searchTaskByQuery({
    query,
    status: taskStatus,
  }: {
    query: string;
    status: TaskStatus;
  }): Task[] {
    let allTasks = this.getAllTasks();
    if (taskStatus)
      allTasks = allTasks.filter(({ status }) => status === taskStatus);
    if (query) {
      allTasks = allTasks.filter(({ title }) =>
        title.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return allTasks;
  }
}
