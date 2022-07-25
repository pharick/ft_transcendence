import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Logger,
  NotFoundException,
  ParseIntPipe,
  Res,
  UploadedFile,
  UseInterceptors,
  StreamableFile
} from '@nestjs/common';

import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express'
import { createReadStream } from 'fs';
import { Response, Express } from 'express';

import { UsersService } from './users.service';
import { User } from './user.entity';
import UserInfo from './userInfo.interface';

import {
  MaxFileSizeValidator,
  FileTypeValidator,
  DisplayNameValidator
} from './users.validation.pipe'


@Controller('users')
export class UsersController {
  private logger: Logger = new Logger('UsersController');
  private defaultAvatar = '/usr/src/app/test/default_avatar.png';

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

  @Get(':userId/avatar')
  async serveAvatar(
    @Param('userId') userId: number,
    @Res({ passthrough: true }) response: Response
  ) {
    const user: UserInfo = await this.usersService.findOne(userId);
    var userAvatar = user['avatar'];
    if (userAvatar == '') {
      userAvatar = this.defaultAvatar;
    }
    const stream = createReadStream(userAvatar);
    response.set({
      'Content-Disposition': `inline; filename='avatar_${user.username}'`,
      'Content-Type': 'image/png'
    })
    return new StreamableFile(stream);
  }

  @Post(':userId/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './avatars',
      filename: function (req, file, callback) {
          callback(null, 'avatar_' + new Date().getTime());
      }
    }),
  }))
  async uploadAvatar(
    @Param('userId') userId: number, 
    @UploadedFile(
      new MaxFileSizeValidator(500000),
      new FileTypeValidator(['image/jpeg', 'image/png', 'image/jpg']),
    ) file: Express.Multer.File
  ) {
    this.usersService.setAvatar(Number(userId), `${file.path}`);
  }

  @Post(':userId/name')
  updateDisplayName(
    @Param('userId') userId: number,
    @Body(new DisplayNameValidator()) newNickname
  ) {
    this.usersService.setDisplayName(Number(userId), `${newNickname['nickname']}`);
  }

}
