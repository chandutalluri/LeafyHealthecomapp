import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Product description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Product SKU (Stock Keeping Unit)' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ description: 'Product barcode', required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ description: 'Category ID', required: false })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ description: 'Product price' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ description: 'Cost price', required: false })
  @IsString()
  @IsOptional()
  costPrice?: string;

  @ApiProperty({ description: 'Product weight', required: false })
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiProperty({ description: 'Unit of measurement', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ description: 'Stock quantity', required: false })
  @IsNumber()
  @IsOptional()
  stockQuantity?: number;

  @ApiProperty({ description: 'Minimum stock level', required: false })
  @IsNumber()
  @IsOptional()
  minStockLevel?: number;

  @ApiProperty({ description: 'Maximum stock level', required: false })
  @IsNumber()
  @IsOptional()
  maxStockLevel?: number;

  @ApiProperty({ description: 'Product tags', required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Product images', required: false })
  @IsArray()
  @IsOptional()
  images?: string[];
}