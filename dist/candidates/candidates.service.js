"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const candidate_entity_1 = require("./entities/candidate.entity");
let CandidatesService = class CandidatesService {
    constructor(repo, cfg) {
        this.repo = repo;
        this.cfg = cfg;
    }
    async create(dto, file) {
        if (!file)
            throw new common_1.BadRequestException('Resume file is required');
        const candidate = this.repo.create({
            ...dto,
            resumeFileName: file.originalname,
            resumePath: file.path,
            resumeMimeType: file.mimetype,
            resumeSize: file.size,
            status: candidate_entity_1.CandidateStatus.NEW,
        });
        return this.repo.save(candidate);
    }
    async findAll(query) {
        const page = parseInt(query.page ?? '1', 10);
        const limit = parseInt(query.limit ?? '10', 10);
        const skip = (page - 1) * limit;
        const sortBy = query.sortBy ?? 'createdAt';
        const sortOrder = (query.sortOrder ?? 'DESC');
        const qb = this.repo.createQueryBuilder('c');
        if (query.status)
            qb.andWhere('c.status = :status', { status: query.status });
        if (query.search) {
            qb.andWhere('(c.name ILIKE :q OR c.email ILIKE :q OR c.jobTitle ILIKE :q OR c.skills ILIKE :q)', { q: `%${query.search}%` });
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
    async findOne(id) {
        const c = await this.repo.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException(`Candidate ${id} not found`);
        return c;
    }
    async updateStatus(id, dto) {
        await this.findOne(id);
        await this.repo.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        const c = await this.findOne(id);
        if (c.resumePath && (0, fs_1.existsSync)(c.resumePath)) {
            try {
                (0, fs_1.unlinkSync)(c.resumePath);
            }
            catch { }
        }
        await this.repo.remove(c);
        return { message: `Candidate ${id} deleted` };
    }
    async getStats() {
        const total = await this.repo.count();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newToday = await this.repo.count({ where: { status: candidate_entity_1.CandidateStatus.NEW } });
        const shortlisted = await this.repo.count({ where: { status: candidate_entity_1.CandidateStatus.SHORTLISTED } });
        const hired = await this.repo.count({ where: { status: candidate_entity_1.CandidateStatus.HIRED } });
        return { total, newToday, shortlisted, hired };
    }
};
exports.CandidatesService = CandidatesService;
exports.CandidatesService = CandidatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(candidate_entity_1.Candidate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], CandidatesService);
//# sourceMappingURL=candidates.service.js.map