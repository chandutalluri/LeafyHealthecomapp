import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { PerformanceService } from '../services/performance.service';

@ApiTags('Performance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get performance overview' })
  @ApiResponse({ status: 200, description: 'Performance overview data' })
  async getOverview() {
    return await this.performanceService.getPerformanceOverview();
  }

  @Get('services')
  @ApiOperation({ summary: 'Get all services performance' })
  @ApiResponse({ status: 200, description: 'Services performance metrics' })
  async getServicesPerformance() {
    return await this.performanceService.getServicesPerformance();
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get specific service performance' })
  @ApiParam({ name: 'serviceId', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service performance details' })
  async getServicePerformance(@Param('serviceId') serviceId: string) {
    return await this.performanceService.getServicePerformance(serviceId);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get performance alerts' })
  @ApiResponse({ status: 200, description: 'Active performance alerts' })
  async getAlerts() {
    return await this.performanceService.getPerformanceAlerts();
  }

  @Post('alerts')
  @ApiOperation({ summary: 'Create performance alert' })
  @ApiResponse({ status: 201, description: 'Alert created successfully' })
  async createAlert(@Body() alertData: any) {
    return await this.performanceService.createAlert(alertData);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get performance reports' })
  @ApiResponse({ status: 200, description: 'Performance reports' })
  async getReports() {
    return await this.performanceService.getPerformanceReports();
  }

  @Get('metrics')
  async getMetrics() {
    return {
      systemHealth: 'good',
      responseTime: '120ms',
      throughput: '1,250 req/min',
      errorRate: '0.05%',
      uptime: '99.9%',
      timestamp: new Date().toISOString()
    };
  }

  @Get('service-health')
  async getServiceHealth() {
    return {
      overallStatus: 'healthy',
      services: [
        { name: 'Auth Service', status: 'healthy', port: 3001 },
        { name: 'User Service', status: 'healthy', port: 3020 },
        { name: 'Catalog Service', status: 'healthy', port: 3003 },
        { name: 'Order Service', status: 'healthy', port: 3005 }
      ],
      lastCheck: new Date().toISOString()
    };
  }
}