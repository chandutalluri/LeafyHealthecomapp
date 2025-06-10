import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Category description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Parent category ID', required: false })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ description: 'Sort order', required: false })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiProperty({ description: 'Category image URL', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Is category active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}