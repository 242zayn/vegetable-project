import {
  Body,
  Controller,
  Headers,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { VerifyQuestionDTO } from './dto/verify-question-dto';

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
    console.log(loginData);
    return this.authService.login(loginData);
  }
  @Post('get-security-question')
  getSecurityQuestion(@Body() data: { email: string }) {
    return this.authService.get_security_question(data.email);
  }

  @Patch('get-security-question-verify')
  getSecurityQuestionVerify(@Body() dto: VerifyQuestionDTO) {
    console.log('DATA', dto);
    return this.authService.security_question_verify(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reset-password')
  resetPassword(
    @Req() req: Request,
    @Headers('authorization') authorization: string,
    @Body() dto: { newPassword: string },
  ) {
    console.log('respnce ', req.headers.authorization?.split(' ')[1]);
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid authorization header');
    }
    return this.authService.reset_passwrd({
      newPassword: dto.newPassword,
      token,
    });
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
