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
import { CommentService } from './comment.service';

@WebSocketGateway()
export class CommentGateway {
  constructor(
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('getCommentCount')
  async handleGetSavedCount(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const opportunityId = parseInt(parsed.opportunityId, 10);

    if (isNaN(opportunityId)) {
      client.emit('error', { message: 'Invalid opportunityId' });
      return;
    }

    // Fetch comment count from DB
    const commentCount =
      await this.commentService.oppCommentCount(opportunityId);

    // Reply back to the client
    this.server.to(opportunityId.toString()).emit('countCommentReply', {
      opportunityId,
      commentCount,
    });
  }
}
