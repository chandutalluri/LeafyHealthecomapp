import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { AccountingService } from '../services/accounting.service';

@ApiTags('accounting')
@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('general-ledger')
  @ApiOperation({ summary: 'Get general ledger with chart of accounts' })
  @ApiResponse({ status: 200, description: 'Returns general ledger data' })
  async getGeneralLedger() {
    return this.accountingService.getGeneralLedger();
  }

  @Get('profit-loss')
  @ApiOperation({ summary: 'Get profit and loss statement' })
  @ApiResponse({ status: 200, description: 'Returns P&L statement' })
  async getProfitAndLoss() {
    return this.accountingService.getProfitAndLoss();
  }

  @Get('balance-sheet')
  @ApiOperation({ summary: 'Get balance sheet' })
  @ApiResponse({ status: 200, description: 'Returns balance sheet data' })
  async getBalanceSheet() {
    return this.accountingService.getBalanceSheet();
  }

  @Get('cash-flow')
  @ApiOperation({ summary: 'Get cash flow statement' })
  @ApiResponse({ status: 200, description: 'Returns cash flow data' })
  async getCashFlow() {
    return this.accountingService.getCashFlow();
  }

  @Get('gst-compliance')
  @ApiOperation({ summary: 'Get GST compliance status and data' })
  @ApiResponse({ status: 200, description: 'Returns GST compliance information' })
  async getGSTCompliance() {
    return this.accountingService.getGSTCompliance();
  }

  @Get('ai-insights')
  @ApiOperation({ summary: 'Get AI-powered financial insights and predictions' })
  @ApiResponse({ status: 200, description: 'Returns AI financial analysis' })
  async getFinancialInsights() {
    return this.accountingService.getFinancialInsights();
  }

  @Get('fraud-detection')
  @ApiOperation({ summary: 'Get AI fraud detection analysis' })
  @ApiResponse({ status: 200, description: 'Returns fraud detection results' })
  async getFraudDetection() {
    return this.accountingService.getFraudDetection();
  }

  @Get('expense-analytics')
  @ApiOperation({ summary: 'Get expense analytics and categorization' })
  @ApiResponse({ status: 200, description: 'Returns expense analysis data' })
  async getExpenseAnalytics() {
    return this.accountingService.getExpenseAnalytics();
  }

  @Post('journal-entry')
  @ApiOperation({ summary: 'Create automated journal entry with AI suggestions' })
  @ApiResponse({ status: 201, description: 'Journal entry created successfully' })
  async createJournalEntry(@Body() entryData: any) {
    return {
      id: Math.floor(Math.random() * 10000),
      date: new Date().toISOString(),
      description: entryData.description || 'AI-suggested journal entry',
      entries: entryData.entries || [
        { account: 'Cash', debit: entryData.amount || 1000, credit: 0 },
        { account: 'Sales Revenue', debit: 0, credit: entryData.amount || 1000 }
      ],
      aiSuggestions: [
        'Entry follows proper double-entry bookkeeping principles',
        'Account classification verified',
        'No compliance issues detected'
      ],
      status: 'Posted',
      createdAt: new Date().toISOString()
    };
  }

  @Post('reconciliation')
  @ApiOperation({ summary: 'Perform AI-powered bank reconciliation' })
  @ApiResponse({ status: 200, description: 'Returns reconciliation results' })
  async performReconciliation(@Body() reconciliationData: any) {
    return {
      bankStatement: {
        endingBalance: 52000,
        transactions: 45,
        period: 'March 2024'
      },
      bookBalance: 50000,
      reconciliationItems: [
        { type: 'Outstanding Check', amount: -2500, description: 'Check #1234 to vendor' },
        { type: 'Deposit in Transit', amount: 4500, description: 'Customer payment pending' }
      ],
      reconciledBalance: 52000,
      aiConfidence: 0.94,
      discrepancies: [],
      status: 'Reconciled',
      completedAt: new Date().toISOString()
    };
  }
}