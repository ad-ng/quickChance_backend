/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase().replace(/\s+/g, ''))
  username: string;

  @IsString()
  @IsOptional()
  fullname: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase().replace(/\s+/g, ''))
  location: string;

  @IsDateString()
  @IsOptional()
  dob: Date;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  gender: string;
}
