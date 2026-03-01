import {
  IsString, IsEmail, IsOptional, IsEnum, IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CandidateStatus } from '../entities/candidate.entity';

export class CreateCandidateDto {
  @ApiProperty({ example: 'Rahul Kumar' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'rahul@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'Senior Associate' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiProperty({ required: false, example: '3-5 years' })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  skills?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;
}

export class UpdateCandidateStatusDto {
  @ApiProperty({ enum: CandidateStatus })
  @IsEnum(CandidateStatus)
  status: CandidateStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}

export class CandidateQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiProperty({ required: false, enum: CandidateStatus })
  @IsOptional()
  @IsEnum(CandidateStatus)
  status?: CandidateStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, example: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
