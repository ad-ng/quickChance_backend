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

@WebSocketGateway({ cors: { origin: '*' } })
export class LikeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private likeService: LikeService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`User connected: ${client.id}`);
    client.emit('onConnect', 'connected!');
  }

  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.id}`);
    client.emit('onDisconnect', 'disconnected');
  }

  @SubscribeMessage('joinOpportunity')
  handleJoinOpportunity(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const opportunityId = parseInt(parsed.opportunityId, 10);

    if (isNaN(opportunityId)) {
      client.emit('error', { message: 'Invalid opportunityId format' });
      return;
    }

    const room = opportunityId.toString();
    client.join(room);
    console.log(`Client ${client.id} joined room: ${room}`);
    client.emit('joinedOpportunity', { opportunityId });
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

    // 🔍 Fetch like count from DB
    const likeCount = await this.likeService.singleOpp(opportunityId);

    // 📤 Reply back to the client
    client.emit('countLikesReply', {
      opportunityId,
      likeCount,
    });
  }
}
