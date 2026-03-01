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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const user = this.repo.create(dto);
        return this.repo.save(user);
    }
    async findAll(query) {
        const page = parseInt(query.page ?? '1', 10);
        const limit = parseInt(query.limit ?? '10', 10);
        const skip = (page - 1) * limit;
        const sortBy = query.sortBy ?? 'createdAt';
        const sortOrder = (query.sortOrder ?? 'DESC');
        const qb = this.repo.createQueryBuilder('u');
        if (query.status)
            qb.andWhere('u.status = :s', { s: query.status });
        if (query.serviceInterest)
            qb.andWhere('u.serviceInterest = :si', { si: query.serviceInterest });
        if (query.search) {
            qb.andWhere('(u.name ILIKE :q OR u.email ILIKE :q OR u.company ILIKE :q OR u.phone ILIKE :q)', { q: `%${query.search}%` });
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
    async findOne(id) {
        const u = await this.repo.findOne({ where: { id } });
        if (!u)
            throw new common_1.NotFoundException(`User ${id} not found`);
        return u;
    }
    async updateStatus(id, dto) {
        await this.findOne(id);
        await this.repo.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        const u = await this.findOne(id);
        await this.repo.remove(u);
        return { message: `User ${id} deleted` };
    }
    async getStats() {
        const total = await this.repo.count();
        const newLeads = await this.repo.count({ where: { status: user_entity_1.LeadStatus.NEW } });
        const contacted = await this.repo.count({ where: { status: user_entity_1.LeadStatus.CONTACTED } });
        const closedWon = await this.repo.count({ where: { status: user_entity_1.LeadStatus.CLOSED_WON } });
        const byService = await this.repo
            .createQueryBuilder('u')
            .select('u.serviceInterest', 'service')
            .addSelect('COUNT(*)', 'count')
            .groupBy('u.serviceInterest')
            .getRawMany();
        return { total, newLeads, contacted, closedWon, byService };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map