import {
  Injectable, UnauthorizedException,
  ConflictException, NotFoundException, OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AdminAccount } from './entities/admin-account.entity';
import { LoginDto, UpdateAccountDto, ChangePasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminAccount)
    private readonly adminRepo: Repository<AdminAccount>,
    private readonly jwtService: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  // ── Seed first admin on startup ──────────────────────
  async onModuleInit() {
    const count = await this.adminRepo.count();
    if (count === 0) {
      const email = this.cfg.get('ADMIN_EMAIL', 'admin@sharmaassociates.in');
      const raw   = this.cfg.get('ADMIN_PASSWORD', 'Admin@2024');
      const hash  = await bcrypt.hash(raw, 12);
      await this.adminRepo.save({ email, password: hash, name: 'Super Admin' });
      console.log(`\n✅ Default admin created: ${email} / ${raw}`);
      console.log('   Change password immediately after first login!\n');
    }
  }

  // ── Login ─────────────────────────────────────────────
  async login(dto: LoginDto) {
    const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (!admin || !admin.isActive)
      throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, admin.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign(
      { sub: admin.id, email: admin.email },
      { expiresIn: this.cfg.get('JWT_EXPIRES_IN', '8h') },
    );

    return {
      access_token: token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    };
  }

  // ── Get current account ───────────────────────────────
  async getAccount(adminId: string) {
    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Account not found');
    const { password, ...safe } = admin;
    return safe;
  }

  // ── Update name / email ───────────────────────────────
  async updateAccount(adminId: string, dto: UpdateAccountDto) {
    if (dto.email) {
      const existing = await this.adminRepo.findOne({ where: { email: dto.email } });
      if (existing && existing.id !== adminId)
        throw new ConflictException('Email already in use');
    }
    await this.adminRepo.update(adminId, dto);
    return this.getAccount(adminId);
  }

  // ── Change password ───────────────────────────────────
  async changePassword(adminId: string, dto: ChangePasswordDto) {
    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Account not found');

    const ok = await bcrypt.compare(dto.currentPassword, admin.password);
    if (!ok) throw new UnauthorizedException('Current password is incorrect');

    const hash = await bcrypt.hash(dto.newPassword, 12);
    await this.adminRepo.update(adminId, { password: hash });
    return { message: 'Password changed successfully' };
  }
}
