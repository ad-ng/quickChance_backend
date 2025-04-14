import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Request } from 'express';

@UseGuards(AuthGuard, RolesGuard)
@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Get(':oppId')
  singleOppAllLikes(@Param() param: any) {
    return this.likeService.singleOpp(param);
  }

  @Get('check/:oppId')
  checkIfIliked(@Param() param: any, @Req() req: Request) {
    return this.likeService.checkIfIlikedOpp(param, req.user);
  }

  @Post('add/:oppId')
  addLike(@Param() param: any, @Req() req: Request) {
    return this.likeService.createLike(param, req.user);
  }
}
