import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MultiLanguageManagementController } from './controllers/multi-language-management.controller';
import { MultiLanguageManagementService } from './services/multi-language-management.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [MultiLanguageManagementController],
  providers: [MultiLanguageManagementService],
})
export class AppModule {}