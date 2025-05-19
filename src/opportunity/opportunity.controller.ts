import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { Request } from 'express';
import { CreateOppDTO } from './dto/createOpp.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { OpportunityStatus, RoleStatus } from '@prisma/client';

@UseGuards(AuthGuard, RolesGuard)
@Controller('opportunity')
export class OpportunityController {
  constructor(private opportunityService: OpportunityService) {}

  @Get('/search')
  searchOpp(@Query('searchQuery') searchQuery: string) {
    return this.opportunityService.searchOpportunities(searchQuery);
  }

  @Get('/filter/status')
  filterOpp(@Query('oppStatus') oppStatus: OpportunityStatus) {
    return this.opportunityService.filterStatus(oppStatus);
  }

  @Get()
  getAllOpp() {
    return this.opportunityService.fetchAllOpportunity();
  }

  @Get(':id')
  getOneProp(@Param() param: any) {
    return this.opportunityService.fetchOneById(param);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Post()
  addOpp(@Req() req: Request, @Body() dto: CreateOppDTO) {
    return this.opportunityService.createOpp(dto, req.user);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Patch(':id')
  updateOne(@Param() param: any, @Body() dto: CreateOppDTO) {
    return this.opportunityService.updateById(dto, param);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Delete(':id')
  deleteOne(@Param() param: any) {
    return this.opportunityService.deleteOppById(param);
  }
}
