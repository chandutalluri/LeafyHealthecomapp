import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { ConfigModule } from '@nestjs/config';
import { EmployeeController } from './controllers/employee.controller';
import { PayrollController } from './controllers/payroll.controller';
import { HealthController } from './controllers/health.controller';
import { EmployeeService } from './services/employee.service';
import { PayrollService } from './services/payroll.service';

@Module({
  imports: [SharedAuthModule, ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),],
  controllers: [
    HealthController,
    EmployeeController,
    PayrollController,
  ],
  providers: [
    EmployeeService,
    PayrollService,
  ],
  exports: [
    EmployeeService,
    PayrollService,
  ],
})
export class AppModule {}