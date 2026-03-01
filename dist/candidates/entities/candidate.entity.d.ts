export declare enum CandidateStatus {
    NEW = "new",
    REVIEWING = "reviewing",
    SHORTLISTED = "shortlisted",
    REJECTED = "rejected",
    HIRED = "hired"
}
export declare class Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    experience: string;
    skills: string;
    linkedinUrl: string;
    resumeFileName: string;
    resumePath: string;
    resumeMimeType: string;
    resumeSize: number;
    status: CandidateStatus;
    adminNotes: string;
    createdAt: Date;
    updatedAt: Date;
}
