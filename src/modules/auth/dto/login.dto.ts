import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty({
    message: 'Email are required',
  })
  @IsEmail()
  email!: string;

  @IsNotEmpty({
    message: 'Password are required',
  })
  @IsString()
  password!: string;
}
