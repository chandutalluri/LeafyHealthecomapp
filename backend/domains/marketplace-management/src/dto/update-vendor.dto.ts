import { IsString, IsEmail, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVendorDto {
  @ApiProperty({ description: 'Vendor business name', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ description: 'Primary contact email', required: false })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({ description: 'Contact phone number', required: false })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ description: 'Business address', required: false })
  @IsOptional()
  @IsString()
  businessAddress?: string;

  @ApiProperty({ description: 'Business license number', required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ description: 'Tax identification number', required: false })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({ description: 'Business description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Business website URL', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Product categories', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ description: 'Commission rate (percentage)', required: false })
  @IsOptional()
  @IsString()
  commissionRate?: string;

  @ApiProperty({ description: 'Verification status', required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'Active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}