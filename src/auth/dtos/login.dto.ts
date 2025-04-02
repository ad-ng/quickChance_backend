import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class loginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
