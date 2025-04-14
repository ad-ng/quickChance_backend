import { Injectable } from '@nestjs/common';
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
}
