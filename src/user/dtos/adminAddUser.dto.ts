/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { RoleStatus } from '@prisma/client';

export class AdminAddUserDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().replace(/\s+/g, ''))
  username: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsEmpty()
  gender: string;

  @IsString()
  @IsEnum(RoleStatus)
  role: RoleStatus;
}
