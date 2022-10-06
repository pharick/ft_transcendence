import { IsOptional, Length } from 'class-validator';

export enum ChatRoomType {
  Public,
  Private,
  Protected,
  Direct,
}

export class CreateChatRoomDto {
  @Length(3, 15)
  name: string;

  type: ChatRoomType;

  @IsOptional()
  @Length(3, 30)
  password?: string;
}

export class ChatMessageDto {
  roomId: number;
  text: string;
}

export class ChatRoomPasswordDto {
  password: string;
}

export class BanChatUserDto {
  durationMin: number;
}

export class MuteChatUserDto {
  durationMin: number;
}

export class InviteChatUserDto {
  userId: number;
}

export class CreateDirectDto {
  userId: number;
}
