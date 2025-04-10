import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { Request } from 'express';
import { CreateOppDTO } from './dto/createOpp.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('opportunity')
export class OpportunityController {
  constructor(private opportunityService: OpportunityService) {}

  @Get()
  getAllOpp() {
    return this.opportunityService.fetchAllOpportunity();
  }

  @Get(':id')
  getOneProp(@Param() param: any) {
    return this.opportunityService.fetchOneById(param);
  }

  @Post()
  addOpp(@Req() req: Request, @Body() dto: CreateOppDTO) {
    return this.opportunityService.createOpp(dto, req.user);
  }
}
