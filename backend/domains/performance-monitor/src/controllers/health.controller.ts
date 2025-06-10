import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  
  @Get()
  async getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Performance Monitor Service',
      port: process.env.PORT || 3014,
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
  }
}