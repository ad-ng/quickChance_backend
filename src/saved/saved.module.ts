import { Module } from '@nestjs/common';
import { SavedController } from './saved.controller';
import { SavedService } from './saved.service';

@Module({
  controllers: [SavedController],
  providers: [SavedService],
})
export class SavedModule {}
