/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LikeService } from './like.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class LikeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => LikeService))
    private likeService: LikeService,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('onConnect', 'connected!');
  }

  handleDisconnect(client: Socket) {
    client.emit('onDisconnect', 'disconnected');
  }

  @SubscribeMessage('joinOpportunity')
  handleJoinOpportunity(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const opportunityId = parseInt(parsed.opportunityId, 10);
    const userId = parseInt(parsed.userId, 10);

    if (isNaN(opportunityId)) {
      client.emit('error', { message: 'Invalid opportunityId format' });
      return;
    }

    const publicRoom = opportunityId.toString(); // for public broadcasts
    const privateRoom = `${opportunityId}-${userId}`; // for direct targeting

    client.join(publicRoom); // for broadcasting to all users on that opp
    client.join(privateRoom); // for targeting this specific user

    console.log(
      `Client ${client.id} joined rooms: [${publicRoom}, ${privateRoom}]`,
    );

    client.emit('joinedOpportunity', { opportunityId, userId });
  }

  @SubscribeMessage('getLikeCount')
  async handleGetLikeCount(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const opportunityId = parseInt(parsed.opportunityId, 10);

    if (isNaN(opportunityId)) {
      client.emit('error', { message: 'Invalid opportunityId' });
      return;
    }

    // Fetch like count from DB
    const likeCount = await this.likeService.singleOpp(opportunityId);

    // Reply back to the client
    this.server.to(opportunityId.toString()).emit('countLikesReply', {
      opportunityId,
      likeCount,
    });
  }

  @SubscribeMessage('checkIfLiked')
  async handCheckIfLiked(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const opportunityId = parseInt(parsed.opportunityId, 10);
    const userId = parseInt(parsed.userId, 10);

    if (isNaN(opportunityId) || isNaN(userId)) {
      client.emit('error', { message: 'Invalid opportunityId or userId' });
      return;
    }

    // Fetch like count from DB
    const isLiked = await this.likeService.checkIfIlikedOpp(
      opportunityId,
      userId,
    );

    // Reply back to the client
    this.server.to(`${opportunityId}-${userId}`).emit('countLikesReply', {
      opportunityId,
      isLiked,
    });
  }
}
