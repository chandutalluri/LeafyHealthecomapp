import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql, gte, lte } from 'drizzle-orm';
import { 
  db, 
  performanceMetrics, 
  systemHealth, 
  alertRules, 
  alerts, 
  performanceReports, 
  apiPerformance,
  type PerformanceMetric,
  type InsertPerformanceMetric,
  type SystemHealth,
  type InsertSystemHealth
} from '../database';

@Injectable()
export class PerformanceService {

  async recordMetric(metricData: InsertPerformanceMetric) {
    try {
      const [metric] = await db.insert(performanceMetrics).values(metricData).returning();

      // Check if this metric triggers any alerts
      await this.checkAlertRules(metricData.metricName, metricData.value);

      return {
        success: true,
        data: metric,
        message: 'Performance metric recorded successfully'
      };
    } catch (error) {
      console.error('Error recording performance metric:', error);
      throw new Error('Failed to record performance metric');
    }
  }

  async getMetrics(metricName?: string, startTime?: string, endTime?: string) {
    try {
      let query = db.select().from(performanceMetrics).orderBy(desc(performanceMetrics.timestamp));

      if (metricName) {
        query = query.where(eq(performanceMetrics.metricName, metricName));
      }

      if (startTime && endTime) {
        query = query.where(and(
          gte(performanceMetrics.timestamp, startTime),
          lte(performanceMetrics.timestamp, endTime)
        ));
      }

      const metrics = await query.limit(1000);

      return {
        success: true,
        data: metrics,
        count: metrics.length
      };
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw new Error('Failed to fetch performance metrics');
    }
  }

  async updateSystemHealth(healthData: InsertSystemHealth) {
    try {
      // Check if record exists for this service
      const [existingHealth] = await db
        .select()
        .from(systemHealth)
        .where(eq(systemHealth.serviceName, healthData.serviceName));

      let result;
      if (existingHealth) {
        [result] = await db
          .update(systemHealth)
          .set({
            ...healthData,
            lastCheckAt: new Date()
          })
          .where(eq(systemHealth.serviceName, healthData.serviceName))
          .returning();
      } else {
        [result] = await db.insert(systemHealth).values(healthData).returning();
      }

      return {
        success: true,
        data: result,
        message: 'System health updated successfully'
      };
    } catch (error) {
      console.error('Error updating system health:', error);
      throw new Error('Failed to update system health');
    }
  }

  async getSystemHealth() {
    try {
      const healthData = await db
        .select()
        .from(systemHealth)
        .orderBy(systemHealth.serviceName);

      return {
        success: true,
        data: healthData,
        count: healthData.length
      };
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw new Error('Failed to fetch system health');
    }
  }

  async createAlertRule(ruleData: any) {
    try {
      const [rule] = await db.insert(alertRules).values(ruleData).returning();

      return {
        success: true,
        data: rule,
        message: 'Alert rule created successfully'
      };
    } catch (error) {
      console.error('Error creating alert rule:', error);
      throw new Error('Failed to create alert rule');
    }
  }

  async getAlertRules() {
    try {
      const rules = await db
        .select()
        .from(alertRules)
        .where(eq(alertRules.isActive, true))
        .orderBy(alertRules.ruleName);

      return {
        success: true,
        data: rules,
        count: rules.length
      };
    } catch (error) {
      console.error('Error fetching alert rules:', error);
      throw new Error('Failed to fetch alert rules');
    }
  }

  async getAlerts(status?: string) {
    try {
      let query = db.select().from(alerts).orderBy(desc(alerts.createdAt));

      if (status) {
        query = query.where(eq(alerts.status, status));
      }

      const alertsList = await query;

      return {
        success: true,
        data: alertsList,
        count: alertsList.length
      };
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw new Error('Failed to fetch alerts');
    }
  }

  async acknowledgeAlert(alertId: number, acknowledgedBy: number) {
    try {
      const [acknowledgedAlert] = await db
        .update(alerts)
        .set({
          status: 'acknowledged',
          acknowledgedBy,
          acknowledgedAt: new Date()
        })
        .where(eq(alerts.id, alertId))
        .returning();

      if (!acknowledgedAlert) {
        throw new NotFoundException(`Alert with ID ${alertId} not found`);
      }

      return {
        success: true,
        data: acknowledgedAlert,
        message: 'Alert acknowledged successfully'
      };
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw new Error('Failed to acknowledge alert');
    }
  }

