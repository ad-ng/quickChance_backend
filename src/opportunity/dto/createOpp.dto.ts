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

  @IsOptional()
  @IsDateString()
  deadline: Date;

  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @IsNotEmpty()
  @IsEnum(OpportunityStatus, {
    message: 'status can only be active, expired or closed',
  })
  status: OpportunityStatus;
}
