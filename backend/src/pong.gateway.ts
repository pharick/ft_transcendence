import {OnGatewayConnection, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import {Logger} from "@nestjs/common";

@WebSocketGateway({cors: true})
export class PongGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('PongGateway');

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Pong client connected: ${client.id}`);
    setInterval(() => {
      this.server.emit('pongInfo', 'hello');
    }, 1000)
  }
}
