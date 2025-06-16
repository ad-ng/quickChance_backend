import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AdminAddUserDTO, UpdateUserDTO } from './dtos';
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

  @Roles(RoleStatus.admin)
  @Post('/admin/add')
  adminAddUser(@Body() dto: AdminAddUserDTO) {
    return this.userService.adminAddUser(dto);
  }

  @Roles(RoleStatus.admin)
  @Patch('/admin/:id')
  adminUpdateUser(@Body() dto: AdminAddUserDTO, @Param() param: any) {
    return this.userService.adminUpdateUser(dto, param);
  }

  @Roles(RoleStatus.admin)
  @Delete('/admin/:id')
  adminDeleteUser(@Param() param: any) {
    return this.userService.adminDeleteUser(param);
  }
}
