import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { CategoryController } from './controllers/category.controller';
import { HealthController } from './controllers/health.controller';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { SharedAuthModule } from '../../../../shared/auth';

@Module({
  imports: [SharedAuthModule],
  controllers: [ProductController, CategoryController, HealthController],
  providers: [ProductService, CategoryService],
})
export class AppModule {}