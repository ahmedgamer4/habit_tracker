import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ok } from 'src/utils/response.util';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse()
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return ok(
      'Logged user successfully',
      await this.authService.validateLogin(dto),
    );
  }
}
