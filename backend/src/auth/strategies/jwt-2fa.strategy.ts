import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../payload.interface';
import { User } from '../../users/user.entity';

@Injectable()
export class TwoFactorJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-2fa',
) {
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

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) return null;
    if (!user.twoFactorEnabled || payload.secondFactorChecked) {
      return user;
    }
    return null;
  }
}
