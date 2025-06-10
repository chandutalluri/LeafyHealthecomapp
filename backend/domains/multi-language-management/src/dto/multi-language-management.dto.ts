import { IsString, IsOptional, IsBoolean, IsEnum, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum LanguageDirection {
  LTR = 'ltr',
  RTL = 'rtl'
}

export enum TranslationContext {
  PRODUCT = 'product',
  CATEGORY = 'category',
  UI = 'ui',
  DESCRIPTION = 'description',
  NAVIGATION = 'navigation',
  CHECKOUT = 'checkout',
  SEARCH = 'search',
  NOTIFICATIONS = 'notifications'
}

export class CreateLanguageDto {
  @ApiProperty({ description: 'Language code (ISO 639-1)', example: 'hi' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Language name in English', example: 'Hindi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Language name in native script', example: 'हिंदी' })
  @IsString()
  @IsNotEmpty()
  nativeName: string;

  @ApiProperty({ description: 'Text direction', enum: LanguageDirection })
  @IsEnum(LanguageDirection)
  @IsOptional()
  direction?: LanguageDirection = LanguageDirection.LTR;

  @ApiProperty({ description: 'Regional classification', example: 'North India' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ description: 'Whether language is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ description: 'Whether this is the default language' })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean = false;
}

export class CreateTranslationDto {
  @ApiProperty({ description: 'Translation key', example: 'product.rice.basmati' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Language code', example: 'hi' })
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @ApiProperty({ description: 'Translated text', example: 'बासमती चावल' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Context category', enum: TranslationContext })
  @IsEnum(TranslationContext)
  @IsOptional()
  context?: TranslationContext;

  @ApiProperty({ description: 'Translator name', required: false })
  @IsString()
  @IsOptional()
  translatedBy?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: any;
}

export class BulkTranslationDto {
  @ApiProperty({ description: 'Language code for bulk operations' })
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @ApiProperty({ description: 'Array of translations' })
  @IsArray()
  translations: Array<{
    key: string;
    value: string;
    context?: string;
  }>;
}

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {}
export class UpdateTranslationDto extends PartialType(CreateTranslationDto) {}

export class LanguageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nativeName: string;

  @ApiProperty()
  direction: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class TranslationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  languageCode: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  context: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  translatedBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}