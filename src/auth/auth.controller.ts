import {
  Controller, Post, Get, Patch, Body,
  UseGuards, Request, HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, UpdateAccountDto, ChangePasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth / Account')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/login
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin login — returns JWT token' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // GET /api/auth/account
  @Get('account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin account details' })
  getAccount(@Request() req) {
    return this.authService.getAccount(req.user.id);
  }

  // PATCH /api/auth/account
  @Patch('account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update name or email' })
  updateAccount(@Request() req, @Body() dto: UpdateAccountDto) {
    return this.authService.updateAccount(req.user.id, dto);
  }

  // PATCH /api/auth/change-password
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change admin password' })
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }
}
