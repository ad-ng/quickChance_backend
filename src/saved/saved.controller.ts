import { Controller, Get, Param } from '@nestjs/common';
import { SavedService } from './saved.service';

@Controller('saved')
export class SavedController {
  constructor(private savedService: SavedService) {}

  @Get('/:oppId')
  totalOppSaves(@Param() param: any) {
    return this.savedService.totalSaved(param);
  }
}
