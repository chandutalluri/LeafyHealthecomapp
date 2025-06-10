import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, sql, and } from 'drizzle-orm';
import { databaseConnection } from '@shared/database/connection';
import { vendors, vendorProducts, vendorPayouts, products, users, type Vendor, type InsertVendor } from '@shared/schema';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';

@Injectable()
export class VendorService {
  private db = databaseConnection.getDatabase();

  async createVendor(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendorData: InsertVendor = {
      businessName: createVendorDto.businessName,
      contactEmail: createVendorDto.contactEmail,
      contactPhone: createVendorDto.contactPhone,
      businessAddress: createVendorDto.businessAddress,
      licenseNumber: createVendorDto.licenseNumber,
      taxId: createVendorDto.taxId,
      description: createVendorDto.description,
      website: createVendorDto.website,
      categories: JSON.stringify(createVendorDto.categories),
      commissionRate: createVendorDto.commissionRate,
      isVerified: createVendorDto.isVerified || false,
      isActive: createVendorDto.isActive !== false,
      createdBy: 1 // Default admin user
    };

    const [newVendor] = await this.db
      .insert(vendors)
      .values(vendorData)
      .returning();

    return newVendor;
  }

  async getAllVendors(): Promise<Vendor[]> {
    return await this.db
      .select()
      .from(vendors)
      .orderBy(desc(vendors.createdAt));
  }

  async getVendorById(id: number): Promise<Vendor> {
    const [vendor] = await this.db
      .select()
      .from(vendors)
      .where(eq(vendors.id, id));

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async updateVendor(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const updateData: any = { ...updateVendorDto };
    
    if (updateVendorDto.categories) {
      updateData.categories = JSON.stringify(updateVendorDto.categories);
    }
    
    updateData.updatedAt = new Date();
    updateData.updatedBy = 1; // Default admin user

    const [updatedVendor] = await this.db
      .update(vendors)
      .set(updateData)
      .where(eq(vendors.id, id))
      .returning();

    if (!updatedVendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return updatedVendor;
  }

  async deleteVendor(id: number): Promise<{ message: string }> {
    const [deletedVendor] = await this.db
      .delete(vendors)
      .where(eq(vendors.id, id))
      .returning();

    if (!deletedVendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return { message: `Vendor ${deletedVendor.businessName} deleted successfully` };
  }

  async verifyVendor(id: number): Promise<Vendor> {
    const [updatedVendor] = await this.db
      .update(vendors)
      .set({
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: 1, // Default admin user
        updatedAt: new Date()
      })
      .where(eq(vendors.id, id))
      .returning();

    if (!updatedVendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return updatedVendor;
  }

  async getVendorStats(): Promise<any> {
    const totalVendors = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(vendors);

    const verifiedVendors = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(vendors)
      .where(eq(vendors.isVerified, true));

    const activeVendors = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(vendors)
      .where(eq(vendors.isActive, true));

    const recentVendors = await this.db
      .select()
      .from(vendors)
      .orderBy(desc(vendors.createdAt))
      .limit(5);

    return {
      totalVendors: totalVendors[0]?.count || 0,
      verifiedVendors: verifiedVendors[0]?.count || 0,
      activeVendors: activeVendors[0]?.count || 0,
      recentVendors,
      lastUpdated: new Date().toISOString()
    };
  }

  async getVendorsByStatus(status: 'verified' | 'unverified' | 'active' | 'inactive'): Promise<Vendor[]> {
    let condition;
    
    switch (status) {
      case 'verified':
        condition = eq(vendors.isVerified, true);
        break;
      case 'unverified':
        condition = eq(vendors.isVerified, false);
        break;
      case 'active':
        condition = eq(vendors.isActive, true);
        break;
      case 'inactive':
        condition = eq(vendors.isActive, false);
        break;
      default:
        throw new Error('Invalid status parameter');
    }

    return await this.db
      .select()
      .from(vendors)
      .where(condition)
      .orderBy(desc(vendors.createdAt));
  }
}