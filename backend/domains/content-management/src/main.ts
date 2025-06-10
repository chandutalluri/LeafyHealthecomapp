import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
const path = require('path');
const { getBackendPort } = require("../../../../../shared/port-config'));

async function bootstrap() {
  try {
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

    // Global error filter for JSON responses
    app.useGlobalFilters({
      catch(exception: any, host: any) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus ? exception.getStatus() : 500;

        response.status(status).json({
          statusCode: status,
          message: exception.message || 'Internal server error',
          timestamp: new Date().toISOString(),
          service: 'content-management'
        });
      }
    });

    const config = new DocumentBuilder()
      .setTitle('Content Management Service')
      .setDescription('LeafyHealth Content Management Domain API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || getBackendPort('content-management');
    await app.listen(port, '127.0.0.1');

    // Production logging removed - service startup handled by orchestrator
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);

    // Keep process alive
    setInterval(() => {
      // Keep alive
    }, 30000);

    process.on('SIGTERM', () => {
      console.log('Content Management Service shutting down gracefully');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('Content Management Service shutting down gracefully');
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start Content Management Service:', error);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error('Failed to start Content Management Service:', err);
  process.exit(1);
});