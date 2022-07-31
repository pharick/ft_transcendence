import { Controller, Get, Logger } from '@nestjs/common';
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
}
