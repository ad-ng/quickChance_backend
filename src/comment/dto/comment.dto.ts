import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentDTO {
  @IsNotEmpty()
  @IsNumber()
  oppId: number;

  @IsNotEmpty()
  @IsString()
  body: string;
}
