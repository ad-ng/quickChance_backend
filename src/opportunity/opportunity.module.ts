import { Module } from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import { OpportunityController } from './opportunity.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  providers: [OpportunityService],
  controllers: [OpportunityController],
  imports: [NotificationsModule],
})
export class OpportunityModule {}
