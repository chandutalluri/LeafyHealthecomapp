import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      service: 'marketplace-management',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'Service information' })
  getRoot() {
    return {
      service: 'LeafyHealth Marketplace Management Service',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        vendors: '/vendors',
        docs: '/api/docs'
      }
    };
  }

  @Get('__introspect')
  @ApiOperation({ summary: 'Service introspection' })
  @ApiResponse({ status: 200, description: 'Service capabilities and endpoints' })
  introspect() {
    return {
      service: 'marketplace-management',
      version: '1.0.0',
      capabilities: [
        'Vendor Management',
        'Vendor Verification',
        'Commission Tracking',
        'Marketplace Analytics',
        'Vendor Product Management',
        'Payout Processing'
      ],
      endpoints: [
        { path: '/vendors', method: 'GET', description: 'List all vendors' },
        { path: '/vendors', method: 'POST', description: 'Create new vendor' },
        { path: '/vendors/:id', method: 'GET', description: 'Get vendor details' },
        { path: '/vendors/:id', method: 'PATCH', description: 'Update vendor' },
        { path: '/vendors/:id', method: 'DELETE', description: 'Delete vendor' },
        { path: '/vendors/:id/verify', method: 'PATCH', description: 'Verify vendor' },
        { path: '/vendors/stats', method: 'GET', description: 'Get vendor statistics' },
        { path: '/vendors/status/:status', method: 'GET', description: 'Get vendors by status' }
      ],
      database: {
        tables: ['vendors', 'vendor_products', 'vendor_payouts'],
        relations: ['users', 'products']
      }
    };
  }
}