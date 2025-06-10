import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
const path = require('path');
const { getBackendPort } = require("../../../../../shared/port-config'));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: process.env.FRONTEND_URLS?.split(',') || ['http://localhost:8080'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Employee Management Service')
    .setDescription('LeafyHealth Employee Management & Payroll Domain API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || getBackendPort('employee-management');
  await app.listen(port, '127.0.0.1');
  
  // Production logging removed - service startup handled by orchestrator
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
}

bootstrap().catch(console.error);