import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql, sum, count } from 'drizzle-orm';
import { 
  db, 
  accounts, 
  journalEntries, 
  journalEntryLines, 
  accountBalances,
  budgets,
  taxRecords,
  type Account,
  type InsertAccount,
  type JournalEntry,
  type InsertJournalEntry
} from '../database';

@Injectable()
export class AccountingService {
  
  // Chart of Accounts Management
  async createAccount(accountData: InsertAccount) {
    try {
      const [account] = await db.insert(accounts).values(accountData).returning();
      return {
        success: true,
        message: 'Account created successfully',
        data: account
      };
    } catch (error) {
      console.error('Error creating account:', error);
      throw new Error('Failed to create account');
    }
  }

  async getChartOfAccounts() {
    try {
      const chartOfAccounts = await db
        .select()
        .from(accounts)
        .where(eq(accounts.isActive, true))
        .orderBy(accounts.accountCode);

      // Group by account type
      const groupedAccounts = chartOfAccounts.reduce((acc, account) => {
        if (!acc[account.accountType]) {
          acc[account.accountType] = [];
        }
        acc[account.accountType].push(account);
        return acc;
      }, {});

      return {
        success: true,
        data: groupedAccounts,
        totalAccounts: chartOfAccounts.length
      };
    } catch (error) {
      console.error('Error fetching chart of accounts:', error);
      throw new Error('Failed to fetch chart of accounts');
    }
  }

