export class ResumeGameDto {
  gameId: string;
}

export class MoveClubStartDto {
  gameId: string;
  up: boolean;
}

export class MoveClubStopDto {
  gameId: string;
}

export class CreatePendingGameDto {
  player2Id: number;
}

export class UpdateUserProfileDto {
  username: string;
}

export enum ChatRoomType {
  Public,
  Private,
  Protected,
}

export class CreateChatRoomDto {
  name: string;
  type: ChatRoomType;
  password?: string;
}

export class ChatMessageDto {
  roomId: number;
  text: string;
}
