import { Injectable } from '@nestjs/common';

@Injectable()
export class PayrollService {
  
  async getAllPayroll() {
    // Mock payroll data
    const payrollRecords = [
      {
        id: 1,
        employeeId: 'EMP-001',
        name: 'John Doe',
        period: 'January 2024',
        baseSalary: 55000,
        monthlyGross: 4583.33,
        overtime: 320.00,
        bonus: 500.00,
        deductions: {
          taxes: 1100.00,
          insurance: 280.00,
          retirement: 458.33,
        },
        netPay: 3565.00,
        status: 'paid',
        payDate: '2024-01-31',
      },
      {
        id: 2,
        employeeId: 'EMP-002',
        name: 'Jane Smith',
        period: 'January 2024',
        baseSalary: 42000,
        monthlyGross: 3500.00,
        overtime: 0.00,
        bonus: 200.00,
        deductions: {
          taxes: 850.00,
          insurance: 280.00,
          retirement: 350.00,
        },
        netPay: 2220.00,
        status: 'paid',
        payDate: '2024-01-31',
      },
      {
        id: 3,
        employeeId: 'EMP-003',
        name: 'Mike Johnson',
        period: 'January 2024',
        baseSalary: 38000,
        monthlyGross: 3166.67,
        overtime: 240.00,
        bonus: 100.00,
        deductions: {
          taxes: 750.00,
          insurance: 280.00,
          retirement: 316.67,
        },
        netPay: 2160.00,
        status: 'paid',
        payDate: '2024-01-31',
      },
    ];

    return payrollRecords;
  }

  async processPayroll(payrollData: any) {
    // Mock payroll processing
    const processedPayroll = {
      processingId: `PAY-${Date.now()}`,
      period: payrollData.period || 'February 2024',
      employeesProcessed: payrollData.employees?.length || 3,
      totalGross: 15250.00,
      totalDeductions: 4660.00,
      totalNet: 10590.00,
      status: 'processed',
      processedAt: new Date().toISOString(),
      approvedBy: 'HR Manager',
    };

    return {
      success: true,
      message: 'Payroll processed successfully',
      payroll: processedPayroll,
    };
  }

  async getEmployeePayroll(employeeId: number) {
    const allPayroll = await this.getAllPayroll();
    const employeePayroll = allPayroll.filter(record => 
      record.employeeId === `EMP-${employeeId.toString().padStart(3, '0')}`
    );

    if (employeePayroll.length === 0) {
      throw new Error('No payroll records found for this employee');
    }

    return {
      employee: employeePayroll[0].name,
      employeeId: employeePayroll[0].employeeId,
      records: employeePayroll,
      summary: {
        totalRecords: employeePayroll.length,
        averageNetPay: employeePayroll.reduce((sum, record) => sum + record.netPay, 0) / employeePayroll.length,
        lastPayDate: employeePayroll[0].payDate,
      },
    };
  }

  async getPayrollStats() {
    const allPayroll = await this.getAllPayroll();
    
    const stats = {
      overview: {
        totalEmployees: allPayroll.length,
        totalGrossPay: allPayroll.reduce((sum, record) => sum + record.monthlyGross + record.overtime + record.bonus, 0),
        totalDeductions: allPayroll.reduce((sum, record) => 
          sum + record.deductions.taxes + record.deductions.insurance + record.deductions.retirement, 0),
        totalNetPay: allPayroll.reduce((sum, record) => sum + record.netPay, 0),
      },
      breakdown: {
        salaries: allPayroll.reduce((sum, record) => sum + record.monthlyGross, 0),
        overtime: allPayroll.reduce((sum, record) => sum + record.overtime, 0),
        bonuses: allPayroll.reduce((sum, record) => sum + record.bonus, 0),
        taxes: allPayroll.reduce((sum, record) => sum + record.deductions.taxes, 0),
        insurance: allPayroll.reduce((sum, record) => sum + record.deductions.insurance, 0),
        retirement: allPayroll.reduce((sum, record) => sum + record.deductions.retirement, 0),
      },
      departmentCosts: {
        operations: 3565.00,
        customerService: 2220.00,
        warehouse: 2160.00,
      },
      payrollFrequency: 'Monthly',
      lastProcessed: '2024-01-31',
      nextPayDate: '2024-02-29',
    };

    return stats;
  }
}