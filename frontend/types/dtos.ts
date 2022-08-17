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

export class CreateChatRoomDto {
  name: string;
  password?: string;
}
