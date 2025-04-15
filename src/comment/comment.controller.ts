import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { CommentService } from './comment.service';
import { Request } from 'express';

@UseGuards(AuthGuard, RolesGuard)
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('count/:oppId')
  countComment(@Param() param: any) {
    return this.commentService.oppCommentCount(param);
  }

  @Get(':oppId')
  getComments(@Param() param: any) {
    return this.commentService.getAllCommentsOnOpp(param);
  }

  @Post(':oppId')
  postComment(@Req() req: Request, @Param() param: any) {
    return this.commentService.addComment(param, req.user);
  }
}
