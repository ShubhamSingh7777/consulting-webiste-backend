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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const admin_account_entity_1 = require("./entities/admin-account.entity");
let AuthService = class AuthService {
    constructor(adminRepo, jwtService, cfg) {
        this.adminRepo = adminRepo;
        this.jwtService = jwtService;
        this.cfg = cfg;
    }
    async onModuleInit() {
        const count = await this.adminRepo.count();
        if (count === 0) {
            const email = this.cfg.get('ADMIN_EMAIL', 'admin@sharmaassociates.in');
            const raw = this.cfg.get('ADMIN_PASSWORD', 'Admin@2024');
            const hash = await bcrypt.hash(raw, 12);
            await this.adminRepo.save({ email, password: hash, name: 'Super Admin' });
            console.log(`\n✅ Default admin created: ${email} / ${raw}`);
            console.log('   Change password immediately after first login!\n');
        }
    }
    async login(dto) {
        const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
        if (!admin || !admin.isActive)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(dto.password, admin.password);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = this.jwtService.sign({ sub: admin.id, email: admin.email }, { expiresIn: this.cfg.get('JWT_EXPIRES_IN', '8h') });
        return {
            access_token: token,
            admin: { id: admin.id, name: admin.name, email: admin.email },
        };
    }
    async getAccount(adminId) {
        const admin = await this.adminRepo.findOne({ where: { id: adminId } });
        if (!admin)
            throw new common_1.NotFoundException('Account not found');
        const { password, ...safe } = admin;
        return safe;
    }
    async updateAccount(adminId, dto) {
        if (dto.email) {
            const existing = await this.adminRepo.findOne({ where: { email: dto.email } });
            if (existing && existing.id !== adminId)
                throw new common_1.ConflictException('Email already in use');
        }
        await this.adminRepo.update(adminId, dto);
        return this.getAccount(adminId);
    }
    async changePassword(adminId, dto) {
        const admin = await this.adminRepo.findOne({ where: { id: adminId } });
        if (!admin)
            throw new common_1.NotFoundException('Account not found');
        const ok = await bcrypt.compare(dto.currentPassword, admin.password);
        if (!ok)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        const hash = await bcrypt.hash(dto.newPassword, 12);
        await this.adminRepo.update(adminId, { password: hash });
        return { message: 'Password changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_account_entity_1.AdminAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map