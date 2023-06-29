import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(8081, {
  cors: {
    origin: "*",
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(MessageGateway.name);

  @WebSocketServer() wss: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log("WebSocket server initialized");
  }

  @SubscribeMessage("message")
  async handleMessage(client: Socket, data: any): Promise<WsResponse> {
    console.log(data);
    // const newMessage = await this.messagesService.createMessage(payload);
    // this.wss.emit('message', 'newMessage');
    return { event: "message", data: "world" };
  }
}
