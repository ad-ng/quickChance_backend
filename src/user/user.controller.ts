import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { UpdateUserDTO } from './dtos';
import { AuthGuard } from 'src/auth/guards';

@UseGuards(AuthGuard)
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
}
