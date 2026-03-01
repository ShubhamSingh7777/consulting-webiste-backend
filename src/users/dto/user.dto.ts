import {
  IsString, IsEmail, IsOptional, IsEnum, IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceType, LeadStatus } from '../entities/user.entity';

export class CreateUserDto {
  // ── Required ─────────────────────────────────────────
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  // ── Common optional ──────────────────────────────────
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  company?: string;

  @ApiProperty({ enum: ServiceType, required: false })
  @IsOptional() @IsEnum(ServiceType)
  serviceInterest?: ServiceType;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  message?: string;

  @ApiProperty({ required: false, description: 'Which page/form submitted this lead' })
  @IsOptional() @IsString()
  source?: string;

  // ── Legal ────────────────────────────────────────────
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  practiceArea?: string;

  // ── InstAds / SocialMedia ────────────────────────────
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  platform?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  budget?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  currentFollowers?: string;

  // ── BusinessConsulting ───────────────────────────────
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  annualRevenue?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  primaryChallenge?: string;

  // ── Recruitment ──────────────────────────────────────
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  serviceRequired?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  numberOfPositions?: string;

  // ── Website ──────────────────────────────────────────
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  projectType?: string;
}

// UpdateLeadStatusDto & UserQueryDto same rehte hain
export class UpdateLeadStatusDto {
  @ApiProperty({ enum: LeadStatus })
  @IsEnum(LeadStatus)
  status: LeadStatus;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  adminNotes?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  assignedTo?: string;
}

export class UserQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsNumberString()
  page?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsNumberString()
  limit?: string;

  @ApiProperty({ required: false, enum: LeadStatus }) @IsOptional() @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiProperty({ required: false, enum: ServiceType }) @IsOptional() @IsEnum(ServiceType)
  serviceInterest?: ServiceType;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  search?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  sortBy?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  sortOrder?: 'ASC' | 'DESC';
}