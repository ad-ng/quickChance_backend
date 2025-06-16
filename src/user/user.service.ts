/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminAddUserDTO, UpdateUserDTO } from './dtos';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
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

  async deleteUser(user) {
    await this.validatedUser(user);

    await this.prisma.user.delete({ where: { id: user.id } });

    return {
      message: 'user deleted successfully',
    };
  }

  async getAllUsers(query) {
    const limit = query.limit || 10; // extracting limit from query and make it 10 by default
    const page = query.page || 1; // extracting page from query and make it 1 by default

    try {
      //finding all users from db
      const allUsers = await this.prisma.user.findMany({
        orderBy: [{ id: 'desc' }], // sorting to arrange from latest registered user
        take: limit, // pagination
        skip: (page - 1) * limit, // pagination
      });

      // number of all users
      const totalUsers = await this.prisma.user.count();

      //returning response
      return {
        message: 'users found successfully',
        data: allUsers,
        currentPage: page,
        lastPage: Math.ceil(totalUsers / limit),
        total: totalUsers,
      };
    } catch (error) {
      throw new InternalServerErrorException(`error: ${error}`);
    }
  }

  async adminAddUser(dto: AdminAddUserDTO) {
    const checkEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (checkEmail) {
      throw new BadRequestException('Email already exist');
    }

    const hashedPassword: string = await argon.hash('quickChance@123');

    try {
      const newUser = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashedPassword,
          fullname: dto.fullname,
          gender: dto.gender,
          role: dto.role,
        },
      });

      await this.prisma.userNotification.create({
        data: {
          notificationId: 1,
          userId: newUser.id,
        },
      });

      return {
        message: 'user created successfully',
        data: newUser,
      };
    } catch (error) {
      return new InternalServerErrorException({ error });
    }
  }

  async adminUpdateUser(dto: AdminAddUserDTO, params) {
    const userId = parseInt(params.id, 10);

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) {
      throw new NotFoundException('User not found');
    }

    try {
      const newUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          username: dto.username,
          email: dto.email,
          fullname: dto.fullname,
          gender: dto.gender,
          role: dto.role,
        },
      });

      return {
        message: 'User updated successfully',
        data: newUser,
      };
    } catch (error) {
      return error;
    }
  }

  async adminDeleteUser(params) {
    const userId: number = parseInt(params.id, 10);

    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) throw new NotFoundException('user not found');

    await this.prisma.user.delete({ where: { id: userId } });

    return {
      message: 'user deleted successfully',
    };
  }

  // a function to easily validate the incoming user data
  async validatedUser(user) {
    const userId: number = user.id;
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { opportunity: true },
        },
      },
    });
    if (!currentUser) throw new UnauthorizedException();
    return currentUser;
  }
}
