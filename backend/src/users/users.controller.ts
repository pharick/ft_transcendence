import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Logger,
  NotFoundException,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { UsersService } from './users.service';
import { User } from './user.entity';
import UserInfo from './userInfo.interface';

import {
  MaxFileSizeValidator,
  FileTypeValidator,
  DisplayNameValidator,
} from './users.validation.pipe';

@Controller('users')
export class UsersController {
  private logger: Logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async findOne(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<UserInfo> {
    const user: UserInfo = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Post(':userId/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/avatars',
        filename: function (req, file, callback) {
          callback(null, 'avatar_' + new Date().getTime());
        },
      }),
    }),
  )
  async uploadAvatar(
    @Param('userId') userId: number,
    @UploadedFile(
      new MaxFileSizeValidator(500000),
      new FileTypeValidator(['image/jpeg', 'image/png', 'image/jpg']),
    )
    file: Express.Multer.File,
  ) {
    await this.usersService.setAvatar(Number(userId), `${file.path}`);
  }

  @Post(':userId/name')
  async updateDisplayName(
    @Param('userId') userId: number,
    @Body(new DisplayNameValidator()) newNickname,
  ) {
    await this.usersService.setDisplayName(
      Number(userId),
      `${newNickname['nickname']}`,
    );
  }
}
