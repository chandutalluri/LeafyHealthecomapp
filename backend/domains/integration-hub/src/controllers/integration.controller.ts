import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { IntegrationService } from '../services/integration.service';

@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('integrations')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get('available')
  @ApiOperation({ summary: 'Get all available third-party integrations' })
  @ApiResponse({ status: 200, description: 'Returns list of available integrations' })
  async getAvailableIntegrations() {
    return this.integrationService.getAvailableIntegrations();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get integration status and health metrics' })
  @ApiResponse({ status: 200, description: 'Returns integration health status' })
  async getIntegrationStatus() {
    return this.integrationService.getIntegrationStatus();
  }

  @Get('webhooks')
  @ApiOperation({ summary: 'Get webhook management and statistics' })
  @ApiResponse({ status: 200, description: 'Returns webhook configuration and stats' })
  async getWebhookManagement() {
    return this.integrationService.getWebhookManagement();
  }

  @Get('api-keys')
  @ApiOperation({ summary: 'Get API key management and security info' })
  @ApiResponse({ status: 200, description: 'Returns API key management data' })
  async getAPIKeyManagement() {
    return this.integrationService.getAPIKeyManagement();
  }

  @Get('sync-status')
  @ApiOperation({ summary: 'Get data synchronization status' })
  @ApiResponse({ status: 200, description: 'Returns data sync job status' })
  async getDataSyncStatus() {
    return this.integrationService.getDataSyncStatus();
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get external API call logs and analytics' })
  @ApiResponse({ status: 200, description: 'Returns API call logs and statistics' })
  async getExternalAPILogs() {
    return this.integrationService.getExternalAPILogs();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create new third-party integration' })
  @ApiResponse({ status: 201, description: 'Integration created successfully' })
  async createIntegration(@Body() integrationData: any) {
    return this.integrationService.createIntegration(integrationData);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test integration connectivity and authentication' })
  @ApiResponse({ status: 200, description: 'Returns integration test results' })
  async testIntegration(@Param('id') integrationId: string) {
    return this.integrationService.testIntegration(integrationId);
  }
}