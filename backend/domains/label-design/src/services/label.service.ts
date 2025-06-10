import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql } from 'drizzle-orm';
import { 
  db, 
  labelTemplates, 
  generatedLabels, 
  labelBatches, 
  printJobs, 
  barcodeData,
  type LabelTemplate,
  type InsertLabelTemplate,
  type GeneratedLabel,
  type InsertGeneratedLabel
} from '../database';

@Injectable()
export class LabelService {

  async createTemplate(templateData: InsertLabelTemplate) {
    try {
      const [template] = await db.insert(labelTemplates).values(templateData).returning();

      return {
        success: true,
        data: template,
        message: 'Label template created successfully'
      };
    } catch (error) {
      console.error('Error creating label template:', error);
      throw new Error('Failed to create label template');
    }
  }

  async getAllTemplates(templateType?: string) {
    try {
      let query = db.select().from(labelTemplates).where(eq(labelTemplates.isActive, true)).orderBy(labelTemplates.name);

      if (templateType) {
        query = query.where(and(eq(labelTemplates.templateType, templateType), eq(labelTemplates.isActive, true)));
      }

      const templates = await query;

      return {
        success: true,
        data: templates,
        count: templates.length
      };
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw new Error('Failed to fetch templates');
    }
  }

  async getTemplateById(id: number) {
    try {
      const [template] = await db
        .select()
        .from(labelTemplates)
        .where(eq(labelTemplates.id, id));

      if (!template) {
        throw new NotFoundException(`Template with ID ${id} not found`);
      }

      return {
        success: true,
        data: template
      };
    } catch (error) {
      console.error('Error fetching template:', error);
      throw new Error('Failed to fetch template');
    }
  }

  async generateLabel(labelData: InsertGeneratedLabel) {
    try {
      const [label] = await db.insert(generatedLabels).values(labelData).returning();

      return {
        success: true,
        data: label,
        message: 'Label generated successfully'
      };
    } catch (error) {
      console.error('Error generating label:', error);
      throw new Error('Failed to generate label');
    }
  }

  async getGeneratedLabels(entityType?: string, entityId?: number) {
    try {
      let query = db.select().from(generatedLabels).orderBy(desc(generatedLabels.createdAt));

      if (entityType && entityId) {
        query = query.where(and(
          eq(generatedLabels.entityType, entityType),
          eq(generatedLabels.entityId, entityId)
        ));
      }

      const labels = await query;

      return {
        success: true,
        data: labels,
        count: labels.length
      };
    } catch (error) {
      console.error('Error fetching generated labels:', error);
      throw new Error('Failed to fetch generated labels');
    }
  }

  async createBatch(batchData: any) {
    try {
      const batchNumber = `BATCH-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
      
      const [batch] = await db.insert(labelBatches).values({
        ...batchData,
        batchNumber
      }).returning();

      return {
        success: true,
        data: batch,
        message: 'Label batch created successfully'
      };
    } catch (error) {
      console.error('Error creating label batch:', error);
      throw new Error('Failed to create label batch');
    }
  }

  async getBatches() {
    try {
      const batches = await db
        .select()
        .from(labelBatches)
        .orderBy(desc(labelBatches.createdAt));

      return {
        success: true,
        data: batches,
        count: batches.length
      };
    } catch (error) {
      console.error('Error fetching label batches:', error);
      throw new Error('Failed to fetch label batches');
    }
  }

  async createPrintJob(jobData: any) {
    try {
      const jobNumber = `PRINT-${Date.now().toString().slice(-6)}`;
      
      const [job] = await db.insert(printJobs).values({
        ...jobData,
        jobNumber
      }).returning();

      return {
        success: true,
        data: job,
        message: 'Print job created successfully'
      };
    } catch (error) {
      console.error('Error creating print job:', error);
      throw new Error('Failed to create print job');
    }
  }

  async getPrintJobs(status?: string) {
    try {
      let query = db.select().from(printJobs).orderBy(desc(printJobs.createdAt));

      if (status) {
        query = query.where(eq(printJobs.status, status));
      }

      const jobs = await query;

      return {
        success: true,
        data: jobs,
        count: jobs.length
      };
    } catch (error) {
      console.error('Error fetching print jobs:', error);
      throw new Error('Failed to fetch print jobs');
    }
  }

  async generateBarcode(entityType: string, entityId: number, barcodeType: string) {
    try {
      const barcodeValue = this.generateBarcodeValue(entityType, entityId);
      
      const [barcode] = await db.insert(barcodeData).values({
        entityType,
        entityId,
        barcodeType,
        barcodeValue
      }).returning();

      return {
        success: true,
        data: barcode,
        message: 'Barcode generated successfully'
      };
    } catch (error) {
      console.error('Error generating barcode:', error);
      throw new Error('Failed to generate barcode');
    }
  }

  async getBarcodeData(entityType: string, entityId: number) {
    try {
      const [barcode] = await db
        .select()
        .from(barcodeData)
        .where(and(
          eq(barcodeData.entityType, entityType),
          eq(barcodeData.entityId, entityId),
          eq(barcodeData.isActive, true)
        ));

      return {
        success: true,
        data: barcode
      };
    } catch (error) {
      console.error('Error fetching barcode data:', error);
      throw new Error('Failed to fetch barcode data');
    }
  }

  private generateBarcodeValue(entityType: string, entityId: number): string {
    const prefix = entityType.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${entityId.toString().padStart(6, '0')}${timestamp}`;
  }
}