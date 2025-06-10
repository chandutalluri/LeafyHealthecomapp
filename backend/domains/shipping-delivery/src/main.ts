import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { databaseConnection } from './database';
const path = require('path');
const { getBackendPort } = require("./port-config");

async function bootstrap() {
  console.log('🔗 Database connected to PostgreSQL');
  console.log('🚚 Shipping Service using standardized database connection');

  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('LeafyHealth Shipping & Delivery Service')
    .setDescription('Manages shipments, tracking, and delivery logistics')
    .setVersion('1.0')
    .addTag('shipping')
    .addTag('health')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || getBackendPort('shipping-delivery');
  await app.listen(port, '127.0.0.1');
  
  // Production logging removed - service startup handled by orchestrator
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
  console.log(`🔍 Service introspection: http://localhost:${port}/__introspect`);
}

bootstrap();