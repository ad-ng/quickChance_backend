import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeGateway } from './like.gateway';

@Module({
  providers: [LikeGateway, LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
