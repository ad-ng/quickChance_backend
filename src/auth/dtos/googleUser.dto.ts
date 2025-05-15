import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class GoogleUserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  profileImg: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
