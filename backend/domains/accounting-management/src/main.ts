import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const path = require('path');
const { getBackendPort } = require("../../../../../shared/port-config'));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Accounting Management & AI Analytics Service')
    .setDescription('Advanced accounting system with AI-powered insights, GST compliance, and automated financial management')
    .setVersion('1.0.0')
    .addTag('accounting', 'Financial management and reporting')
    .addTag('ai-analytics', 'AI-powered financial insights')
    .addTag('gst-compliance', 'GST and tax management')
    .addTag('health', 'Service health endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:3030'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || getBackendPort('accounting-management');
  await app.listen(port, '127.0.0.1');
  
  // Production logging removed - service startup handled by orchestrator
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
  console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);
}

bootstrap();