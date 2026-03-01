import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, LeadStatus, ServiceType } from './entities/user.entity';
import { CreateUserDto, UpdateLeadStatusDto, UserQueryDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // ── Create (from public contact forms) ───────────────
  async create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  // ── List with pagination + filters ───────────────────
  async findAll(query: UserQueryDto) {
    const page      = parseInt(query.page  ?? '1',  10);
    const limit     = parseInt(query.limit ?? '10', 10);
    const skip      = (page - 1) * limit;
    const sortBy    = query.sortBy    ?? 'createdAt';
    const sortOrder = (query.sortOrder ?? 'DESC') as 'ASC' | 'DESC';

    const qb = this.repo.createQueryBuilder('u');

    if (query.status)          qb.andWhere('u.status = :s', { s: query.status });
    if (query.serviceInterest) qb.andWhere('u.serviceInterest = :si', { si: query.serviceInterest });

    if (query.search) {
      qb.andWhere(
        '(u.name ILIKE :q OR u.email ILIKE :q OR u.company ILIKE :q OR u.phone ILIKE :q)',
        { q: `%${query.search}%` },
      );
    }

    qb.orderBy(`u.${sortBy}`, sortOrder).skip(skip).take(limit);

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

  async findOne(id: string) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException(`User ${id} not found`);
    return u;
  }

  async updateStatus(id: string, dto: UpdateLeadStatusDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const u = await this.findOne(id);
    await this.repo.remove(u);
    return { message: `User ${id} deleted` };
  }

  // ── Dashboard stats ───────────────────────────────────
  async getStats() {
    const total     = await this.repo.count();
    const newLeads  = await this.repo.count({ where: { status: LeadStatus.NEW } });
    const contacted = await this.repo.count({ where: { status: LeadStatus.CONTACTED } });
    const closedWon = await this.repo.count({ where: { status: LeadStatus.CLOSED_WON } });

    // Breakdown by service
    const byService = await this.repo
      .createQueryBuilder('u')
      .select('u.serviceInterest', 'service')
      .addSelect('COUNT(*)', 'count')
      .groupBy('u.serviceInterest')
      .getRawMany();

    return { total, newLeads, contacted, closedWon, byService };
  }
}