  async recordApiPerformance(apiData: any) {
    try {
      const [apiMetric] = await db.insert(apiPerformance).values(apiData).returning();

      return {
        success: true,
        data: apiMetric,
        message: 'API performance recorded successfully'
      };
    } catch (error) {
      console.error('Error recording API performance:', error);
      throw new Error('Failed to record API performance');
    }
  }

  async getApiPerformance(endpoint?: string) {
    try {
      let query = db
        .select({
          endpoint: apiPerformance.endpoint,
          method: apiPerformance.method,
          avgResponseTime: sql<string>`AVG(${apiPerformance.responseTime})`,
          maxResponseTime: sql<number>`MAX(${apiPerformance.responseTime})`,
          minResponseTime: sql<number>`MIN(${apiPerformance.responseTime})`,
          totalRequests: sql<number>`COUNT(*)`,
          errorRate: sql<string>`(COUNT(CASE WHEN ${apiPerformance.statusCode} >= 400 THEN 1 END) * 100.0 / COUNT(*))`
        })
        .from(apiPerformance);

      if (endpoint) {
        query = query.where(eq(apiPerformance.endpoint, endpoint));
      }

      const performance = await query
        .groupBy(apiPerformance.endpoint, apiPerformance.method)
        .orderBy(apiPerformance.endpoint);

      return {
        success: true,
        data: performance
      };
    } catch (error) {
      console.error('Error fetching API performance:', error);
      throw new Error('Failed to fetch API performance');
    }
  }

  async generatePerformanceReport(reportType: string, startDate: string, endDate: string) {
    try {
      const reportData = await this.compileReportData(startDate, endDate);
      
      const [report] = await db.insert(performanceReports).values({
        reportName: `${reportType} Performance Report`,
        reportType,
        periodStart: new Date(startDate),
        periodEnd: new Date(endDate),
        metrics: reportData,
        generatedBy: 1 // System generated
      }).returning();

      return {
        success: true,
        data: report,
        message: 'Performance report generated successfully'
      };
    } catch (error) {
      console.error('Error generating performance report:', error);
      throw new Error('Failed to generate performance report');
    }
  }

  private async checkAlertRules(metricName: string, value: number) {
    try {
      const rules = await db
        .select()
        .from(alertRules)
        .where(and(
          eq(alertRules.metricName, metricName),
          eq(alertRules.isActive, true)
        ));

      for (const rule of rules) {
        const shouldAlert = this.evaluateAlertCondition(rule.condition, value, parseFloat(rule.threshold.toString()));
        
        if (shouldAlert) {
          await db.insert(alerts).values({
            ruleId: rule.id,
            alertLevel: rule.severity,
            title: `${rule.ruleName} triggered`,
            message: `Metric ${metricName} value ${value} ${rule.condition} threshold ${rule.threshold}`,
            triggerValue: value
          });
        }
      }
    } catch (error) {
      console.error('Error checking alert rules:', error);
    }
  }

  private evaluateAlertCondition(condition: string, value: number, threshold: number): boolean {
    switch (condition) {
      case 'greater_than':
        return value > threshold;
      case 'less_than':
        return value < threshold;
      case 'equals':
        return value === threshold;
      default:
        return false;
    }
  }

  private async compileReportData(startDate: string, endDate: string) {
    // Compile comprehensive performance data for the report
    const systemHealthSummary = await db
      .select({
        totalServices: sql<number>`COUNT(*)`,
        healthyServices: sql<number>`COUNT(CASE WHEN ${systemHealth.healthStatus} = 'healthy' THEN 1 END)`,
        warningServices: sql<number>`COUNT(CASE WHEN ${systemHealth.healthStatus} = 'warning' THEN 1 END)`,
        criticalServices: sql<number>`COUNT(CASE WHEN ${systemHealth.healthStatus} = 'critical' THEN 1 END)`
      })
      .from(systemHealth);

    const alertsSummary = await db
      .select({
        totalAlerts: sql<number>`COUNT(*)`,
        openAlerts: sql<number>`COUNT(CASE WHEN ${alerts.status} = 'open' THEN 1 END)`,
        acknowledgedAlerts: sql<number>`COUNT(CASE WHEN ${alerts.status} = 'acknowledged' THEN 1 END)`,
        resolvedAlerts: sql<number>`COUNT(CASE WHEN ${alerts.status} = 'resolved' THEN 1 END)`
      })
      .from(alerts)
      .where(and(
        gte(alerts.createdAt, startDate),
        lte(alerts.createdAt, endDate)
      ));

    return {
      systemHealth: systemHealthSummary[0],
      alerts: alertsSummary[0],
      generatedAt: new Date().toISOString()
    };
  }
}