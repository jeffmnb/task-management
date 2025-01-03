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
import {
  signUpSchema,
  getUserByIdSchema,
  signInSchema,
} from './schemas/schemas';
import { SignUp, GetUserById, SignIn } from './schemas/schemas.type';
import { ZodValidationPipe } from '@/utils/zod-validation';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/id/:id')
  @UsePipes(new ZodValidationPipe(getUserByIdSchema))
  getUserById(@Param('id') userId: GetUserById): Promise<UserEntity> {
    return this.authService.getUserById(userId);
  }

  @Post('/signup')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(signUpSchema))
  signUp(@Body() input: SignUp) {
    return this.authService.signUp(input);
  }

  @Post('/signin')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(signInSchema))
  signIn(@Body() input: SignIn): Promise<{ accessToken: string }> {
    return this.authService.signIn(input);
  }
}
