import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: UsersRepository,
  ) {
    super({
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { email: string }): Promise<UserEntity> {
    const { email } = payload;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
