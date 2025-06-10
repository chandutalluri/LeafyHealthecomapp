import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { EmployeeService } from '../services/employee.service';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create new employee' })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  async createEmployee(@Body() createEmployeeDto: any) {
    return await this.employeeService.createEmployee(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({ status: 200, description: 'List of all employees' })
  async getAllEmployees() {
    return await this.employeeService.getAllEmployees();
  }

  @Get('attendance')
  @ApiOperation({ summary: 'Get attendance records' })
  @ApiResponse({ status: 200, description: 'Attendance data' })
  async getAttendance() {
    return await this.employeeService.getAttendanceRecords();
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance data' })
  async getPerformance() {
    return await this.employeeService.getPerformanceMetrics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({ status: 200, description: 'Employee details' })
  async getEmployeeById(@Param('id') id: string) {
    return await this.employeeService.getEmployeeById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  async updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: any) {
    return await this.employeeService.updateEmployee(+id, updateEmployeeDto);
  }
}