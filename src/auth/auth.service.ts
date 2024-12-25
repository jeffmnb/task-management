import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';
import { CreateUser, GetUserById } from './schemas/schemas.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: UsersRepository,
  ) {}

  async getUserById(userId: GetUserById): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found.`);
    delete user.password;
    return user;
  }

  async createUser({ email, password }: CreateUser): Promise<void> {
    const user = this.usersRepository.create({
      email,
      password,
    });
    await this.usersRepository.save(user);
  }
}
