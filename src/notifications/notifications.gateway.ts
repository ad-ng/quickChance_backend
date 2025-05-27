/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { forwardRef, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway()
export class NotificationsGateway {
  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private notificationService: NotificationsService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinNotification')
  handleJoinOpportunity(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const email = parsed.email;

    client.join(email);

    console.log(`Client ${client.id} joined room:  ${email}`);

    client.emit(
      'joinedNotification',
      `Client ${client.id} joined room:  ${email}`,
    );
  }

  @SubscribeMessage('getNotificationCount')
  async handleGetSavedCount(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const userId = parseInt(parsed.userId, 10);
    const email = parsed.email;

    if (isNaN(userId)) {
      client.emit('error', { message: 'Invalid userId' });
      return;
    }

    // Fetch notification count from DB
    const notificationCount =
      await this.notificationService.countAllNot(userId);

    // Reply back to the client
    this.server.to(email).emit('countNotificationReply', {
      userId,
      notificationCount,
    });
  }
}
