import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: ['http://localhost:8080', 'http://localhost:3030'],
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
          service: 'integration-hub'
        });
      }
    });

    await app.listen(3016, '127.0.0.1');
    // Production logging removed - service startup handled by orchestrator
    console.log('📚 API Documentation: http://localhost:3016/api/docs');
    console.log('🏥 Health check: http://localhost:3016/health');
    console.log('🔍 Service introspection: http://localhost:3016/__introspect');
  } catch (error) {
    console.error('❌ Failed to start Integration Hub Service:', error);
    process.exit(1);
  }
}
bootstrap();