import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { ZodValidationPipe } from 'src/utils/zod-validation';
import { createUserSchema, getUserByIdSchema } from './schemas/schemas';
import { CreateUser, GetUserById } from './schemas/schemas.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/id/:id')
  @UsePipes(new ZodValidationPipe(getUserByIdSchema))
  getUserById(@Param('id') userId: GetUserById): Promise<UserEntity> {
    return this.authService.getUserById(userId);
  }

  @Post('/create')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  createUser(@Body() { email, password }: CreateUser) {
    return this.authService.createUser({ email, password });
  }
}
