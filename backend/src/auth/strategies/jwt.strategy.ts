import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/user.entity';
import { JwtPayload } from '../payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): Promise<User> {
    return this.usersService.findOne(payload.sub);
  }
}
