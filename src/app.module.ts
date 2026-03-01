import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CandidatesModule } from './candidates/candidates.module';
import { UsersModule } from './users/users.module';
import { AdminAccount } from './auth/entities/admin-account.entity';
import { Candidate } from './candidates/entities/candidate.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    // Config — reads .env
    ConfigModule.forRoot({ isGlobal: true }),

    // PostgreSQL via TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
     useFactory: (cfg: ConfigService) => ({
  type: 'postgres',
  host: cfg.get('DB_HOST', 'localhost'),
  port: parseInt(cfg.get('DB_PORT', '5432'), 10),
  username: cfg.get('DB_USERNAME', 'postgres'),
  password: cfg.get('DB_PASSWORD', ''),
  database: cfg.get('DB_NAME', 'sharma_admin'),
  entities: [AdminAccount, Candidate, User],
  synchronize: true,
  logging: cfg.get('NODE_ENV') === 'development',
  ssl: cfg.get('NODE_ENV') === 'production'
    ? { rejectUnauthorized: false }
    : false,
}),
    }),

    // Rate limiting — 100 req/min per IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Feature modules
    AuthModule,
    CandidatesModule,
    UsersModule,
  ],
})
export class AppModule {}
