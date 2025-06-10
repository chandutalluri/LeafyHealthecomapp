import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  
  @Get()
  @ApiOperation({ summary: 'Service health check' })
  async getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'content-management-service',
      port: process.env.PORT || 3015,
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}