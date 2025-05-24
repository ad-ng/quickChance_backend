import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentGateway } from './comment.gateway';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentGateway],
})
export class CommentModule {}
