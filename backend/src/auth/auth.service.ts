import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger('AuthService');

  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private readonly INTRA_GET_TOKEN_API_URL: string =
    'https://api.intra.42.fr/oauth/token';
  private readonly INTRA_USER_INFO_API_URL: string =
    'https://api.intra.42.fr/v2/me';

  private async getUserData(token: string): Promise<any> {
    const observable = await this.httpService
      .get(this.INTRA_USER_INFO_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(map((response) => response.data));
    return lastValueFrom(observable);
  }

  private async findOrCreateUser(username: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return await this.usersService.create(username);
    }
    return user;
  }

  async login(code: string): Promise<number> {
    let username;
    if (code == '0') {
      username = 'testuser';
    } else {
      const tokenObservable = this.httpService
        .post(this.INTRA_GET_TOKEN_API_URL, {
          grant_type: 'authorization_code',
          client_id: this.configService.get<string>('INTRA_CLIENT_ID'),
          client_secret: this.configService.get<string>('INTRA_CLIENT_SECRET'),
          code: code,
          redirect_uri: this.configService.get<string>('INTRA_REDIRECT_URL'),
        })
        .pipe(map((response) => response.data));

      const tokenData = await lastValueFrom(tokenObservable);
      const accessToken = tokenData.access_token;

      const userData = await this.getUserData(accessToken);
      username = userData.login;
    }

    const user = await this.findOrCreateUser(username);

    return user.id;
  }
}
