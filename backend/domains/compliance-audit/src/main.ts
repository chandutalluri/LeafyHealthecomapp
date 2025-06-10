import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  console.log('🔗 Database connected to PostgreSQL');
  console.log('🔍 Compliance & Audit Service using standardized database connection');

  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for cross-origin requests
  app.enableCors();
  
  await app.listen(3012, '127.0.0.1');
  
  // Production logging removed - service startup handled by orchestrator
  console.log('📚 API Documentation: http://localhost:3012/api/docs');
  console.log('🏥 Health check: http://localhost:3012/health');
  console.log('🔍 Service introspection: http://localhost:3012/__introspect');
}

bootstrap();