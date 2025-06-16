/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InterestsService {
  constructor(private prisma: PrismaService) {}

  async createPreferences(user, dto) {
    const userId: number = user.id;
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!currentUser) throw new UnauthorizedException();

    try {
      const newInterest = await this.prisma.userInterests.create({
        data: {
          userId: userId,
          categoryId: dto.categoryId,
        },
      });
      return newInterest;
    } catch (error) {
      return new InternalServerErrorException({ error });
    }
  }
}
