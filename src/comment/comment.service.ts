import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
