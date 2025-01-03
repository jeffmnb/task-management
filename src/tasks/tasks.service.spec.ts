import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../src/tasks/tasks.service';
import { TaskStatus } from '../../src/tasks/tasks.types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskEntity } from '../../src/tasks/task.entity';
import { UserEntity } from 'src/auth/user.entity';

const mockTasksRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockUser: UserEntity = {
  id: '123',
  name: 'name',
  email: 'user@email.com',
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: typeof mockTasksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<typeof mockTasksRepository>(
      getRepositoryToken(TaskEntity),
    );
  });

  describe('getTasks', () => {
    it('calls TasksRepository.find and returns the result', async () => {
      tasksRepository.find.mockResolvedValue('someValue');
      const result = await tasksService.getAllTasks(mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        id: 'someId',
        title: 'Test Title',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        userId: mockUser.id,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById({
        id: 'someId',
        user: mockUser,
      });
      expect(result).toEqual(mockTask);
    });

    it('throws a NotFoundException if task is not found', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      await expect(
        tasksService.getTaskById({ id: '123', user: mockUser }),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('createNewTask', () => {
    it('calls TasksRepository.create and TasksRepository.save and returns the result', async () => {
      const mockTask = {
        id: 'someId',
        title: 'Test Title',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        userId: mockUser.id,
      };

      tasksRepository.create.mockReturnValue(mockTask);
      tasksRepository.save.mockResolvedValue(mockTask);

      const result = await tasksService.createNewTask(
        { title: 'Test Title', description: 'Test Description' },
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTaskById', () => {
    it('calls TasksRepository.delete and returns void', async () => {
      tasksService.getTaskById = jest.fn().mockResolvedValue(true);
      tasksRepository.delete.mockResolvedValue({ affected: 1 });

      await tasksService.deleteTaskById({ id: 'someId', user: mockUser });
      expect(tasksRepository.delete).toHaveBeenCalledWith('someId');
    });

    it('throws a NotFoundException if task is not found', async () => {
      tasksService.getTaskById = jest.fn().mockResolvedValue(null);
      await expect(
        tasksService.deleteTaskById({ id: 'someId', user: mockUser }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', () => {
    it('calls TasksRepository.save and returns the updated task', async () => {
      const mockTask = {
        id: 'someId',
        title: 'Test Title',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        userId: mockUser.id,
      };

      tasksService.getTaskById = jest.fn().mockResolvedValue(mockTask);
      tasksRepository.save.mockResolvedValue({
        ...mockTask,
        status: TaskStatus.IN_PROGRESS,
      });

      const result = await tasksService.updateTaskStatus({
        id: 'someId',
        status: TaskStatus.IN_PROGRESS,
        user: mockUser,
      });
      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });
  });

  describe('searchTask', () => {
    it('calls TasksRepository.find and returns the result', async () => {
      const mockTasks = [
        {
          id: 'someId',
          title: 'Test Title',
          description: 'Test Description',
          status: TaskStatus.OPEN,
          userId: mockUser.id,
        },
      ];

      tasksRepository.find.mockResolvedValue(mockTasks);
      const result = await tasksService.searchTask({
        query: 'Test',
        user: mockUser,
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('searchTaskByQuery', () => {
    it('calls TasksRepository.find and returns the result', async () => {
      const mockTasks = [
        {
          id: 'someId',
          title: 'Test Title',
          description: 'Test Description',
          status: TaskStatus.OPEN,
          userId: mockUser.id,
        },
      ];

      tasksRepository.find.mockResolvedValue(mockTasks);
      const result = await tasksService.searchTaskByQuery({
        query: 'Test',
        status: TaskStatus.OPEN,
        user: mockUser,
      });
      expect(result).toEqual(mockTasks);
    });
  });
});
