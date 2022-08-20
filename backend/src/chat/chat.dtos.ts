import { IsOptional, Length } from 'class-validator';

export class CreateChatRoomDto {
  @Length(3, 15)
  name: string;

  @IsOptional()
  @Length(3, 30)
  password?: string;
}
