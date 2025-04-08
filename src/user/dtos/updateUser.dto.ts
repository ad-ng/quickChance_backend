import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsDateString()
  @IsOptional()
  dob: Date;

  @IsString()
  @IsOptional()
  phoneNumber: string;
}
