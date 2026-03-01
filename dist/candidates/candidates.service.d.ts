import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateDto, UpdateCandidateStatusDto, CandidateQueryDto } from './dto/candidate.dto';
export declare class CandidatesService {
    private readonly repo;
    private readonly cfg;
    constructor(repo: Repository<Candidate>, cfg: ConfigService);
    create(dto: CreateCandidateDto, file: Express.Multer.File): Promise<Candidate>;
    findAll(query: CandidateQueryDto): Promise<{
        data: Candidate[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findOne(id: string): Promise<Candidate>;
    updateStatus(id: string, dto: UpdateCandidateStatusDto): Promise<Candidate>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        total: number;
        newToday: number;
        shortlisted: number;
        hired: number;
    }>;
}
