import { OpportunityStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOppDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  oppLink: string;

  @IsOptional()
  @IsDateString()
  deadline: Date;

  @IsOptional()
  @IsEnum(OpportunityStatus)
  status: OpportunityStatus;

  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}
