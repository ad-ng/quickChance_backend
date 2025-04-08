import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  location: string;

  @IsDateString()
  dob: Date;

  @IsString()
  phoneNumber: string;
}
