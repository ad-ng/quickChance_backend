import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SavedService } from './saved.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards';

@UseGuards(AuthGuard)
@Controller('saved')
export class SavedController {
  constructor(private savedService: SavedService) {}

  @Get('me')
  mySaved(@Req() req: Request) {
    return this.savedService.allMySaves(req.user);
  }

  @Get(':oppId')
  totalOppSaves(@Param() param: any) {
    return this.savedService.totalSaved(param);
  }

  @Post(':oppId')
  saveOpp(@Param() param: any, @Req() req: Request) {
    return this.savedService.savingOpp(param, req.user);
  }

  @Delete(':id')
  deleteSaved(@Param() param: any) {
    return this.savedService.deleteSave(param);
  }

  @Get('check/:oppId')
  checkIsSaved(@Param() Param: any, @Req() req: Request) {
    return this.savedService.checkSaved(Param, req.user);
  }
}
