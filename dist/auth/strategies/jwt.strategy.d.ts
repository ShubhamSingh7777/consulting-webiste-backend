import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AdminAccount } from '../entities/admin-account.entity';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly adminRepo;
    constructor(cfg: ConfigService, adminRepo: Repository<AdminAccount>);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<AdminAccount>;
}
export {};
