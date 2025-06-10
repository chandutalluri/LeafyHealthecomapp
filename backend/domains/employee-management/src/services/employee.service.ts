import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql } from 'drizzle-orm';
import { 
  db, 
  employees, 
  payrollRecords, 
  attendanceRecords, 
  leaveRequests, 
  performanceReviews,
  type Employee,
  type InsertEmployee,
  type PayrollRecord,
  type InsertPayrollRecord
} from '../database';

@Injectable()
export class EmployeeService {
  
  async createEmployee(createEmployeeDto: InsertEmployee) {
    try {
      const employeeId = `EMP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
      
      const employeeData: InsertEmployee = {
        ...createEmployeeDto,
        employeeId,
        status: 'active',
      };

      const [employee] = await db.insert(employees).values(employeeData).returning();

      return {
        success: true,
        message: 'Employee created successfully',
        data: employee,
      };
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Failed to create employee');
    }
  }

  async getAllEmployees() {
    try {
      const allEmployees = await db
        .select()
        .from(employees)
        .where(eq(employees.status, 'active'))
        .orderBy(desc(employees.createdAt));

      return {
        success: true,
        data: allEmployees,
        count: allEmployees.length
      };
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error('Failed to fetch employees');
    }
  }

  async getEmployeeById(id: number) {
    try {
      const [employee] = await db
        .select()
        .from(employees)
        .where(eq(employees.id, id));

      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      return {
        success: true,
        data: employee
      };
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw new Error('Failed to fetch employee');
    }
  }

  async updateEmployee(id: number, updateData: Partial<InsertEmployee>) {
    try {
      const [updatedEmployee] = await db
        .update(employees)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(employees.id, id))
        .returning();

      if (!updatedEmployee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      return {
        success: true,
        message: 'Employee updated successfully',
        data: updatedEmployee
      };
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('Failed to update employee');
    }
  }

  async getDepartmentStats() {
    try {
      const stats = await db
        .select({
          department: employees.department,
          totalEmployees: sql<number>`COUNT(*)`,
          averageSalary: sql<string>`AVG(${employees.salary})`,
          activeEmployees: sql<number>`COUNT(CASE WHEN ${employees.status} = 'active' THEN 1 END)`
        })
        .from(employees)
        .groupBy(employees.department)
        .orderBy(employees.department);

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error fetching department stats:', error);
      throw new Error('Failed to fetch department stats');
    }
  }

  async processPayroll(payrollData: InsertPayrollRecord) {
    try {
      const [payroll] = await db.insert(payrollRecords).values(payrollData).returning();

      return {
        success: true,
        message: 'Payroll processed successfully',
        data: payroll
      };
    } catch (error) {
      console.error('Error processing payroll:', error);
      throw new Error('Failed to process payroll');
    }
  }

  async recordAttendance(attendanceData: any) {
    try {
      const [attendance] = await db.insert(attendanceRecords).values(attendanceData).returning();

      return {
        success: true,
        message: 'Attendance recorded successfully',
        data: attendance
      };
    } catch (error) {
      console.error('Error recording attendance:', error);
      throw new Error('Failed to record attendance');
    }
  }

  async submitLeaveRequest(leaveData: any) {
    try {
      const [leaveRequest] = await db.insert(leaveRequests).values(leaveData).returning();

      return {
        success: true,
        message: 'Leave request submitted successfully',
        data: leaveRequest
      };
    } catch (error) {
      console.error('Error submitting leave request:', error);
      throw new Error('Failed to submit leave request');
    }
  }
}