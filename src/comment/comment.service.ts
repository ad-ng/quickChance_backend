/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDTO } from './dto';
import { CommentGateway } from './comment.gateway';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => CommentGateway))
    private commentGateway: CommentGateway,
  ) {}

  async oppCommentCount(oppId: number) {
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) throw new NotFoundException();

    try {
      const commentCount = await this.prisma.comment.count({
        where: { oppId: oppId },
      });

      return commentCount;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllCommentsOnOpp(params) {
    const oppId = parseInt(params.oppId, 10);
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) throw new NotFoundException();

    try {
      const allComments = await this.prisma.comment.findMany({
        include: { user: true },
        where: { oppId },
      });

      return {
        message: 'comments found successfully',
        data: allComments,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addComment(dto: CommentDTO, user) {
    const oppId = dto.oppId;
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) throw new NotFoundException();

    const userId: number = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) throw new UnauthorizedException();

    try {
      const addedComment = await this.prisma.comment.create({
        data: { oppId, userid: userId, body: dto.body },
      });

      // Fetch comments count from DB
      const commentCount = await this.oppCommentCount(oppId);

      // Reply back to the client
      this.commentGateway.server
        .to(oppId.toString())
        .emit('countCommentReply', {
          opportunityId: oppId,
          commentCount,
        });

      return {
        message: 'comment added successfully',
        data: addedComment,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteComment(param) {
    const id: number = parseInt(param.id, 10);
    const checkComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!checkComment) throw new NotFoundException();

    try {
      await this.prisma.comment.delete({ where: { id } });

      // Fetch comments count from DB
      const commentCount = await this.oppCommentCount(checkComment.oppId);

      // Reply back to the client
      this.commentGateway.server
        .to(checkComment.oppId.toString())
        .emit('countCommentReply', {
          opportunityId: checkComment.oppId,
          commentCount,
        });

      return {
        message: 'comment deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
