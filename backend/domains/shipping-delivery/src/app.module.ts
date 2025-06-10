import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { ShippingController } from './controllers/shipping.controller';
import { HealthController } from './controllers/health.controller';
import { ShippingService } from './services/shipping.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [
    ShippingController,
    HealthController
  ],
  providers: [
    ShippingService
  ],
  exports: [
    ShippingService
  ]
})
export class AppModule {}