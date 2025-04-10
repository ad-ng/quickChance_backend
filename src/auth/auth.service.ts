import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { loginDTO, RegisterDTO } from './dtos';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signin(dto: loginDTO) {
    const { email, password } = dto;

    const currentUser = await this.prisma.user.findUnique({ where: { email } });

    if (!currentUser) {
      throw new ForbiddenException('invalid credentials');
    }

    const checkPassword: boolean = await argon.verify(
      currentUser.password,
      password,
    );

    if (!checkPassword) {
      throw new ForbiddenException('invalid credentials');
    }

    return {
      token: await this.jwt.signAsync(currentUser),
      data: currentUser,
    };
  }

  async signup(dto: RegisterDTO) {
    const checkEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (checkEmail) {
      throw new BadRequestException('Email already exist');
    }

    const hashedPassword: string = await argon.hash(dto.password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashedPassword,
          phoneNumber: dto.phoneNumber,
        },
      });
      return {
        token: await this.jwt.signAsync(newUser),
        data: newUser,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }
}
