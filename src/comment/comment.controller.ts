import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { CommentService } from './comment.service';
import { Request } from 'express';
import { CommentDTO } from './dto';

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
  postComment(@Req() req: Request, @Body() dto: CommentDTO) {
    return this.commentService.addComment(dto, req.user);
  }

  @Delete(':id')
  deleteComment(@Param() param: any) {
    return this.commentService.deleteComment(param);
  }
}
