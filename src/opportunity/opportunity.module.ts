import { Module } from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import { OpportunityController } from './opportunity.controller';

@Module({
  providers: [OpportunityService],
  controllers: [OpportunityController],
})
export class OpportunityModule {}