  // Journal Entry Management
  async createJournalEntry(entryData: any, lineItems: any[], createdBy: number) {
    try {
      // Validate that debits equal credits
      const totalDebits = lineItems.reduce((sum, item) => sum + parseFloat(item.debitAmount || 0), 0);
      const totalCredits = lineItems.reduce((sum, item) => sum + parseFloat(item.creditAmount || 0), 0);

      if (Math.abs(totalDebits - totalCredits) > 0.01) {
        throw new Error('Total debits must equal total credits');
      }

      // Generate entry number
      const entryNumber = `JE-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const journalEntryData: InsertJournalEntry = {
        entryNumber,
        transactionDate: entryData.transactionDate,
        description: entryData.description,
        reference: entryData.reference,
        totalDebit: totalDebits.toString(),
        totalCredit: totalCredits.toString(),
        status: 'draft',
        createdBy
      };

      const [journalEntry] = await db.insert(journalEntries).values(journalEntryData).returning();

      // Insert line items
      const lineItemsData = lineItems.map(item => ({
        journalEntryId: journalEntry.id,
        accountId: item.accountId,
        description: item.description,
        debitAmount: (item.debitAmount || 0).toString(),
        creditAmount: (item.creditAmount || 0).toString(),
        reference: item.reference
      }));

      await db.insert(journalEntryLines).values(lineItemsData);

      return {
        success: true,
        message: 'Journal entry created successfully',
        data: journalEntry
      };
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw new Error('Failed to create journal entry');
    }
  }

  async getJournalEntries(limit = 50) {
    try {
      const entries = await db
        .select()
        .from(journalEntries)
        .orderBy(desc(journalEntries.createdAt))
        .limit(limit);

      return {
        success: true,
        data: entries,
        count: entries.length
      };
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw new Error('Failed to fetch journal entries');
    }
  }

  // Financial Reports
  async getGeneralLedger(accountId?: number, startDate?: string, endDate?: string) {
    try {
      const ledgerEntries = await db
        .select({
          account: {
            id: accounts.id,
            code: accounts.accountCode,
            name: accounts.accountName,
            type: accounts.accountType
          },
          journalEntry: {
            id: journalEntries.id,
            entryNumber: journalEntries.entryNumber,
            date: journalEntries.transactionDate,
            description: journalEntries.description
          },
          lineItem: {
            id: journalEntryLines.id,
            description: journalEntryLines.description,
            debitAmount: journalEntryLines.debitAmount,
            creditAmount: journalEntryLines.creditAmount
          }
        })
        .from(journalEntryLines)
        .innerJoin(accounts, eq(journalEntryLines.accountId, accounts.id))
        .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
        .where(eq(journalEntries.status, 'posted'))
        .orderBy(accounts.accountCode, desc(journalEntries.transactionDate));

      return {
        success: true,
        data: ledgerEntries,
        count: ledgerEntries.length
      };
    } catch (error) {
      console.error('Error generating general ledger:', error);
      throw new Error('Failed to generate general ledger');
    }
  }

  async getProfitAndLoss(startDate: string, endDate: string) {
    try {
      const plData = await db
        .select({
          accountType: accounts.accountType,
          accountName: accounts.accountName,
          totalAmount: sql<string>`COALESCE(SUM(${journalEntryLines.creditAmount}) - SUM(${journalEntryLines.debitAmount}), 0)`
        })
        .from(accounts)
        .leftJoin(journalEntryLines, eq(accounts.id, journalEntryLines.accountId))
        .leftJoin(journalEntries, and(
          eq(journalEntryLines.journalEntryId, journalEntries.id),
          eq(journalEntries.status, 'posted'),
          sql`${journalEntries.transactionDate} BETWEEN ${startDate} AND ${endDate}`
        ))
        .where(sql`${accounts.accountType} IN ('Revenue', 'Expense')`)
        .groupBy(accounts.accountType, accounts.accountName)
        .orderBy(accounts.accountType, accounts.accountName);

      const revenue = plData.filter(item => item.accountType === 'Revenue');
      const expenses = plData.filter(item => item.accountType === 'Expense');

      const totalRevenue = revenue.reduce((sum, item) => sum + parseFloat(item.totalAmount), 0);
      const totalExpenses = expenses.reduce((sum, item) => sum + Math.abs(parseFloat(item.totalAmount)), 0);
      const netIncome = totalRevenue - totalExpenses;

      return {
        success: true,
        data: {
          period: { startDate, endDate },
          revenue: {
            items: revenue,
            total: totalRevenue
          },
          expenses: {
            items: expenses,
            total: totalExpenses
          },
          netIncome,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating P&L:', error);
      throw new Error('Failed to generate profit and loss statement');
    }
  }

  async getBalanceSheet(asOfDate: string) {
    try {
      const balanceSheetData = await db
        .select({
          accountType: accounts.accountType,
          accountName: accounts.accountName,
          balance: sql<string>`COALESCE(SUM(${journalEntryLines.debitAmount}) - SUM(${journalEntryLines.creditAmount}), 0)`
        })
        .from(accounts)
        .leftJoin(journalEntryLines, eq(accounts.id, journalEntryLines.accountId))
        .leftJoin(journalEntries, and(
          eq(journalEntryLines.journalEntryId, journalEntries.id),
          eq(journalEntries.status, 'posted'),
          sql`${journalEntries.transactionDate} <= ${asOfDate}`
        ))
        .where(sql`${accounts.accountType} IN ('Asset', 'Liability', 'Equity')`)
        .groupBy(accounts.accountType, accounts.accountName)
        .orderBy(accounts.accountType, accounts.accountName);

      const assets = balanceSheetData.filter(item => item.accountType === 'Asset');
      const liabilities = balanceSheetData.filter(item => item.accountType === 'Liability');
      const equity = balanceSheetData.filter(item => item.accountType === 'Equity');

      const totalAssets = assets.reduce((sum, item) => sum + parseFloat(item.balance), 0);
      const totalLiabilities = liabilities.reduce((sum, item) => sum + Math.abs(parseFloat(item.balance)), 0);
      const totalEquity = equity.reduce((sum, item) => sum + Math.abs(parseFloat(item.balance)), 0);

      return {
        success: true,
        data: {
          asOfDate,
          assets: {
            items: assets,
            total: totalAssets
          },
          liabilities: {
            items: liabilities,
            total: totalLiabilities
          },
          equity: {
            items: equity,
            total: totalEquity
          },
          balanceCheck: {
            assetsTotal: totalAssets,
            liabilitiesEquityTotal: totalLiabilities + totalEquity,
            isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
          },
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating balance sheet:', error);
      throw new Error('Failed to generate balance sheet');
    }
  }
}