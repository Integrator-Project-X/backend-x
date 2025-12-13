import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';

import { Public } from './decorators/public.deco';
import { Auth } from './decorators/auth.deco';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';

import { ApiOkWrapped } from 'src/swagger/decorators/api-wrapped-res.deco';
import { ApiErrorResponseDto } from '../swagger/dto/api-error-res.dto';
import { ApiCreatedWrapped } from 'src/swagger/decorators/api-created-wrapped.deco';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login', description: 'Public Route: generate JWT.' })
  @ApiOkWrapped(LoginResponseDto, 'JWT + user payload')
  @ApiBadRequestResponse({ type: ApiErrorResponseDto, description: 'Validation failed' })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Auth({ roles: ['admin'] })
  @Post('register')
  @ApiOperation({
    summary: 'Register (Access)',
    description: 'Create credentials in Access for existing users. Admin role required.',
  })
  @ApiCreatedWrapped(LoginResponseDto, 'Access created + JWT + user payload')
  @ApiBadRequestResponse({ type: ApiErrorResponseDto, description: 'Validation failed / Email in use / User or Role not found' })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto, description: 'Unauthorized' })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto, description: 'Forbidden (requires admin)' })
  @ApiConflictResponse({ type: ApiErrorResponseDto, description: 'Unique constraint violation (race condition)' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}