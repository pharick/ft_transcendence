import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
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
import { TwoFactorJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { UpdateUserProfileDto } from './updateUserProfile.dto';

const storage = diskStorage({
  destination: './static/avatars',
  filename: (req, file, callback) => {
    callback(null, 'avatar_' + randomUUID());
  },
});

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(TwoFactorJwtAuthGuard)
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

  @UseGuards(TwoFactorJwtAuthGuard)
  @Put('me/avatar')
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async uploadAvatar(
    @Req() request: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpeg|image/png' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.usersService.setAvatar(request.user.id, file.path);
  }

  @UseGuards(TwoFactorJwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @Req() request: Request,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    await this.usersService.updateProfile(
      request.user.id,
      updateUserProfileDto,
    );
  }
}
