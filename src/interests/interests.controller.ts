import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { AuthGuard } from 'src/auth/guards';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('interests')
export class InterestsController {
  constructor(private interestService: InterestsService) {}

  @Get()
  fetchAllInterest(@Req() req: Request) {
    return this.interestService.getAllPreferences(req.user);
  }

  @Post()
  addInterests(@Req() req: Request, @Body() dto: any) {
    return this.interestService.createPreferences(req.user, dto);
  }
}
