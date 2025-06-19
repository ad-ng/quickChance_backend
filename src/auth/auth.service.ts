/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleUserDTO, loginDTO, RegisterDTO } from './dtos';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private client = new OAuth2Client(
    '1006205845168-365pel72t3stj8krg21fr23k7leo3jb7.apps.googleusercontent.com',
  );

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

      await this.prisma.userNotification.create({
        data: {
          notificationId: 1,
          userId: newUser.id,
          isLocalSent: false,
          isRead: false,
        },
      });

      const allCategories = await this.prisma.category.findMany();

      const interestsData = allCategories.map((category) => ({
        categoryId: category.id,
        userId: newUser.id,
      }));

      await this.prisma.userInterests.createMany({
        data: interestsData,
        skipDuplicates: true,
      });

      return {
        token: await this.jwt.signAsync(newUser),
        data: newUser,
      };
    } catch (error) {
      return error;
    }
  }

  async verifyGoogleIdToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience:
          '1006205845168-365pel72t3stj8krg21fr23k7leo3jb7.apps.googleusercontent.com',
      });

      const payload = ticket.getPayload();

      return {
        googleId: payload?.sub,
        email: payload?.email,
        name: payload?.name,
        picture: payload?.picture,
      };
    } catch (error) {
      console.error('Google ID token verification failed:', error);
      throw new UnauthorizedException(`Invalid Google ID token: ${error}`);
    }
  }

  async googleService(googleUser: GoogleUserDTO) {
    const { username, email, profileImg, password } = googleUser;
    let currentUser;
    const checkUser = await this.prisma.user.findFirst({
      where: { email },
    });
    currentUser = checkUser;

    const hashedPassword: string = await argon.hash(password);
    if (!checkUser) {
      currentUser = await this.prisma.user.create({
        data: {
          email,
          fullname: username,
          username: username.replace(' ', '').toLowerCase(),
          profileImg,
          password: hashedPassword,
          isVerified: true,
        },
      });

      await this.prisma.userNotification.create({
        data: {
          notificationId: 1,
          userId: currentUser.id,
          isLocalSent: false,
          isRead: false,
        },
      });

      const allCategories = await this.prisma.category.findMany();

      const interestsData = allCategories.map((category) => ({
        categoryId: category.id,
        userId: currentUser.id,
      }));

      await this.prisma.userInterests.createMany({
        data: interestsData,
        skipDuplicates: true,
      });
    }
    return {
      token: await this.jwt.signAsync(currentUser),
      data: currentUser,
    };
  }
}
