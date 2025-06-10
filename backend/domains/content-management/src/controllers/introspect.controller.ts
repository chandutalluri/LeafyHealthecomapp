import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class IntrospectController {
  @Get('__introspect')
  getServiceInfo() {
    return {
      service: 'Content Management Service',
      version: '1.0.0',
      description: 'Manages digital content, media files, and content distribution',
      endpoints: {
        health: '/health',
        docs: '/api/docs',
        introspect: '/__introspect'
      },
      features: [
        'Content Creation & Management',
        'Media File Upload & Storage',
        'Content Publishing Workflows',
        'Digital Asset Management',
        'Content Analytics',
        'SEO Optimization'
      ],
      database: 'PostgreSQL with Drizzle ORM',
      authentication: 'JWT Bearer Token',
      port: process.env.PORT || 3019
    };
  }
}