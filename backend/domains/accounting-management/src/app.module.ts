import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { AccountingController } from './controllers/accounting.controller';
import { HealthController } from './controllers/health.controller';
import { AccountingService } from './services/accounting.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [
    AccountingController,
    HealthController
  ],
  providers: [
    AccountingService
  ],
})
export class AppModule {}