import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { loginDTO } from './dtos';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signup(dto: loginDTO) {
    return {
      user: dto,
    };
  }
}
