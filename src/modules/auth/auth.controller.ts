import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly useServices: UsersService,
  ) {}

  @Post('/register')
  create(@Body() registerData: RegisterDTO) {
    return this.authService.register(registerData);
  }

  @Post('login')
  login(@Body() loginData: LoginDTO) {
    return this.authService.login(loginData);
  }
}
