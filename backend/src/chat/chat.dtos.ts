import { IsOptional, Length } from 'class-validator';

export enum ChatRoomType {
  Public,
  Private,
  Protected,
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
