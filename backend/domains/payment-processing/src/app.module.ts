import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { PaymentController } from './controllers/payment.controller';
import { HealthController } from './controllers/health.controller';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [PaymentController, HealthController],
  providers: [PaymentService],
})
export class AppModule {}