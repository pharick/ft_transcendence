import { Length } from 'class-validator';

export class CreateChatRoomDto {
  @Length(3, 15)
  name: string;

  @Length(5, 30)
  password?: string;
}
