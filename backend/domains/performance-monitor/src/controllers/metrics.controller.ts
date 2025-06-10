import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { MetricsService } from '../services/metrics.service';

@ApiTags('Metrics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('system')
  @ApiOperation({ summary: 'Get system metrics' })
  @ApiResponse({ status: 200, description: 'System performance metrics' })
  async getSystemMetrics() {
    return await this.metricsService.getSystemMetrics();
  }

  @Get('database')
  @ApiOperation({ summary: 'Get database metrics' })
  @ApiResponse({ status: 200, description: 'Database performance metrics' })
  async getDatabaseMetrics() {
    return await this.metricsService.getDatabaseMetrics();
  }

  @Get('api')
  @ApiOperation({ summary: 'Get API metrics' })
  @ApiResponse({ status: 200, description: 'API performance metrics' })
  async getApiMetrics() {
    return await this.metricsService.getApiMetrics();
  }

  @Get('custom')
  @ApiOperation({ summary: 'Get custom metrics' })
  @ApiQuery({ name: 'timeRange', required: false, description: 'Time range for metrics' })
  @ApiResponse({ status: 200, description: 'Custom metrics data' })
  async getCustomMetrics(@Query('timeRange') timeRange?: string) {
    return await this.metricsService.getCustomMetrics(timeRange);
  }

  @Get('realtime')
  @ApiOperation({ summary: 'Get real-time metrics' })
  @ApiResponse({ status: 200, description: 'Real-time performance data' })
  async getRealtimeMetrics() {
    return await this.metricsService.getRealtimeMetrics();
  }
}