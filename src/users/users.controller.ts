import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, HttpCode, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateLeadStatusDto, UserQueryDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users / Leads')
@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  // ── PUBLIC: Contact form submission (from website) ──
  @Post()
  @ApiOperation({ summary: 'Public — Submit contact form (from any website page)' })
  create(@Body() dto: CreateUserDto) {
    return this.svc.create(dto);
  }

  // ── ADMIN: List all users/leads ──────────────────────
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin — List all leads with pagination & filters' })
  findAll(@Query() query: UserQueryDto) {
    return this.svc.findAll(query);
  }

  // ── ADMIN: Stats ─────────────────────────────────────
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin — Lead stats for dashboard' })
  getStats() {
    return this.svc.getStats();
  }

  // ── ADMIN: Single user ───────────────────────────────
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin — Get lead by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.findOne(id);
  }

  // ── ADMIN: Update status ─────────────────────────────
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin — Update lead status / notes / assignment' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.svc.updateStatus(id, dto);
  }

  // ── ADMIN: Delete ────────────────────────────────────
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin — Delete a lead' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.remove(id);
  }
}
