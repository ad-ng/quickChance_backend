import { Controller, Get, UseGuards } from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import { AuthGuard, RolesGuard } from 'src/auth/guards';

@UseGuards(AuthGuard, RolesGuard)
@Controller('opportunity')
export class OpportunityController {
  constructor(private opportunityService: OpportunityService) {}

  @Get()
  getAllOpp() {
    return this.opportunityService.fetchAllOpportunity();
  }
}
