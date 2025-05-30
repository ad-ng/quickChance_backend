import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { UpdateUserDTO } from './dtos';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { RoleStatus } from '@prisma/client';
import { Roles } from 'src/auth/decorators/role.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  currentUser(@Req() req: Request) {
    return this.userService.getCurrentUser(req.user);
  }

  @Put('/update')
  updateCurrentUser(@Req() req: Request, @Body() dto: UpdateUserDTO) {
    return this.userService.updateUser(req.user, dto);
  }

  @Delete('/delete')
  deleteUser(@Req() req: Request) {
    return this.userService.deleteUser(req.user);
  }

  @Roles(RoleStatus.admin)
  @Get('/admin/getall')
  adminFetchAllUsers(@Query() query: any) {
    return this.userService.getAllUsers(query);
  }
}
