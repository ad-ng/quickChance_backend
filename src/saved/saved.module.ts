import { Module } from '@nestjs/common';
import { SavedController } from './saved.controller';
import { SavedService } from './saved.service';
import { SavedGateway } from './saved.gateway';

@Module({
  controllers: [SavedController],
  providers: [SavedService, SavedGateway],
})
export class SavedModule {}
