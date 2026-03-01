import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

export enum CandidateStatus {
  NEW       = 'new',
  REVIEWING = 'reviewing',
  SHORTLISTED = 'shortlisted',
  REJECTED  = 'rejected',
  HIRED     = 'hired',
}

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @Index()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  jobTitle: string;             // "Position applying for"

  @Column({ nullable: true })
  experience: string;           // "3-5 years"

  @Column({ nullable: true })
  skills: string;               // comma-separated or free text

  @Column({ nullable: true })
  linkedinUrl: string;

  // Resume file
  @Column()
  resumeFileName: string;       // original name

  @Column()
  resumePath: string;           // stored path e.g. uploads/resumes/uuid.pdf

  @Column({ nullable: true })
  resumeMimeType: string;

  @Column({ nullable: true, type: 'int' })
  resumeSize: number;           // bytes

  // Admin fields
  @Column({
    type: 'enum',
    enum: CandidateStatus,
    default: CandidateStatus.NEW,
  })
  status: CandidateStatus;

  @Column({ nullable: true, type: 'text' })
  adminNotes: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
