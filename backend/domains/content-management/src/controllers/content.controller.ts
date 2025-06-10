import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { ContentService } from '../services/content.service';
import { CreateContentDto } from '../dto/create-content.dto';
import { UpdateContentDto } from '../dto/update-content.dto';

@ApiTags('Content')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  async createContent(@Body() createContentDto: CreateContentDto) {
    return await this.contentService.createContent(createContentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all content' })
  @ApiResponse({ status: 200, description: 'List of all content' })
  async getAllContent() {
    return await this.contentService.getAllContent();
  }

  @Get('media')
  @ApiOperation({ summary: 'Get media files' })
  @ApiResponse({ status: 200, description: 'List of media files' })
  async getMediaFiles() {
    return await this.contentService.getMediaFiles();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get content statistics' })
  @ApiResponse({ status: 200, description: 'Content statistics' })
  async getContentStats() {
    return await this.contentService.getContentStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Content details' })
  async getContentById(@Param('id') id: string) {
    return await this.contentService.getContentById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Content updated successfully' })
  async updateContent(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return await this.contentService.updateContent(+id, updateContentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Content deleted successfully' })
  async deleteContent(@Param('id') id: string) {
    return await this.contentService.deleteContent(+id);
  }
}