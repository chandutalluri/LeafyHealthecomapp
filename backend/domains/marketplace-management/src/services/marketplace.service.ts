import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql } from 'drizzle-orm';
import { 
  db, 
  marketplaceVendors, 
  vendorProducts, 
  commissionTracking, 
  vendorReviews, 
  marketplaceAnalytics,
  type MarketplaceVendor,
  type InsertMarketplaceVendor,
  type VendorProduct,
  type InsertVendorProduct
} from '../database';

@Injectable()
export class MarketplaceService {

  async createVendor(vendorData: InsertMarketplaceVendor) {
    try {
      const vendorCode = `VEN-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
      
      const [vendor] = await db.insert(marketplaceVendors).values({
        ...vendorData,
        vendorCode
      }).returning();

      return {
        success: true,
        data: vendor,
        message: 'Vendor created successfully'
      };
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw new Error('Failed to create vendor');
    }
  }

  async getAllVendors(status?: string) {
    try {
      let query = db.select().from(marketplaceVendors).orderBy(desc(marketplaceVendors.createdAt));

      if (status) {
        query = query.where(eq(marketplaceVendors.status, status));
      }

      const vendors = await query;

      return {
        success: true,
        data: vendors,
        count: vendors.length
      };
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw new Error('Failed to fetch vendors');
    }
  }

  async getVendorById(id: number) {
    try {
      const [vendor] = await db
        .select()
        .from(marketplaceVendors)
        .where(eq(marketplaceVendors.id, id));

      if (!vendor) {
        throw new NotFoundException(`Vendor with ID ${id} not found`);
      }

      return {
        success: true,
        data: vendor
      };
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw new Error('Failed to fetch vendor');
    }
  }

  async approveVendor(id: number, approvedBy: number) {
    try {
      const [approvedVendor] = await db
        .update(marketplaceVendors)
        .set({
          status: 'approved',
          approvedBy,
          approvedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(marketplaceVendors.id, id))
        .returning();

      if (!approvedVendor) {
        throw new NotFoundException(`Vendor with ID ${id} not found`);
      }

      return {
        success: true,
        data: approvedVendor,
        message: 'Vendor approved successfully'
      };
    } catch (error) {
      console.error('Error approving vendor:', error);
      throw new Error('Failed to approve vendor');
    }
  }

  async addVendorProduct(productData: InsertVendorProduct) {
    try {
      const [vendorProduct] = await db.insert(vendorProducts).values(productData).returning();

      return {
        success: true,
        data: vendorProduct,
        message: 'Vendor product added successfully'
      };
    } catch (error) {
      console.error('Error adding vendor product:', error);
      throw new Error('Failed to add vendor product');
    }
  }

  async getVendorProducts(vendorId: number) {
    try {
      const products = await db
        .select()
        .from(vendorProducts)
        .where(and(
          eq(vendorProducts.vendorId, vendorId),
          eq(vendorProducts.isActive, true)
        ))
        .orderBy(vendorProducts.createdAt);

      return {
        success: true,
        data: products,
        count: products.length
      };
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      throw new Error('Failed to fetch vendor products');
    }
  }

  async updateProductPricing(vendorProductId: number, vendorPrice: number, marketPrice: number) {
    try {
      const [updatedProduct] = await db
        .update(vendorProducts)
        .set({
          vendorPrice,
          marketPrice,
          updatedAt: new Date()
        })
        .where(eq(vendorProducts.id, vendorProductId))
        .returning();

      if (!updatedProduct) {
        throw new NotFoundException(`Vendor product with ID ${vendorProductId} not found`);
      }

      return {
        success: true,
        data: updatedProduct,
        message: 'Product pricing updated successfully'
      };
    } catch (error) {
      console.error('Error updating product pricing:', error);
      throw new Error('Failed to update product pricing');
    }
  }

  async trackCommission(commissionData: any) {
    try {
      const [commission] = await db.insert(commissionTracking).values(commissionData).returning();

      return {
        success: true,
        data: commission,
        message: 'Commission tracked successfully'
      };
    } catch (error) {
      console.error('Error tracking commission:', error);
      throw new Error('Failed to track commission');
    }
  }

  async getVendorCommissions(vendorId: number) {
    try {
      const commissions = await db
        .select()
        .from(commissionTracking)
        .where(eq(commissionTracking.vendorId, vendorId))
        .orderBy(desc(commissionTracking.createdAt));

      const totalCommission = await db
        .select({
          total: sql<string>`SUM(${commissionTracking.commissionAmount})`,
          paid: sql<string>`SUM(CASE WHEN ${commissionTracking.status} = 'paid' THEN ${commissionTracking.commissionAmount} ELSE 0 END)`,
          pending: sql<string>`SUM(CASE WHEN ${commissionTracking.status} = 'pending' THEN ${commissionTracking.commissionAmount} ELSE 0 END)`
        })
        .from(commissionTracking)
        .where(eq(commissionTracking.vendorId, vendorId));

      return {
        success: true,
        data: {
          commissions,
          summary: totalCommission[0]
        }
      };
    } catch (error) {
      console.error('Error fetching vendor commissions:', error);
      throw new Error('Failed to fetch vendor commissions');
    }
  }

  async addVendorReview(reviewData: any) {
    try {
      const [review] = await db.insert(vendorReviews).values(reviewData).returning();

      // Update vendor rating
      await this.updateVendorRating(reviewData.vendorId);

      return {
        success: true,
        data: review,
        message: 'Vendor review added successfully'
      };
    } catch (error) {
      console.error('Error adding vendor review:', error);
      throw new Error('Failed to add vendor review');
    }
  }

  async getVendorReviews(vendorId: number) {
    try {
      const reviews = await db
        .select()
        .from(vendorReviews)
        .where(and(
          eq(vendorReviews.vendorId, vendorId),
          eq(vendorReviews.isVisible, true)
        ))
        .orderBy(desc(vendorReviews.createdAt));

      return {
        success: true,
        data: reviews,
        count: reviews.length
      };
    } catch (error) {
      console.error('Error fetching vendor reviews:', error);
      throw new Error('Failed to fetch vendor reviews');
    }
  }

  async getMarketplaceAnalytics(vendorId?: number) {
    try {
      let query = db
        .select({
          vendorId: marketplaceAnalytics.vendorId,
          totalOrders: sql<number>`SUM(${marketplaceAnalytics.totalOrders})`,
          totalRevenue: sql<string>`SUM(${marketplaceAnalytics.totalRevenue})`,
          totalCommission: sql<string>`SUM(${marketplaceAnalytics.totalCommission})`,
          avgOrderValue: sql<string>`AVG(${marketplaceAnalytics.avgOrderValue})`
        })
        .from(marketplaceAnalytics);

      if (vendorId) {
        query = query.where(eq(marketplaceAnalytics.vendorId, vendorId));
      }

      const analytics = await query.groupBy(marketplaceAnalytics.vendorId);

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('Error fetching marketplace analytics:', error);
      throw new Error('Failed to fetch marketplace analytics');
    }
  }

  private async updateVendorRating(vendorId: number) {
    try {
      const [ratingData] = await db
        .select({
          averageRating: sql<string>`AVG(${vendorReviews.rating})`,
          totalReviews: sql<number>`COUNT(*)`
        })
        .from(vendorReviews)
        .where(and(
          eq(vendorReviews.vendorId, vendorId),
          eq(vendorReviews.isVisible, true)
        ));

      await db
        .update(marketplaceVendors)
        .set({
          rating: parseFloat(ratingData.averageRating),
          totalReviews: ratingData.totalReviews,
          updatedAt: new Date()
        })
        .where(eq(marketplaceVendors.id, vendorId));
    } catch (error) {
      console.error('Error updating vendor rating:', error);
    }
  }
}