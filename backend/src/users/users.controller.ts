import {
  Body,
  Controller,
  FileTypeValidator,
  ForbiddenException,
  Get,
  Logger,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';

const storage = diskStorage({
  destination: './static/avatars',
  filename: (req, file, callback) => {
    callback(null, 'avatar_' + randomUUID());
  },
});

@Controller('users')
export class UsersController {
  private logger: Logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() request: Request) {
    return request.user;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    const user: User = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async uploadAvatar(
    @Req() request: Request,
    @Param('id', new ParseIntPipe()) userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    if (request.user.id != userId) throw new ForbiddenException();
    await this.usersService.setAvatar(userId, file.path);
  }

  // @Patch(':id')
  // async updateProfile(
  //   @Param('id', new ParseIntPipe()) userId: number,
  //   @Body() profile: ProfileDto,
  // ) {
  //   await this.usersService.updateProfile(userId, profile);
  // }
}
