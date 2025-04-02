/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { loginDTO } from './dtos';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: loginDTO) {
    const { email, password } = dto;

    const currentUser = await this.prisma.user.findUnique({ where: { email } });

    if (!currentUser) {
      throw new ForbiddenException('invalid credentials');
    }

    const checkPassword = await argon.verify(currentUser.password, password);

    if (!checkPassword) {
      throw new ForbiddenException('invalid credentials');
    }

    return {
      currentUser,
    };
  }
}
