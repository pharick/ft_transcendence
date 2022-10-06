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
  mode?: number;
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

export class ChatRoomPasswordDto {
  password: string;
}

export class BanChatUserDto {
  durationMin: number;
}

export class MuteChatUserDto {
  durationMin: number;
}

export class TwoFactorCodeDto {
  code: string;
}

export class InviteChatUserDto {
  userId: number;
}

export class CreateInviteFriendDto {
  friendId: number;
}

export class CreateDirectDto {
  userId: number;
}
