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

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.CUSTOMER)
  // @Get('me')
  // getProfile(@Request() req) {
  //   // return req.user;
  //   return ' hwllow';
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  // @Get('admin-only')
  // getAdminData(@Request() req) {
  //   return {
  //     message: 'Welcome Admin!',
  //     user: req.user,
  //   };
  // }
}
