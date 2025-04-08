import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/gurds/auth.guards';
import { Request } from 'express';
import { UpdateUserDTO } from './dtos';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  currentUser(@Req() req: Request) {
    return this.userService.getCurrentUser(req.user);
  }

  @Post('/update')
  updateCurrentUser(@Req() req: Request, @Body() dto: UpdateUserDTO) {
    return this.userService.updateUser(req.user, dto);
  }

  @Delete('/delete')
  deleteUser(@Req() req: Request) {
    return this.userService.deleteUser(req.user);
  }
}
