import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      service: 'Integration Hub Service',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      features: [
        'Third-party API Management',
        'Webhook Configuration',
        'API Key Security',
        'Data Synchronization',
        'External Service Monitoring',
        'Integration Testing'
      ]
    };
  }

  @Get('/')
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'Service information' })
  getRoot() {
    return {
      service: 'Integration Hub Service',
      version: '1.0.0',
      description: 'Centralized management for third-party integrations, API orchestration, and external service connectivity',
      endpoints: {
        health: '/health',
        integrations: '/integrations/available',
        status: '/integrations/status',
        webhooks: '/integrations/webhooks',
        apiKeys: '/integrations/api-keys',
        syncStatus: '/integrations/sync-status',
        logs: '/integrations/logs',
        create: '/integrations/create',
        test: '/integrations/:id/test'
      },
      supportedServices: [
        'Payment Gateways (Razorpay, Paytm)',
        'Shipping Providers (Delhivery, Blue Dart)',
        'SMS Services (Twilio)',
        'Tax Services (ClearTax)',
        'Custom API Integrations'
      ]
    };
  }

  @Get('__introspect')
  @ApiOperation({ summary: 'Service introspection' })
  @ApiResponse({ status: 200, description: 'Service metadata and configuration' })
  getIntrospect() {
    return {
      serviceName: 'integration-hub',
      serviceType: 'external-api-management',
      port: 3014,
      database: 'PostgreSQL with Neon',
      features: {
        apiManagement: {
          keyRotation: true,
          rateLimiting: true,
          monitoring: true,
          healthChecks: true
        },
        webhookManagement: {
          eventFiltering: true,
          retryLogic: true,
          failureHandling: true,
          secureEndpoints: true
        },
        dataSync: {
          realTimeSync: true,
          batchProcessing: true,
          errorRecovery: true,
          conflictResolution: true
        },
        security: {
          apiKeyEncryption: true,
          auditLogging: true,
          accessControl: true,
          secureTransmission: true
        }
      },
      integrations: [
        'payment-processing',
        'shipping-delivery',
        'notification-service',
        'accounting-management'
      ],
      lastHealthCheck: new Date().toISOString()
    };
  }
}