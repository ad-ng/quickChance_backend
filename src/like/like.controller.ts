import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Get(':oppId')
  singleOppAllLikes(@Param() param: any) {
    return this.likeService.singleOpp(param);
  }
}
