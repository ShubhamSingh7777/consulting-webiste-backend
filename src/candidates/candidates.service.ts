import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { Candidate, CandidateStatus } from './entities/candidate.entity';
import {
  CreateCandidateDto,
  UpdateCandidateStatusDto,
  CandidateQueryDto,
} from './dto/candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly repo: Repository<Candidate>,
    private readonly cfg: ConfigService,
  ) {}

  // ── Create (called from frontend resume upload form) ──
  async create(dto: CreateCandidateDto, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Resume file is required');

    const candidate = this.repo.create({
      ...dto,
      resumeFileName: file.originalname,
      resumePath: file.path,
      resumeMimeType: file.mimetype,
      resumeSize: file.size,
      status: CandidateStatus.NEW,
    });

    return this.repo.save(candidate);
  }

  // ── List with pagination + filters ───────────────────
  async findAll(query: CandidateQueryDto) {
    const page      = parseInt(query.page  ?? '1',  10);
    const limit     = parseInt(query.limit ?? '10', 10);
    const skip      = (page - 1) * limit;
    const sortBy    = query.sortBy    ?? 'createdAt';
    const sortOrder = (query.sortOrder ?? 'DESC') as 'ASC' | 'DESC';

    const qb = this.repo.createQueryBuilder('c');

    if (query.status) qb.andWhere('c.status = :status', { status: query.status });

    if (query.search) {
      qb.andWhere(
        '(c.name ILIKE :q OR c.email ILIKE :q OR c.jobTitle ILIKE :q OR c.skills ILIKE :q)',
        { q: `%${query.search}%` },
      );
    }

    qb.orderBy(`c.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // ── Get single candidate ──────────────────────────────
  async findOne(id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Candidate ${id} not found`);
    return c;
  }

  // ── Update status + notes (admin action) ─────────────
  async updateStatus(id: string, dto: UpdateCandidateStatusDto) {
    await this.findOne(id); // throws 404 if not found
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  // ── Delete candidate + remove file ───────────────────
  async remove(id: string) {
    const c = await this.findOne(id);

    // Delete the actual resume file from disk
    if (c.resumePath && existsSync(c.resumePath)) {
      try { unlinkSync(c.resumePath); } catch {}
    }

    await this.repo.remove(c);
    return { message: `Candidate ${id} deleted` };
  }

  // ── Stats for dashboard ───────────────────────────────
  async getStats() {
    const total       = await this.repo.count();
    const today       = new Date(); today.setHours(0, 0, 0, 0);
    const newToday    = await this.repo.count({ where: { status: CandidateStatus.NEW } });
    const shortlisted = await this.repo.count({ where: { status: CandidateStatus.SHORTLISTED } });
    const hired       = await this.repo.count({ where: { status: CandidateStatus.HIRED } });

    return { total, newToday, shortlisted, hired };
  }
}
