/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dtos';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getCurrentUser(user) {
    await this.validatedUser(user);
    return {
      message: 'user found successfully',
      data: await this.validatedUser(user),
    };
  }

  async updateUser(user, dataToUpdate: UpdateUserDTO) {
    const currentUser = await this.validatedUser(user);

    const updatedUser = await this.prisma.user.update({
      where: { id: currentUser.id },
      data: dataToUpdate,
    });
    return {
      message: 'user updated successfully',
      date: updatedUser,
    };
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
