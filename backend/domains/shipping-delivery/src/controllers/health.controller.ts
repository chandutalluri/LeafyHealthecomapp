import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { databaseConnection } from '../database';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth() {
    const dbHealth = await databaseConnection.healthCheck();
    
    return {
      status: 'ok',
      service: 'shipping-delivery-service',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      version: '1.0.0'
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'Service information' })
  getRoot() {
    return {
      service: 'LeafyHealth Shipping & Delivery Service',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        docs: '/api/docs',
        shipments: '/shipments'
      }
    };
  }

  @Get('__introspect')
  @ApiOperation({ summary: 'Service introspection' })
  @ApiResponse({ status: 200, description: 'Service introspection data' })
  getIntrospection() {
    return {
      service: 'shipping-delivery-service',
      version: '1.0.0',
      description: 'Manages shipments, tracking, and delivery logistics',
      capabilities: [
        'Shipment creation and management',
        'Package tracking and status updates',
        'Delivery route optimization',
        'Carrier integration',
        'Real-time tracking events',
        'Shipping analytics and reporting'
      ],
      endpoints: [
        'POST /shipments - Create shipment',
        'GET /shipments - List shipments',
        'GET /shipments/:id - Get shipment details',
        'GET /shipments/track/:trackingNumber - Track shipment',
        'PUT /shipments/:id/status - Update shipment status',
        'GET /shipments/stats - Get shipping statistics'
      ],
      database: {
        tables: ['shipments', 'tracking_events', 'delivery_routes', 'route_shipments', 'carriers'],
        connected: true
      }
    };
  }
}