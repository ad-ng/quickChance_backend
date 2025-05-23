/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

  async readingNotification(params, req) {
    const userId: number = req.id;
    const notId = parseInt(params['id'], 10);
    const checkNot = await this.prisma.notification.findUnique({
      where: { id: notId, userId },
    });
    if (!checkNot) throw new NotFoundException();

    try {
      await this.prisma.notification.update({
        where: { id: notId },
        data: { isRead: true },
      });
      return {
        message: 'isRead updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteNotification(param, req) {
    const notId: number = parseInt(param['id'], 10);
    const userId: number = req.id;

    const checKNot = await this.prisma.notification.findUnique({
      where: { id: notId },
    });

    if (!checKNot) throw new NotFoundException();

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) throw new UnauthorizedException();

    try {
      await this.prisma.notification.delete({ where: { id: notId } });
      return {
        message: 'notification deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
