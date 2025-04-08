/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dtos';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  getCurrentUser(user) {
    this.validatedUser(user);
    return {
      message: 'user found successfully',
      data: this.validatedUser(user),
    };
  }

  updateUser(user, dataToUpdate: UpdateUserDTO) {
    return 'update user route';
  }

  // a function to easily validate the incoming user data
  async validatedUser(user) {
    const userId: number = user.id;
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!currentUser) throw new UnauthorizedException();
    return currentUser;
  }
}
