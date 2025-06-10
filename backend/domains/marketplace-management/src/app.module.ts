import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { VendorController } from './controllers/vendor.controller';
import { HealthController } from './controllers/health.controller';
import { VendorService } from './services/vendor.service';

@Module({
  imports: [SharedAuthModule],
  controllers: [VendorController, HealthController],
  providers: [VendorService],
})
export class AppModule {}