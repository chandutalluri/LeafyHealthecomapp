import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const path = require('path');
const { getBackendPort } = require("../../../../../shared/port-config'));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Analytics & Reporting Service API')
    .setDescription('Business analytics and reporting operations')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || getBackendPort('analytics-reporting');
  await app.listen(port, '127.0.0.1');
  
  // Production logging removed - service startup handled by orchestrator
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
  console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);
}

bootstrap();