import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { Candidate } from './entities/candidate.entity';

// Ensure upload dirs exist
mkdirSync('./uploads/resumes', { recursive: true });

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate]),
    MulterModule.register({ dest: './uploads/resumes' }),
  ],
  controllers: [CandidatesController],
  providers: [CandidatesService],
  exports: [CandidatesService],
})
export class CandidatesModule {}
