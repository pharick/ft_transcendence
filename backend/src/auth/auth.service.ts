import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { toFileStream } from 'qrcode';

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

  async login(user: User, secondFactorChecked = false) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        secondFactorChecked,
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

  async generate2FactorSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      `${user.username} - ${user.id}`,
      'ft_transcendence',
      secret,
    );
    await this.userService.setTwoFactorSecret(user.id, secret);

    return { secret, otpAuthUrl };
  }

  async get2FactorQRCode(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  validate2FactorCode(code: string, user: User): boolean {
    return authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });
  }
}
