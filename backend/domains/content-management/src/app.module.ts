import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { ConfigModule } from '@nestjs/config';
import { ContentController } from './controllers/content.controller';
import { HealthController } from './controllers/health.controller';
import { IntrospectController } from './controllers/introspect.controller';
import { ContentService } from './services/content.service';

@Module({
  imports: [SharedAuthModule, ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),],
  controllers: [
    HealthController,
    IntrospectController,
    ContentController,
  ],
  providers: [
    ContentService,
  ],
  exports: [
    ContentService,
  ],
})
export class AppModule {}