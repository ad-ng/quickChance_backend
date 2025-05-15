import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class GoogleUserDTO {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  profileImg: string;
}
