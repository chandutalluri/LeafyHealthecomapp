import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return {
      service: 'Identity & Access Service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      port: process.env.AUTH_SERVICE_PORT || 3001,
      version: '1.0.0'
    };
  }

  @Get()
  root() {
    return {
      service: 'LeafyHealth Identity & Access Service',
      message: 'Authentication service is running',
      endpoints: {
        health: '/health',
        login: '/auth/login',
        register: '/auth/register',
        profile: '/auth/profile',
        refresh: '/auth/refresh'
      }
    };
  }
}