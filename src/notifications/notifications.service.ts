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
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsGateway))
    private notificationGateway: NotificationsGateway,
  ) {}

  async fetchAllNotifications(user) {
    const userId: number = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) throw new UnauthorizedException();

    try {
      const allNotifications = await this.prisma.userNotification.findMany({
        where: {
          userId,
        },
        include: {
          notification: {
            include: {
              opportunity: { include: { user: true, category: true } },
            },
          },
        },
      });

      return {
        message: 'notifications fetched successfully',
        data: allNotifications,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async countAllNot(userId) {
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!checkUser) throw new UnauthorizedException();

    const notificationCount = await this.prisma.userNotification.count({
      where: { userId, isRead: false },
    });

    return notificationCount;
  }
  catch(error) {
    throw new InternalServerErrorException(error);
  }

  async readingNotification(params, req) {
    const userId: number = req.id;
    const notId = parseInt(params['id'], 10);
    const checkNot = await this.prisma.userNotification.findUnique({
      where: { id: notId, userId },
    });
    if (!checkNot) throw new NotFoundException();

    try {
      await this.prisma.userNotification.update({
        where: { id: notId },
        data: { isRead: true },
      });

      // Fetch notification count from DB
      const notificationCount = await this.countAllNot(userId);

      // Reply back to the client
      this.notificationGateway.server
        .to(req.email)
        .emit('countNotificationReply', {
          userId,
          notificationCount,
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

    const checKNot = await this.prisma.userNotification.findUnique({
      where: { id: notId },
    });

    if (!checKNot) throw new NotFoundException();

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) throw new UnauthorizedException();

    try {
      await this.prisma.userNotification.delete({ where: { id: notId } });

      // Fetch notification count from DB
      const notificationCount = await this.countAllNot(userId);

      // Reply back to the client
      this.notificationGateway.server
        .to(req.email)
        .emit('countNotificationReply', {
          userId,
          notificationCount,
        });

      return {
        message: 'notification deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchAllUnreadNotifications(user) {
    const userId: number = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) throw new UnauthorizedException();

    try {
      const allNotifications = await this.prisma.userNotification.findMany({
        where: {
          userId,
          isLocalSent: false,
        },
        include: {
          notification: {
            include: {
              opportunity: { include: { user: true, category: true } },
            },
          },
        },
      });

      return {
        message: 'unread notifications fetched successfully',
        data: allNotifications,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updatingIsLocalNotificationSent(params, req) {
    const userId: number = req.id;
    const notId = parseInt(params['id'], 10);
    const checkNot = await this.prisma.userNotification.findUnique({
      where: { id: notId, userId },
    });
    if (!checkNot) throw new NotFoundException();

    try {
      await this.prisma.userNotification.update({
        where: { id: notId },
        data: { isLocalSent: true },
      });

      return {
        message: 'isLocalSent updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
