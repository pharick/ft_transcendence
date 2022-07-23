import { Controller, Get, Logger, Param, ParseIntPipe, Session, UnauthorizedException } from '@nestjs/common';
import { ChatMessagesService } from './chatMessages.service';
import { ChatMessage } from './chatMessage.entity';

@Controller('chat/messages')
export class ChatMessagesController {
  private logger: Logger = new Logger('CompletedGamesController');

  constructor(private chatMessagesService: ChatMessagesService) {}

  @Get('common')
  findAllCommon(): Promise<ChatMessage[]> {
    return this.chatMessagesService.findAllCommon();
  }

  @Get('private/:companionId')
  findAllPrivate(
    @Param('companionId', new ParseIntPipe()) companionId: number,
    @Session() session: Record<string, any>,
  ): Promise<ChatMessage[]> {
    const userId = session.userId;
    if (!userId) throw new UnauthorizedException();
    return this.chatMessagesService.findAllPrivate(userId, companionId);
  }
}
