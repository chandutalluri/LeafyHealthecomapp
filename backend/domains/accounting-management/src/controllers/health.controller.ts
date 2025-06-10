import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      service: 'Accounting Management & AI Analytics Service',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      features: [
        'General Ledger Management',
        'Financial Statements (P&L, Balance Sheet, Cash Flow)',
        'GST Compliance & Tax Management',
        'AI-Powered Financial Insights',
        'Fraud Detection & Risk Analysis',
        'Automated Reconciliation',
        'Expense Analytics & Categorization'
      ]
    };
  }

  @Get('/')
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'Service information' })
  getRoot() {
    return {
      service: 'Accounting Management & AI Analytics Service',
      version: '1.0.0',
      description: 'Advanced accounting system with AI-powered insights, GST compliance, and automated financial management',
      endpoints: {
        health: '/health',
        generalLedger: '/accounting/general-ledger',
        profitLoss: '/accounting/profit-loss',
        balanceSheet: '/accounting/balance-sheet',
        cashFlow: '/accounting/cash-flow',
        gstCompliance: '/accounting/gst-compliance',
        aiInsights: '/accounting/ai-insights',
        fraudDetection: '/accounting/fraud-detection',
        expenseAnalytics: '/accounting/expense-analytics',
        journalEntry: '/accounting/journal-entry',
        reconciliation: '/accounting/reconciliation'
      },
      capabilities: [
        'Double-entry bookkeeping automation',
        'AI-powered expense categorization',
        'Real-time financial analytics',
        'GST compliance monitoring',
        'Fraud detection algorithms',
        'Predictive financial modeling'
      ]
    };
  }

  @Get('__introspect')
  @ApiOperation({ summary: 'Service introspection' })
  @ApiResponse({ status: 200, description: 'Service metadata and configuration' })
  getIntrospect() {
    return {
      serviceName: 'accounting-management',
      serviceType: 'financial-analytics',
      port: 3013,
      database: 'PostgreSQL with Neon',
      features: {
        coreAccounting: {
          generalLedger: true,
          chartOfAccounts: true,
          journalEntries: true,
          doubleEntry: true
        },
        financialReports: {
          profitLoss: true,
          balanceSheet: true,
          cashFlow: true,
          trialBalance: true
        },
        aiCapabilities: {
          expenseCategorization: true,
          fraudDetection: true,
          predictiveAnalytics: true,
          automatedReconciliation: true,
          financialForecasting: true
        },
        compliance: {
          gstManagement: true,
          taxReporting: true,
          auditTrails: true,
          regulatoryCompliance: true
        }
      },
      integrations: ['payment-processing', 'inventory-management', 'order-management'],
      lastHealthCheck: new Date().toISOString()
    };
  }
}