import {OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

import { PongService } from "./pong.service";
import { FrameInfo } from '../../types/interfaces';

@WebSocketGateway({cors: true})
export class PongGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('PongGateway');

  constructor(private pongService: PongService) {}

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Pong client connected: ${client.id}`);
  }

  @SubscribeMessage('connectToGame')
  handleConnectToGame(client: Socket, game_id: string): void {
    this.logger.log(`Client connected to game: ${game_id}`);
    client.join(game_id);
  }

  @SubscribeMessage('getNextFrame')
  handleGetNextFrame(client: Socket, game_id: string): void {
    const frame: FrameInfo = this.pongService.getNextFrame(game_id);
    this.server.to(game_id).emit('nextFrame', frame);
  }

  // @SubscribeMessage('moveClub1')
  // handleMoveClub1(client: Socket, delta: number): void {
  //   this.pongService.moveClub1(delta);
  // }
  //
  // @SubscribeMessage('moveClub2')
  // handleMoveClub2(client: Socket, delta: number): void {
  //   this.pongService.moveClub2(delta);
  // }
}
