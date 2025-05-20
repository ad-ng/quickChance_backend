/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async fetchAllNotifications() {
    try {
      const allNotifications = await this.prisma.notification.findMany();
      return {
        message: 'notifications fetched successfully',
        data: allNotifications,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async countAllNot(user) {
    const userId: number = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) throw new UnauthorizedException();

    const notificationCount = await this.prisma.notification.count({
      where: { userId },
    });
    return {
      message: 'notifications count fetched successfully',
      data: {
        notificationCount,
      },
    };
  }
  catch(error) {
    throw new InternalServerErrorException(error);
  }
}
