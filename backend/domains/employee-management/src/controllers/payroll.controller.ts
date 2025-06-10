import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { PayrollService } from '../services/payroll.service';

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  @ApiOperation({ summary: 'Get payroll records' })
  @ApiResponse({ status: 200, description: 'List of payroll records' })
  async getAllPayroll() {
    return await this.payrollService.getAllPayroll();
  }

  @Post('process')
  @ApiOperation({ summary: 'Process monthly payroll' })
  @ApiResponse({ status: 201, description: 'Payroll processed successfully' })
  async processPayroll(@Body() payrollData: any) {
    return await this.payrollService.processPayroll(payrollData);
  }

  @Get('employee/:id')
  @ApiOperation({ summary: 'Get payroll for specific employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({ status: 200, description: 'Employee payroll history' })
  async getEmployeePayroll(@Param('id') id: string) {
    return await this.payrollService.getEmployeePayroll(+id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get payroll statistics' })
  @ApiResponse({ status: 200, description: 'Payroll statistics' })
  async getPayrollStats() {
    return await this.payrollService.getPayrollStats();
  }
}