import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { Request } from 'express';
import { CreateOppDTO } from './dto/createOpp.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';

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
