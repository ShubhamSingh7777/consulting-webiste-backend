import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum LeadStatus {
  NEW        = 'new',
  CONTACTED  = 'contacted',
  QUALIFIED  = 'qualified',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST= 'closed_lost',
}

export enum ServiceType {
  LEGAL               = 'legal',
  INSTA_ADS           = 'insta_ads',
  BUSINESS_CONSULTING = 'business_consulting',
  RECRUITMENT         = 'recruitment',
  WEBSITE             = 'website',
  SOCIAL_MEDIA        = 'social_media',
  OTHER               = 'other',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ── Core fields (all forms) ──────────────────────────
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ type: 'enum', enum: ServiceType, nullable: true })
  serviceInterest?: ServiceType;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ nullable: true })
  source?: string;                // which page submitted the form

  // ── Legal ────────────────────────────────────────────
  @Column({ nullable: true })
  practiceArea?: string;          // matter / practice area

  // ── InstAds / SocialMedia ────────────────────────────
  @Column({ nullable: true })
  platform?: string;              // Facebook, Instagram, Both etc.

  @Column({ nullable: true })
  budget?: string;                // monthly ad budget or project budget

  // ── SocialMedia ──────────────────────────────────────
  @Column({ nullable: true })
  currentFollowers?: string;      // goal field in social media form

  // ── BusinessConsulting ───────────────────────────────
  @Column({ nullable: true })
  annualRevenue?: string;

  @Column({ nullable: true })
  primaryChallenge?: string;

  // ── Recruitment ──────────────────────────────────────
  @Column({ nullable: true })
  serviceRequired?: string;       // service dropdown

  @Column({ nullable: true })
  numberOfPositions?: string;

  // ── Website ──────────────────────────────────────────
  @Column({ nullable: true })
  projectType?: string;

  // ── Status & Admin ───────────────────────────────────
  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes?: string;

  @Column({ nullable: true })
  assignedTo?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}