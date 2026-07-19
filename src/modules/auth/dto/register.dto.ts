import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UserRole } from 'src/modules/users/schema/user.schema';

class AddressDto {
  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @Matches(/^[1-9][0-9]{5}$/)
  pincode?: string;

  @IsOptional()
  @IsString()
  landmark?: string;
}

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @Matches(/^[6-9]\d{9}$/, {
    message: 'Phone number must be a valid 10 digit Indian mobile number',
  })
  phone!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  @IsNotEmpty({
    message: 'Security Question are required',
  })
  securityQuestion!: string;

  @IsString()
  @IsNotEmpty({
    message: 'Security Answerd are required',
  })
  securityAnswers!: string;
}
