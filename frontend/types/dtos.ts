export class CreatePendingGameDto {
  guestUserId?: number;
}

export class ChatMessageDto {
  sessionId?: string;
  roomId?: number;
  text?: string;
}
