import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  description!: string;

  @IsString()
  imageUrl!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
