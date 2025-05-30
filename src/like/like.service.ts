import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeGateway } from './like.gateway';

@Injectable()
export class LikeService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => LikeGateway))
    private likeGateway: LikeGateway,
  ) {}

  async singleOpp(oppId: number) {
    const countOppLikes: number = await this.prisma.like.count({
      where: { oppId: oppId },
    });

    return {
      TotalLikes: countOppLikes,
    };
  }

  async checkIfIlikedOpp(oppId: number, userId: number) {
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) {
      throw new UnauthorizedException();
    }

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
        checkLike: false,
      };
    }

    return {
      checkLike: true,
    };
  }

  async createLike(params, user) {
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

    try {
      const addLike = await this.prisma.like.create({
        data: {
          oppId: oppId,
          userid: userId,
        },
      });
      const likeCount = await this.singleOpp(oppId);
      this.likeGateway.server.to(`${oppId}`).emit('countLikesReply', {
        opportunityId: oppId,
        likeCount,
      });

      const isLiked = await this.checkIfIlikedOpp(oppId, userId);
      this.likeGateway.server.to(`${oppId}-${userId}`).emit('checkLikesReply', {
        opportunityId: oppId,
        isLiked,
      });

      return {
        message: 'like added',
        data: {
          like: addLike,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async unliking(params, user) {
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

    try {
      await this.prisma.like.delete({
        where: {
          oppId_userid: {
            oppId: oppId,
            userid: userId,
          },
        },
      });
      const likeCount = await this.singleOpp(oppId);
      this.likeGateway.server.to(`${oppId}`).emit('countLikesReply', {
        opportunityId: oppId,
        likeCount,
      });

      const isLiked = await this.checkIfIlikedOpp(oppId, userId);
      this.likeGateway.server.to(`${oppId}-${userId}`).emit('checkLikesReply', {
        opportunityId: oppId,
        isLiked,
      });

      return {
        message: 'like deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
