import { IsEmail, IsString } from 'class-validator';

export class VerifyQuestionDTO {
  @IsEmail()
  email!: string;

  @IsString()
  securityAnswer!: string;
}
