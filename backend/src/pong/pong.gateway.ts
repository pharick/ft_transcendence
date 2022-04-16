import {OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

import { PongService } from "./pong.service";
import { FrameInfo } from './interfaces';

@WebSocketGateway({cors: true})
export class PongGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('PongGateway');

  constructor(private pongService: PongService) {}

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Pong client connected: ${client.id}`);

    setInterval(() => {
      const frameInfo: FrameInfo = this.pongService.getNextFrame();
      this.server.emit('frameInfo', frameInfo);
    }, 10);
  }

  @SubscribeMessage('moveClub1')
  handleMoveClub1(client: Socket, delta: number): void {
    this.pongService.moveClub1(delta);
  }

  @SubscribeMessage('moveClub2')
  handleMoveClub2(client: Socket, delta: number): void {
    this.pongService.moveClub2(delta);
  }
}
