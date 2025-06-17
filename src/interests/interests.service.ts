/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
      await this.prisma.userInterests.create({
        data: {
          userId: userId,
          categoryId: dto.categoryId,
        },
      });
      return { message: 'interest added successfully' };
    } catch (error) {
      return new InternalServerErrorException({ error });
    }
  }

  async getAllPreferences(user) {
    const userId: number = user.id;
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!currentUser) throw new UnauthorizedException();

    try {
      const allInterest = await this.prisma.userInterests.findMany({
        where: { userId },
        include: { category: true },
      });
      return {
        message: 'Interest fetched',
        data: allInterest,
      };
    } catch (error) {
      return new InternalServerErrorException({ error });
    }
  }

  async deletePreferences(user, dto) {
    const userId: number = user.id;
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!currentUser) throw new UnauthorizedException();

    const checkPreferences = await this.prisma.userInterests.findUnique({
      where: {
        userId_categoryId: {
          userId: userId,
          categoryId: dto.categoryId,
        },
      },
    });

    if (!checkPreferences) throw new NotFoundException('interest not found');

    try {
      await this.prisma.userInterests.delete({
        where: {
          userId_categoryId: {
            userId: userId,
            categoryId: dto.categoryId,
          },
        },
      });
      return {
        message: 'interest deleted successfully',
      };
    } catch (error) {
      return new InternalServerErrorException({ error });
    }
  }
}
