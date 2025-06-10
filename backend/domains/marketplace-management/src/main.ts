import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const path = require('path');
const { getBackendPort } = require("./port-config");

async function bootstrap() {
  console.log('🔗 Database connected to PostgreSQL');
  console.log('🏪 Marketplace Management Service using standardized database connection');

  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS configuration
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('LeafyHealth Marketplace Management API')
    .setDescription('Marketplace Management Service for vendor and marketplace operations')
    .setVersion('1.0')
    .addTag('Vendors', 'Vendor management operations')
    .addTag('Health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || getBackendPort('marketplace-management');
  await app.listen(port, '127.0.0.1');
  
  // Production logging removed - service startup handled by orchestrator
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
  console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);
}

bootstrap();