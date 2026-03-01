import { CandidateStatus } from '../entities/candidate.entity';
export declare class CreateCandidateDto {
    name: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    experience?: string;
    skills?: string;
    linkedinUrl?: string;
}
export declare class UpdateCandidateStatusDto {
    status: CandidateStatus;
    adminNotes?: string;
}
export declare class CandidateQueryDto {
    page?: string;
    limit?: string;
    status?: CandidateStatus;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
