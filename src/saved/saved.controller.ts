import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { SavedService } from './saved.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards';

@UseGuards(AuthGuard)
@Controller('saved')
export class SavedController {
  constructor(private savedService: SavedService) {}

  @Get('/me')
  mySaved(@Req() req: Request) {
    return this.savedService.allMySaves(req.user);
  }

  @Get('/:oppId')
  totalOppSaves(@Param() param: any) {
    return this.savedService.totalSaved(param);
  }
}
