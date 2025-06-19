import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Get()
  fetchNotifications(@Req() req: Request) {
    return this.notificationService.fetchAllNotifications(req.user);
  }

  @Get('read/:id')
  readNotification(@Param() Param: any, @Req() req: Request) {
    return this.notificationService.readingNotification(Param, req.user);
  }

  @Delete(':id')
  deleteNotification(@Param() Param: any, @Req() req: Request) {
    return this.notificationService.deleteNotification(Param, req.user);
  }

  @Get('unread')
  fetchUnreadNotifications(@Req() req: Request) {
    return this.notificationService.fetchAllUnreadNotifications(req.user);
  }
}
