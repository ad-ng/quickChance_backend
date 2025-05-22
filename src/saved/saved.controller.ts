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

  @Post(':oppId')
  saveOpp(@Param() param: any, @Req() req: Request) {
    return this.savedService.savingOpp(param, req.user);
  }

  @Delete(':oppId')
  deleteSaved(@Param() param: any, @Req() req: Request) {
    return this.savedService.deleteSave(param, req.user);
  }
}
