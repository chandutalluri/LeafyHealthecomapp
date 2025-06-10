import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  
  @Get()
  @ApiOperation({ summary: 'Service health check' })
  async getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'employee-management-service',
      port: process.env.PORT || 3017,
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}