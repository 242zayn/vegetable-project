import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { VerifyQuestionDTO } from './dto/verify-question-dto';

@Injectable()
export class AuthService {
  constructor(private readonly useServices: UsersService) {}

  register(registerDTO: RegisterDTO) {
    return this.useServices.create(registerDTO);
  }

  login(loginData: LoginDTO) {
    return this.useServices.login(loginData);
  }

  get_security_question(email: string) {
    const user = this.useServices.get_sequrity_question_services(email);
    return user;
  }
  security_question_verify(dto: VerifyQuestionDTO) {
    return this.useServices.get_sequrity_question_services_verify(dto);
  }

  reset_passwrd(dto: { token: string; newPassword: string }) {
    return this.useServices.resetPassword(dto);
  }
}
