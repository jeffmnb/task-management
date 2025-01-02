import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './tasks.types';
import { v4 as uuid } from 'uuid';
import { TasksRepository } from './tasks.repository';
import { TaskEntity } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchTaskByQuery, UpdateTaskStatus } from './schemas/schemas.types';
import { ILike } from 'typeorm';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: TasksRepository,
  ) {}

  async getAllTasks(user: UserEntity): Promise<TaskEntity[]> {
    const allTasks = await this.tasksRepository.find({
      where: { userId: user?.id },
    });
    if (!allTasks?.length) throw new NotFoundException('Not found any Tasks');
    return allTasks;
  }

  async getTaskById({
    id,
    user,
  }: {
    id: string;
    user?: UserEntity;
  }): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found.`);
    if (task?.userId === user?.id) return task;
    throw new ForbiddenException(`You don't have permission`);
  }

  async createNewTask(
    createNewTaskInput: Partial<TaskEntity>,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createNewTaskInput;
    const task = this.tasksRepository.create({
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
      userId: user?.id,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTaskById({
    id,
    user,
  }: {
    id: string;
    user: UserEntity;
  }): Promise<void> {
    const taskExist = await this.getTaskById({ id, user });
    if (!taskExist) throw new NotFoundException(`Task with ID ${id} not found`);
    await this.tasksRepository.delete(id);
  }

  async updateTaskStatus({
    status,
    id,
    user,
  }: UpdateTaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById({ id, user });
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async searchTask({ query, user }: { query: string; user: UserEntity }) {
    return await this.tasksRepository.find({
      where: { title: ILike(`%${query}%`), userId: user?.id },
    });
  }

  async searchTaskByQuery({
    query,
    status,
    user,
  }: SearchTaskByQuery): Promise<TaskEntity[]> {
    return await this.tasksRepository.find({
      where: { title: ILike(`%${query}%`), status, userId: user?.id },
    });
  }
}
