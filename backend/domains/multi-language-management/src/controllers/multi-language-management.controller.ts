import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MultiLanguageManagementService } from '../services/multi-language-management.service';
import { 
  CreateLanguageDto, 
  UpdateLanguageDto, 
  CreateTranslationDto,
  UpdateTranslationDto,
  BulkTranslationDto,
  LanguageResponseDto,
  TranslationResponseDto
} from '../dto/multi-language-management.dto';

@ApiTags('Multi-Language Management')
@Controller('multi-language-management')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MultiLanguageManagementController {
  constructor(private readonly multiLanguageManagementService: MultiLanguageManagementService) {}

  // Language Management Endpoints
  @Get('languages')
  @ApiOperation({ summary: 'Get all supported languages' })
  @ApiQuery({ name: 'region', required: false, description: 'Filter by region (e.g., North India)' })
  @ApiQuery({ name: 'active', required: false, description: 'Filter by active status' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records to return' })
  @ApiQuery({ name: 'offset', required: false, description: 'Number of records to skip' })
  @ApiResponse({ status: 200, description: 'Languages retrieved successfully', type: [LanguageResponseDto] })
  async getLanguages(@Query() query: any) {
    return this.multiLanguageManagementService.findAllLanguages(query);
  }

  @Post('languages')
  @ApiOperation({ summary: 'Add new language support' })
  @ApiResponse({ status: 201, description: 'Language added successfully', type: LanguageResponseDto })
  @ApiResponse({ status: 409, description: 'Language code already exists' })
  async addLanguage(@Body() createDto: CreateLanguageDto) {
    return this.multiLanguageManagementService.createLanguage(createDto);
  }

  @Get('languages/:code')
  @ApiOperation({ summary: 'Get language by code' })
  @ApiParam({ name: 'code', description: 'Language code (e.g., hi, ta, bn)' })
  @ApiResponse({ status: 200, description: 'Language found', type: LanguageResponseDto })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async getLanguageByCode(@Param('code') code: string) {
    const language = await this.multiLanguageManagementService.findLanguageByCode(code);
    if (!language) {
      throw new Error(`Language with code '${code}' not found`);
    }
    return language;
  }

  @Put('languages/:code')
  @ApiOperation({ summary: 'Update language settings' })
  @ApiParam({ name: 'code', description: 'Language code' })
  @ApiResponse({ status: 200, description: 'Language updated successfully', type: LanguageResponseDto })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async updateLanguage(@Param('code') code: string, @Body() updateDto: UpdateLanguageDto) {
    return this.multiLanguageManagementService.updateLanguage(code, updateDto);
  }

  @Delete('languages/:code')
  @ApiOperation({ summary: 'Delete language' })
  @ApiParam({ name: 'code', description: 'Language code' })
  @ApiResponse({ status: 200, description: 'Language deleted successfully' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete default language' })
  async deleteLanguage(@Param('code') code: string) {
    return this.multiLanguageManagementService.deleteLanguage(code);
  }

  // Translation Management Endpoints
  @Get('translations/:languageCode')
  @ApiOperation({ summary: 'Get all translations for a language' })
  @ApiParam({ name: 'languageCode', description: 'Language code' })
  @ApiQuery({ name: 'context', required: false, description: 'Filter by context (product, category, ui, etc.)' })
  @ApiResponse({ status: 200, description: 'Translations retrieved successfully' })
  async getTranslations(
    @Param('languageCode') languageCode: string,
    @Query('context') context?: string
  ) {
    return this.multiLanguageManagementService.getTranslations(languageCode, context);
  }

  @Post('translations')
  @ApiOperation({ summary: 'Add new translation' })
  @ApiResponse({ status: 201, description: 'Translation added successfully', type: TranslationResponseDto })
  @ApiResponse({ status: 409, description: 'Translation already exists' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async addTranslation(@Body() createDto: CreateTranslationDto) {
    return this.multiLanguageManagementService.createTranslation(createDto);
  }

  @Put('translations/:id')
  @ApiOperation({ summary: 'Update translation' })
  @ApiParam({ name: 'id', description: 'Translation ID' })
  @ApiResponse({ status: 200, description: 'Translation updated successfully', type: TranslationResponseDto })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  async updateTranslation(@Param('id') id: string, @Body() updateDto: UpdateTranslationDto) {
    return this.multiLanguageManagementService.updateTranslation(id, updateDto);
  }

  @Post('translations/bulk')
  @ApiOperation({ summary: 'Bulk add translations for a language' })
  @ApiResponse({ status: 201, description: 'Bulk translations processed' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async bulkAddTranslations(@Body() bulkDto: BulkTranslationDto) {
    return this.multiLanguageManagementService.bulkCreateTranslations(bulkDto);
  }

  @Get('translations/:languageCode/search')
  @ApiOperation({ summary: 'Search translations in a language' })
  @ApiParam({ name: 'languageCode', description: 'Language code' })
  @ApiQuery({ name: 'q', description: 'Search term' })
  @ApiQuery({ name: 'context', required: false, description: 'Filter by context' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchTranslations(
    @Param('languageCode') languageCode: string,
    @Query('q') searchTerm: string,
    @Query('context') context?: string
  ) {
    return this.multiLanguageManagementService.searchTranslations(languageCode, searchTerm, context);
  }

  @Patch('translations/:id/approve')
  @ApiOperation({ summary: 'Approve translation' })
  @ApiParam({ name: 'id', description: 'Translation ID' })
  @ApiResponse({ status: 200, description: 'Translation approved successfully', type: TranslationResponseDto })
  @ApiResponse({ status: 404, description: 'Translation not found' })
  async approveTranslation(
    @Param('id') id: string, 
    @Body('approvedBy') approvedBy: string
  ) {
    return this.multiLanguageManagementService.approveTranslation(id, approvedBy);
  }

  // Statistics and Management Endpoints
  @Get('stats')
  @ApiOperation({ summary: 'Get translation statistics by language' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getLanguageStats() {
    return this.multiLanguageManagementService.getLanguageStats();
  }

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize default Indian languages' })
  @ApiResponse({ status: 200, description: 'Default languages initialized successfully' })
  async initializeDefaults() {
    return this.multiLanguageManagementService.initializeDefaultLanguages();
  }

  // Legacy endpoints for backward compatibility
  @Get()
  @ApiOperation({ summary: 'Get all languages (legacy endpoint)' })
  @ApiResponse({ status: 200, description: 'Languages retrieved successfully' })
  async findAll(@Query() query: any) {
    return this.multiLanguageManagementService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get language by ID (legacy endpoint)' })
  @ApiResponse({ status: 200, description: 'Language found' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async findOne(@Param('id') id: string) {
    return this.multiLanguageManagementService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new language (legacy endpoint)' })
  @ApiResponse({ status: 201, description: 'Language created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createDto: CreateLanguageDto) {
    return this.multiLanguageManagementService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update language (legacy endpoint)' })
  @ApiResponse({ status: 200, description: 'Language updated successfully' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateLanguageDto) {
    return this.multiLanguageManagementService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete language (legacy endpoint)' })
  @ApiResponse({ status: 200, description: 'Language deleted successfully' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async remove(@Param('id') id: string) {
    return this.multiLanguageManagementService.remove(id);
  }
}