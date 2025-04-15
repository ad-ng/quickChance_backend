import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { CommentService } from './comment.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('count/:oppId')
  countComment(@Param() param: any) {
    return this.commentService.oppCommentCount(param);
  }
}
