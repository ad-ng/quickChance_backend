/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SavedService } from './saved.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway()
export class SavedGateway {
  constructor(
    @Inject(forwardRef(() => SavedService))
    private savedService: SavedService,
  ) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('getSavedCount')
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

    // Fetch Saved count from DB
    const SavedCount = await this.savedService.totalSaved(opportunityId);

    // Reply back to the client
    this.server.to(opportunityId.toString()).emit('countSavedReply', {
      opportunityId,
      SavedCount,
    });
  }
}
