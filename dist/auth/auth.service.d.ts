import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminAccount } from './entities/admin-account.entity';
import { LoginDto, UpdateAccountDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthService implements OnModuleInit {
    private readonly adminRepo;
    private readonly jwtService;
    private readonly cfg;
    constructor(adminRepo: Repository<AdminAccount>, jwtService: JwtService, cfg: ConfigService);
    onModuleInit(): Promise<void>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        admin: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    getAccount(adminId: string): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAccount(adminId: string, dto: UpdateAccountDto): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(adminId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
