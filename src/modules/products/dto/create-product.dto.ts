import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  slug!: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  imageUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  displayOrder?: number;

  @IsNotEmpty()
  @IsBoolean()
  isActive?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  categoryIds!: string[];
}
