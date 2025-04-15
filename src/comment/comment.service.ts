/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDTO } from './dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async oppCommentCount(params) {
    const oppId = parseInt(params.oppId, 10);
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) throw new NotFoundException();

    try {
      const commentCount = await this.prisma.comment.count({
        where: { oppId: oppId },
      });

      return {
        message: 'count found successfully',
        data: {
          count: commentCount,
        },
      };
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
      return {
        message: 'comment added successfully',
        data: addedComment,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
