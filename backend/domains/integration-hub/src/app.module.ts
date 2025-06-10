import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { IntegrationController } from './controllers/integration.controller';
import { HealthController } from './controllers/health.controller';
import { IntegrationService } from './services/integration.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [
    IntegrationController,
    HealthController
  ],
  providers: [
    IntegrationService
  ],
})
export class AppModule {}