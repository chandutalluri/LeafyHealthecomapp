import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PermissionsModule,
  ],
})
export class AppModule {}