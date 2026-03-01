import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAccount } from '../entities/admin-account.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    cfg: ConfigService,
    @InjectRepository(AdminAccount)
    private readonly adminRepo: Repository<AdminAccount>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: cfg.get('JWT_SECRET', 'fallback_secret'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const admin = await this.adminRepo.findOne({
      where: { id: payload.sub, isActive: true },
    });
    if (!admin) throw new UnauthorizedException('Session expired. Please log in again.');
    return admin;
  }
}
