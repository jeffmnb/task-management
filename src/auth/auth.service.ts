import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';
import { SignUp, GetUserById, SignIn } from './schemas/schemas.type';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async getUserById(userId: GetUserById): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found.`);
    delete user.password;
    return user;
  }

  async signUp({ name, email, password }: SignUp): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPass,
    });
    try {
      await this.usersRepository.save(user);
    } catch ({ code }) {
      if (code == '23505') throw new ConflictException('email already exists');
    }
  }

  async signIn({ email, password }: SignIn): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (isPasswordValid) {
      const payload = { email };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException('please check your login credentials');
  }
}
