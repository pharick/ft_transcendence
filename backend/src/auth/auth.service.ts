import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService,
  ) {}

  async validateUser(ids: Record<string, number>, username: string) {
    return this.userService.findOrCreate(ids, username);
  }

  async login(user: User) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
      }),
    };
  }

  async getUser(token: string): Promise<User> {
    try {
      const { sub } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      if (!sub) return undefined;
      return await this.userService.findOne(sub);
    } catch (e) {
      if (e instanceof TokenExpiredError || e instanceof JsonWebTokenError)
        return undefined;
      throw e;
    }
  }
}
