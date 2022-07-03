import { Controller, Get, Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessage } from './chatMessage.entity';

@Controller('chat')
export class ChatController {
  private logger: Logger = new Logger('CompletedGamesController');

  constructor(private chatService: ChatService) {}

  @Get('common')
  findAllCommon(): Promise<ChatMessage[]> {
    return this.chatService.findAllCommon();
  }
}
