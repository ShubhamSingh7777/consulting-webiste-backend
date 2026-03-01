import { ServiceType, LeadStatus } from '../entities/user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    serviceInterest?: ServiceType;
    message?: string;
    source?: string;
    practiceArea?: string;
    platform?: string;
    budget?: string;
    currentFollowers?: string;
    annualRevenue?: string;
    primaryChallenge?: string;
    serviceRequired?: string;
    numberOfPositions?: string;
    projectType?: string;
}
export declare class UpdateLeadStatusDto {
    status: LeadStatus;
    adminNotes?: string;
    assignedTo?: string;
}
export declare class UserQueryDto {
    page?: string;
    limit?: string;
    status?: LeadStatus;
    serviceInterest?: ServiceType;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
