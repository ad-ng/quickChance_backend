import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async singleOpp(params) {
    const oppId: number = parseInt(params.oppId, 10);
    const countOppLikes: number = await this.prisma.like.count({
      where: { oppId: oppId },
    });

    return {
      message: 'likes fetched successfully',
      data: { TotalLikes: countOppLikes },
    };
  }

  async checkIfIlikedOpp(params, user) {
    const userId: number = parseInt(user.id, 10);
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) {
      throw new UnauthorizedException();
    }

    const oppId: number = parseInt(params.oppId, 10);
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) {
      throw new NotFoundException();
    }

    const checkLike = await this.prisma.like.findUnique({
      where: {
        oppId_userid: {
          oppId: oppId,
          userid: userId,
        },
      },
    });

    if (!checkLike) {
      return {
        message: 'Check like found',
        data: {
          checkLike: false,
        },
      };
    }

    return {
      message: 'Check like found',
      data: {
        checkLike: true,
      },
    };
  }
}
