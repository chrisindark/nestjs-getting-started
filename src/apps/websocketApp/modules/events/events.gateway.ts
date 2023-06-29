import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { Logger } from "@nestjs/common";
// import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log("WebSocket server initialized");
  }

  @SubscribeMessage("events")
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log("events: ", data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: "events", data: item })),
    );
  }

  @SubscribeMessage("identity")
  async identity(@MessageBody() data: number): Promise<number> {
    console.log("identity: ", data);
    return data + 1;
  }

  @SubscribeMessage("endpoint")
  async handleEndpoint(
    client: Socket,
    @MessageBody() data: any,
  ): Promise<WsResponse<{ app: string; success: boolean }>> {
    console.log("endpoint: ", data);
    return { event: "endpoint", data: { app: "server", success: true } };
  }
}
