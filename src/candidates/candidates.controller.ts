import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, UseInterceptors, UploadedFile,
  ParseUUIDPipe, Res, HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';
import {
  ApiBearerAuth, ApiTags, ApiOperation,
  ApiConsumes, ApiBody,
} from '@nestjs/swagger';
import { CandidatesService } from './candidates.service';
import {
  CreateCandidateDto,
  UpdateCandidateStatusDto,
  CandidateQueryDto,
} from './dto/candidate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const resumeStorage = diskStorage({
  destination: './uploads/resumes',
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${uuid()}-${safe}`);
  },
});

const allowedMimes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

@ApiTags('Candidates')
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly svc: CandidatesService) {}

  // ── PUBLIC: Resume upload (from your website form) ──
  @Post('upload')
  @ApiOperation({ summary: 'Public — Upload resume (from website form)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Candidate form + resume file' })
  @UseInterceptors(FileInterceptor('resume', {
    storage: resumeStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
      if (allowedMimes.includes(file.mimetype)) cb(null, true);
      else cb(new Error('Only PDF and Word documents are accepted'), false);
    },
  }))
  upload(
    @Body() dto: CreateCandidateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file ,'filefilefile')
    return this.svc.create(dto, file);
  }

  // ── ADMIN: List all candidates ───────────────────────
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin — List candidates with pagination & filters' })
  findAll(@Query() query: CandidateQueryDto) {
    return this.svc.findAll(query);
  }

  // ── ADMIN: Stats for dashboard ───────────────────────
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin — Candidate stats for dashboard' })
  getStats() {
    return this.svc.getStats();
  }

  // ── ADMIN: Get single candidate ──────────────────────
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin — Get candidate by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.findOne(id);
  }

  // ── ADMIN: Download resume ───────────────────────────
  @Get(':id/resume')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin — Download candidate resume file' })
  async downloadResume(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const c = await this.svc.findOne(id);
    res.download(join(process.cwd(), c.resumePath), c.resumeFileName);
  }

  // ── ADMIN: Update status ─────────────────────────────
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin — Update candidate status + notes' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCandidateStatusDto,
  ) {
    return this.svc.updateStatus(id, dto);
  }

  // ── ADMIN: Delete candidate ──────────────────────────
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin — Delete candidate and their resume' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.remove(id);
  }
}
