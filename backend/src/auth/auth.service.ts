import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-42';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger('AuthService');

  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser(
    ids: Record<string, number>,
    username: string,
  ): Promise<any> {
    return this.userService.findOrCreate(ids, username);
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
      }),
    };
  }
}
