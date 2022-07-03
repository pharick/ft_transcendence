export class CreatePendingGameDto {
  guestUserId: number | undefined;
}

export class ChatMessageDto {
  sessionId: string | undefined;
  text: string | undefined;
}
