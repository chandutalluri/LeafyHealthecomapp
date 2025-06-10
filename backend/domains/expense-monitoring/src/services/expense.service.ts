import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql, between } from 'drizzle-orm';
import { 
  db, 
  expenses, 
  expenseCategories, 
  budgetAllocations, 
  expenseReports, 
  vendors,
  type Expense,
  type InsertExpense,
  type ExpenseCategory,
  type InsertExpenseCategory
} from '../database';

@Injectable()
export class ExpenseService {

  async createExpense(expenseData: InsertExpense) {
    try {
      const expenseNumber = `EXP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
      
      const [expense] = await db.insert(expenses).values({
        ...expenseData,
        expenseNumber
      }).returning();

      return {
        success: true,
        data: expense,
        message: 'Expense created successfully'
      };
    } catch (error) {
      console.error('Error creating expense:', error);
      throw new Error('Failed to create expense');
    }
  }

  async getAllExpenses(status?: string, category?: string) {
    try {
      let query = db.select().from(expenses).orderBy(desc(expenses.createdAt));

      if (status) {
        query = query.where(eq(expenses.status, status));
      }

      if (category) {
        query = query.where(eq(expenses.category, category));
      }

      const allExpenses = await query;

      return {
        success: true,
        data: allExpenses,
        count: allExpenses.length
      };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw new Error('Failed to fetch expenses');
    }
  }

  async getExpenseById(id: number) {
    try {
      const [expense] = await db
        .select()
        .from(expenses)
        .where(eq(expenses.id, id));

      if (!expense) {
        throw new NotFoundException(`Expense with ID ${id} not found`);
      }

      return {
        success: true,
        data: expense
      };
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw new Error('Failed to fetch expense');
    }
  }

  async updateExpenseStatus(id: number, status: string, approvedBy?: number) {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'approved' && approvedBy) {
        updateData.approvedBy = approvedBy;
        updateData.approvedAt = new Date();
      }

      if (status === 'paid') {
        updateData.paidAt = new Date();
      }

      const [updatedExpense] = await db
        .update(expenses)
        .set(updateData)
        .where(eq(expenses.id, id))
        .returning();

      if (!updatedExpense) {
        throw new NotFoundException(`Expense with ID ${id} not found`);
      }

      return {
        success: true,
        data: updatedExpense,
        message: `Expense ${status} successfully`
      };
    } catch (error) {
      console.error('Error updating expense status:', error);
      throw new Error('Failed to update expense status');
    }
  }

  async createExpenseCategory(categoryData: InsertExpenseCategory) {
    try {
      const [category] = await db.insert(expenseCategories).values(categoryData).returning();

      return {
        success: true,
        data: category,
        message: 'Expense category created successfully'
      };
    } catch (error) {
      console.error('Error creating expense category:', error);
      throw new Error('Failed to create expense category');
    }
  }

  async getExpenseCategories() {
    try {
      const categories = await db
        .select()
        .from(expenseCategories)
        .where(eq(expenseCategories.isActive, true))
        .orderBy(expenseCategories.name);

      return {
        success: true,
        data: categories,
        count: categories.length
      };
    } catch (error) {
      console.error('Error fetching expense categories:', error);
      throw new Error('Failed to fetch expense categories');
    }
  }

  async getExpensesByCategory() {
    try {
      const expensesByCategory = await db
        .select({
          category: expenses.category,
          totalAmount: sql<string>`SUM(${expenses.amount})`,
          count: sql<number>`COUNT(*)`
        })
        .from(expenses)
        .groupBy(expenses.category)
        .orderBy(expenses.category);

      return {
        success: true,
        data: expensesByCategory
      };
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      throw new Error('Failed to fetch expenses by category');
    }
  }

  async getExpenseAnalytics(startDate?: string, endDate?: string) {
    try {
      let query = db
        .select({
          totalExpenses: sql<string>`SUM(${expenses.amount})`,
          totalCount: sql<number>`COUNT(*)`,
          approvedExpenses: sql<string>`SUM(CASE WHEN ${expenses.status} = 'approved' THEN ${expenses.amount} ELSE 0 END)`,
          pendingExpenses: sql<string>`SUM(CASE WHEN ${expenses.status} = 'pending' THEN ${expenses.amount} ELSE 0 END)`
        })
        .from(expenses);

      if (startDate && endDate) {
        query = query.where(between(expenses.expenseDate, startDate, endDate));
      }

      const [analytics] = await query;

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('Error fetching expense analytics:', error);
      throw new Error('Failed to fetch expense analytics');
    }
  }

  async createBudgetAllocation(budgetData: any) {
    try {
      const [budget] = await db.insert(budgetAllocations).values(budgetData).returning();

      return {
        success: true,
        data: budget,
        message: 'Budget allocation created successfully'
      };
    } catch (error) {
      console.error('Error creating budget allocation:', error);
      throw new Error('Failed to create budget allocation');
    }
  }

  async getBudgetAllocations() {
    try {
      const budgets = await db
        .select({
          id: budgetAllocations.id,
          categoryId: budgetAllocations.categoryId,
          department: budgetAllocations.department,
          period: budgetAllocations.period,
          budgetAmount: budgetAllocations.budgetAmount,
          spentAmount: budgetAllocations.spentAmount,
          remainingAmount: budgetAllocations.remainingAmount,
          utilizationPercentage: sql<string>`ROUND((${budgetAllocations.spentAmount} / ${budgetAllocations.budgetAmount}) * 100, 2)`,
          startDate: budgetAllocations.startDate,
          endDate: budgetAllocations.endDate,
          isActive: budgetAllocations.isActive
        })
        .from(budgetAllocations)
        .where(eq(budgetAllocations.isActive, true))
        .orderBy(budgetAllocations.department);

      return {
        success: true,
        data: budgets,
        count: budgets.length
      };
    } catch (error) {
      console.error('Error fetching budget allocations:', error);
      throw new Error('Failed to fetch budget allocations');
    }
  }
}