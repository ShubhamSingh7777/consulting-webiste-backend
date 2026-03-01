import { Response } from 'express';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto, UpdateCandidateStatusDto, CandidateQueryDto } from './dto/candidate.dto';
export declare class CandidatesController {
    private readonly svc;
    constructor(svc: CandidatesService);
    upload(dto: CreateCandidateDto, file: Express.Multer.File): Promise<import("./entities/candidate.entity").Candidate>;
    findAll(query: CandidateQueryDto): Promise<{
        data: import("./entities/candidate.entity").Candidate[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getStats(): Promise<{
        total: number;
        newToday: number;
        shortlisted: number;
        hired: number;
    }>;
    findOne(id: string): Promise<import("./entities/candidate.entity").Candidate>;
    downloadResume(id: string, res: Response): Promise<void>;
    updateStatus(id: string, dto: UpdateCandidateStatusDto): Promise<import("./entities/candidate.entity").Candidate>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
