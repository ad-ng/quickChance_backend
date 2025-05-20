import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Get()
  fetchNotifications() {
    return this.notificationService.fetchAllNotifications();
  }

  @Get('count')
  countNotifications(@Req() req: Request) {
    return this.notificationService.countAllNot(req.user);
  }

  @Get('read/:id')
  readNotification(@Param() Param: any, @Req() req: Request) {
    return this.notificationService.readingNotification(Param, req.user);
  }

  @Delete(':id')
  deleteNotification(@Param() Param: any, @Req() req: Request) {
    return this.notificationService.deleteNotification(Param, req.user);
  }
}
