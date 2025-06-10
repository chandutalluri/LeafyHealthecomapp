import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import {
  pgTable,
  serial,
  varchar,
  decimal,
  timestamp,
  text,
  integer,
  boolean,
  date,
  jsonb
} from 'drizzle-orm/pg-core';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });

// Employees Table
export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  employeeId: varchar('employee_id', { length: 20 }).unique().notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  phone: varchar('phone', { length: 15 }),
  dateOfBirth: date('date_of_birth'),
  hireDate: date('hire_date').notNull(),
  terminationDate: date('termination_date'),
  jobTitle: varchar('job_title', { length: 100 }).notNull(),
  department: varchar('department', { length: 50 }).notNull(),
  managerId: integer('manager_id'),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  hourlyRate: decimal('hourly_rate', { precision: 8, scale: 2 }),
  employmentType: varchar('employment_type', { length: 20 }).notNull(), // full-time, part-time, contract
  status: varchar('status', { length: 20 }).default('active').notNull(), // active, inactive, terminated
  address: text('address'),
  emergencyContact: jsonb('emergency_contact'),
  bankDetails: jsonb('bank_details'),
  documents: jsonb('documents'),
  skills: jsonb('skills'),
  certifications: jsonb('certifications'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payroll Records
export const payrollRecords = pgTable('payroll_records', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').notNull(),
  payPeriodStart: date('pay_period_start').notNull(),
  payPeriodEnd: date('pay_period_end').notNull(),
  grossPay: decimal('gross_pay', { precision: 10, scale: 2 }).notNull(),
  basicSalary: decimal('basic_salary', { precision: 10, scale: 2 }),
  overtime: decimal('overtime', { precision: 10, scale: 2 }).default('0'),
  bonuses: decimal('bonuses', { precision: 10, scale: 2 }).default('0'),
  allowances: decimal('allowances', { precision: 10, scale: 2 }).default('0'),
  deductions: decimal('deductions', { precision: 10, scale: 2 }).default('0'),
  taxDeductions: decimal('tax_deductions', { precision: 10, scale: 2 }).default('0'),
  netPay: decimal('net_pay', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 20 }).default('pending').notNull(),
  paymentDate: date('payment_date'),
  paymentMethod: varchar('payment_method', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Attendance Records
export const attendanceRecords = pgTable('attendance_records', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').notNull(),
  date: date('date').notNull(),
  checkIn: timestamp('check_in'),
  checkOut: timestamp('check_out'),
  breakDuration: integer('break_duration').default(0), // minutes
  totalHours: decimal('total_hours', { precision: 4, scale: 2 }),
  overtimeHours: decimal('overtime_hours', { precision: 4, scale: 2 }).default('0'),
  status: varchar('status', { length: 20 }).notNull(), // present, absent, late, half-day
  notes: text('notes'),
  approvedBy: integer('approved_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Leave Requests
export const leaveRequests = pgTable('leave_requests', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').notNull(),
  leaveType: varchar('leave_type', { length: 30 }).notNull(), // annual, sick, maternity, etc
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  totalDays: integer('total_days').notNull(),
  reason: text('reason').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, approved, rejected
  appliedDate: date('applied_date').defaultNow().notNull(),
  approvedBy: integer('approved_by'),
  approvedDate: date('approved_date'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Performance Reviews
export const performanceReviews = pgTable('performance_reviews', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').notNull(),
  reviewerId: integer('reviewer_id').notNull(),
  reviewPeriodStart: date('review_period_start').notNull(),
  reviewPeriodEnd: date('review_period_end').notNull(),
  overallRating: decimal('overall_rating', { precision: 3, scale: 2 }),
  goals: jsonb('goals'),
  achievements: jsonb('achievements'),
  strengths: text('strengths'),
  areasForImprovement: text('areas_for_improvement'),
  developmentPlan: text('development_plan'),
  comments: text('comments'),
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  reviewDate: date('review_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;
export type PayrollRecord = typeof payrollRecords.$inferSelect;
export type InsertPayrollRecord = typeof payrollRecords.$inferInsert;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertAttendanceRecord = typeof attendanceRecords.$inferInsert;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequest = typeof leaveRequests.$inferInsert;

console.log('🔗 Employee Management database connected to PostgreSQL');