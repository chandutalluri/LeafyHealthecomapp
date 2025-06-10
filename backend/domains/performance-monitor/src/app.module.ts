import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { PerformanceController } from './controllers/performance.controller';
import { MetricsController } from './controllers/metrics.controller';
import { HealthController } from './controllers/health.controller';
import { PerformanceService } from './services/performance.service';
import { MetricsService } from './services/metrics.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [PerformanceController, MetricsController, HealthController],
  providers: [PerformanceService, MetricsService],
})
export class AppModule {}