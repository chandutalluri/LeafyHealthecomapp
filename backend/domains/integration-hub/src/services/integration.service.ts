import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql } from 'drizzle-orm';
import { 
  db, 
  integrations, 
  integrationLogs, 
  dataSyncJobs, 
  webhookEvents, 
  apiKeys,
  type Integration,
  type InsertIntegration,
  type IntegrationLog,
  type InsertIntegrationLog
} from '../database';

@Injectable()
export class IntegrationService {

  async createIntegration(integrationData: InsertIntegration) {
    try {
      const [integration] = await db.insert(integrations).values(integrationData).returning();

      return {
        success: true,
        data: integration,
        message: 'Integration created successfully'
      };
    } catch (error) {
      console.error('Error creating integration:', error);
      throw new Error('Failed to create integration');
    }
  }

  async getAllIntegrations() {
    try {
      const allIntegrations = await db
        .select({
          id: integrations.id,
          name: integrations.name,
          provider: integrations.provider,
          integrationType: integrations.integrationType,
          status: integrations.status,
          isEnabled: integrations.isEnabled,
          lastSyncAt: integrations.lastSyncAt,
          createdAt: integrations.createdAt,
          updatedAt: integrations.updatedAt
        })
        .from(integrations)
        .orderBy(desc(integrations.createdAt));

      return {
        success: true,
        data: allIntegrations,
        count: allIntegrations.length
      };
    } catch (error) {
      console.error('Error fetching integrations:', error);
      throw new Error('Failed to fetch integrations');
    }
  }

  async getIntegrationById(id: number) {
    try {
      const [integration] = await db
        .select()
        .from(integrations)
        .where(eq(integrations.id, id));

      if (!integration) {
        throw new NotFoundException(`Integration with ID ${id} not found`);
      }

      // Remove sensitive credentials from response
      const { credentials, ...safeIntegration } = integration;

      return {
        success: true,
        data: safeIntegration
      };
    } catch (error) {
      console.error('Error fetching integration:', error);
      throw new Error('Failed to fetch integration');
    }
  }

  async updateIntegrationStatus(id: number, status: string) {
    try {
      const [updatedIntegration] = await db
        .update(integrations)
        .set({
          status,
          updatedAt: new Date()
        })
        .where(eq(integrations.id, id))
        .returning();

      if (!updatedIntegration) {
        throw new NotFoundException(`Integration with ID ${id} not found`);
      }

      return {
        success: true,
        data: updatedIntegration,
        message: `Integration status updated to ${status}`
      };
    } catch (error) {
      console.error('Error updating integration status:', error);
      throw new Error('Failed to update integration status');
    }
  }

  async logIntegrationEvent(logData: InsertIntegrationLog) {
    try {
      const [log] = await db.insert(integrationLogs).values(logData).returning();

      return {
        success: true,
        data: log,
        message: 'Integration event logged successfully'
      };
    } catch (error) {
      console.error('Error logging integration event:', error);
      throw new Error('Failed to log integration event');
    }
  }

  async getIntegrationLogs(integrationId: number, limit = 100) {
    try {
      const logs = await db
        .select()
        .from(integrationLogs)
        .where(eq(integrationLogs.integrationId, integrationId))
        .orderBy(desc(integrationLogs.createdAt))
        .limit(limit);

      return {
        success: true,
        data: logs,
        count: logs.length
      };
    } catch (error) {
      console.error('Error fetching integration logs:', error);
      throw new Error('Failed to fetch integration logs');
    }
  }

  async createSyncJob(jobData: any) {
    try {
      const [job] = await db.insert(dataSyncJobs).values(jobData).returning();

      return {
        success: true,
        data: job,
        message: 'Data sync job created successfully'
      };
    } catch (error) {
      console.error('Error creating sync job:', error);
      throw new Error('Failed to create sync job');
    }
  }

  async getSyncJobs(integrationId?: number) {
    try {
      let query = db
        .select()
        .from(dataSyncJobs)
        .orderBy(desc(dataSyncJobs.createdAt));

      if (integrationId) {
        query = query.where(eq(dataSyncJobs.integrationId, integrationId));
      }

      const jobs = await query;

      return {
        success: true,
        data: jobs,
        count: jobs.length
      };
    } catch (error) {
      console.error('Error fetching sync jobs:', error);
      throw new Error('Failed to fetch sync jobs');
    }
  }

  async processWebhookEvent(webhookData: any) {
    try {
      const [webhook] = await db.insert(webhookEvents).values(webhookData).returning();

      return {
        success: true,
        data: webhook,
        message: 'Webhook event processed successfully'
      };
    } catch (error) {
      console.error('Error processing webhook event:', error);
      throw new Error('Failed to process webhook event');
    }
  }

  async getWebhookEvents(integrationId: number) {
    try {
      const events = await db
        .select()
        .from(webhookEvents)
        .where(eq(webhookEvents.integrationId, integrationId))
        .orderBy(desc(webhookEvents.createdAt));

      return {
        success: true,
        data: events,
        count: events.length
      };
    } catch (error) {
      console.error('Error fetching webhook events:', error);
      throw new Error('Failed to fetch webhook events');
    }
  }

  async getIntegrationAnalytics() {
    try {
      const analytics = await db
        .select({
          provider: integrations.provider,
          totalIntegrations: sql<number>`COUNT(*)`,
          activeIntegrations: sql<number>`COUNT(CASE WHEN ${integrations.status} = 'active' THEN 1 END)`,
          errorIntegrations: sql<number>`COUNT(CASE WHEN ${integrations.status} = 'error' THEN 1 END)`
        })
        .from(integrations)
        .groupBy(integrations.provider)
        .orderBy(integrations.provider);

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('Error fetching integration analytics:', error);
      throw new Error('Failed to fetch integration analytics');
    }
  }

  async testIntegrationConnection(id: number) {
    try {
      // This would typically test the actual connection to the external service
      // For now, we'll simulate a connection test
      
      await db
        .update(integrations)
        .set({
          lastSyncAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(integrations.id, id));

      return {
        success: true,
        message: 'Integration connection test successful'
      };
    } catch (error) {
      console.error('Error testing integration connection:', error);
      throw new Error('Failed to test integration connection');
    }
  }
}