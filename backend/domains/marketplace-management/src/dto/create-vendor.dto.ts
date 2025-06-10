import { IsString, IsEmail, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ description: 'Vendor business name' })
  @IsString()
  businessName: string;

  @ApiProperty({ description: 'Primary contact email' })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ description: 'Contact phone number' })
  @IsString()
  contactPhone: string;

  @ApiProperty({ description: 'Business address' })
  @IsString()
  businessAddress: string;

  @ApiProperty({ description: 'Business license number', required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ description: 'Tax identification number' })
  @IsString()
  taxId: string;

  @ApiProperty({ description: 'Business description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Business website URL', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Product categories', type: [String] })
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({ description: 'Commission rate (percentage)' })
  @IsString()
  commissionRate: string;

  @ApiProperty({ description: 'Verification status', default: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'Active status', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}