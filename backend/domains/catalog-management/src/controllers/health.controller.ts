import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  health() {
    return {
      status: 'ok',
      service: 'catalog-management-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'Service information' })
  root() {
    return {
      service: 'LeafyHealth Catalog Management Service',
      version: '1.0.0',
      description: 'Manages products, categories, and inventory',
      endpoints: {
        health: '/health',
        products: '/products',
        categories: '/categories',
        docs: '/api/docs'
      }
    };
  }
}