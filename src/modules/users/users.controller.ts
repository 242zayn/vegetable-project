import {
  Controller,
  Get,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserRole } from './schema/user.schema';
import { UsersService } from './users.service';
export interface JwtPayload {
  sub: string | number;
  email: string;
  role: UserRole;
}
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.CUSTOMER)
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    console.log('reqest ', req.user);
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return this.usersService.getMe(req.user?.email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUser();
  }
}
