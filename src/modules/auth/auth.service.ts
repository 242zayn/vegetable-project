import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly useServices: UsersService) {}

  register(registerDTO: RegisterDTO) {
    return this.useServices.create(registerDTO);
  }

  login(loginData: LoginDTO) {
    return this.useServices.login(loginData);
  }
}
