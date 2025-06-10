import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { OrderController } from './controllers/order.controller';
import { HealthController } from './controllers/health.controller';
import { OrderService } from './services/order.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [OrderController, HealthController],
  providers: [OrderService],
})
export class AppModule {}