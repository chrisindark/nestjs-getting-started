import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import {
  ClientToServerEvents,
  Message,
  ServerToClientEvents,
} from './chat.interface';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  private readonly logger = new Logger(ChatGateway.name);

  @SubscribeMessage('chat')
  async handleEvent(
    @MessageBody()
    payload: Message,
  ): Promise<Message> {
    this.logger.log(payload);
    // ServerToClientEvent
    // broadcast messages
    this.server.emit('chat', payload);
    return payload;
  }
}
