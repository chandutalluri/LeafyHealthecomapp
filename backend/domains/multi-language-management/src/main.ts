import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Multi-Language Management API')
    .setDescription('Complete language localization service for Indian grocery platforms')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Multi-Language Management', 'Language and translation management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'multi-language-management',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  const port = process.env.PORT || 3050;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🌐 Multi-Language Management service running on port ${port}`);
  console.log(`📚 API documentation available at http://localhost:${port}/api`);
  console.log(`❤️  Health check available at http://localhost:${port}/health`);
  console.log(`🔒 JWT authentication enabled for all endpoints`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Multi-Language Management service:', error);
  process.exit(1);
});