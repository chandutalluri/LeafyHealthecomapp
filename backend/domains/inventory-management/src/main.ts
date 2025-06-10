import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:3030'],
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('LeafyHealth Inventory Management Service')
    .setDescription('Inventory tracking and stock management API')
    .setVersion('1.0')
    .addTag('inventory')
    .addTag('health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3021, '127.0.0.1');
  // Production logging removed - service startup handled by orchestrator
  console.log('📚 API Documentation: http://localhost:3021/api/docs');
  console.log('🏥 Health check: http://localhost:3021/health');
  console.log('🔍 Service introspection: http://localhost:3021/__introspect');
}

bootstrap();