import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql } from 'drizzle-orm';
import { 
  db, 
  shippingMethods, 
  shipments, 
  trackingEvents, 
  deliveryRoutes, 
  deliveryAttempts, 
  shippingZones,
  type ShippingMethod,
  type InsertShippingMethod,
  type Shipment,
  type InsertShipment
} from '../database';

@Injectable()
export class ShippingService {

  async createShippingMethod(methodData: InsertShippingMethod) {
    try {
      const [method] = await db.insert(shippingMethods).values(methodData).returning();

      return {
        success: true,
        data: method,
        message: 'Shipping method created successfully'
      };
    } catch (error) {
      console.error('Error creating shipping method:', error);
      throw new Error('Failed to create shipping method');
    }
  }

  async getShippingMethods() {
    try {
      const methods = await db
        .select()
        .from(shippingMethods)
        .where(eq(shippingMethods.isActive, true))
        .orderBy(shippingMethods.sortOrder, shippingMethods.name);

      return {
        success: true,
        data: methods,
        count: methods.length
      };
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      throw new Error('Failed to fetch shipping methods');
    }
  }

  async createShipment(shipmentData: InsertShipment) {
    try {
      const shipmentNumber = `SHIP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
      
      const [shipment] = await db.insert(shipments).values({
        ...shipmentData,
        shipmentNumber
      }).returning();

      // Create initial tracking event
      await this.addTrackingEvent(shipment.id, {
        eventType: 'created',
        eventDescription: 'Shipment created',
        eventTime: new Date()
      });

      return {
        success: true,
        data: shipment,
        message: 'Shipment created successfully'
      };
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw new Error('Failed to create shipment');
    }
  }

  async getShipments(status?: string) {
    try {
      let query = db.select().from(shipments).orderBy(desc(shipments.createdAt));

      if (status) {
        query = query.where(eq(shipments.status, status));
      }

      const allShipments = await query;

      return {
        success: true,
        data: allShipments,
        count: allShipments.length
      };
    } catch (error) {
      console.error('Error fetching shipments:', error);
      throw new Error('Failed to fetch shipments');
    }
  }

  async getShipmentById(id: number) {
    try {
      const [shipment] = await db
        .select()
        .from(shipments)
        .where(eq(shipments.id, id));

      if (!shipment) {
        throw new NotFoundException(`Shipment with ID ${id} not found`);
      }

      // Get tracking events
      const events = await db
        .select()
        .from(trackingEvents)
        .where(eq(trackingEvents.shipmentId, id))
        .orderBy(trackingEvents.eventTime);

      return {
        success: true,
        data: {
          ...shipment,
          trackingEvents: events
        }
      };
    } catch (error) {
      console.error('Error fetching shipment:', error);
      throw new Error('Failed to fetch shipment');
    }
  }

  async updateShipmentStatus(id: number, status: string, additionalData?: any) {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'picked' && additionalData?.pickedUpAt) {
        updateData.pickedUpAt = additionalData.pickedUpAt;
      }

      if (status === 'delivered') {
        updateData.deliveredAt = new Date();
        updateData.deliveredBy = additionalData?.deliveredBy;
        updateData.recipientName = additionalData?.recipientName;
      }

      const [updatedShipment] = await db
        .update(shipments)
        .set(updateData)
        .where(eq(shipments.id, id))
        .returning();

      if (!updatedShipment) {
        throw new NotFoundException(`Shipment with ID ${id} not found`);
      }

      // Add tracking event
      await this.addTrackingEvent(id, {
        eventType: status,
        eventDescription: `Shipment ${status}`,
        eventTime: new Date(),
        location: additionalData?.location
      });

      return {
        success: true,
        data: updatedShipment,
        message: `Shipment status updated to ${status}`
      };
    } catch (error) {
      console.error('Error updating shipment status:', error);
      throw new Error('Failed to update shipment status');
    }
  }

  async addTrackingEvent(shipmentId: number, eventData: any) {
    try {
      const [event] = await db.insert(trackingEvents).values({
        shipmentId,
        ...eventData
      }).returning();

      return {
        success: true,
        data: event,
        message: 'Tracking event added successfully'
      };
    } catch (error) {
      console.error('Error adding tracking event:', error);
      throw new Error('Failed to add tracking event');
    }
  }

  async getShipmentTracking(shipmentNumber: string) {
    try {
      const [shipment] = await db
        .select()
        .from(shipments)
        .where(eq(shipments.shipmentNumber, shipmentNumber));

      if (!shipment) {
        throw new NotFoundException(`Shipment with number ${shipmentNumber} not found`);
      }

      const events = await db
        .select()
        .from(trackingEvents)
        .where(and(
          eq(trackingEvents.shipmentId, shipment.id),
          eq(trackingEvents.isPublic, true)
        ))
        .orderBy(trackingEvents.eventTime);

      return {
        success: true,
        data: {
          shipmentNumber: shipment.shipmentNumber,
          status: shipment.status,
          estimatedDeliveryAt: shipment.estimatedDeliveryAt,
          deliveredAt: shipment.deliveredAt,
          trackingEvents: events
        }
      };
    } catch (error) {
      console.error('Error fetching shipment tracking:', error);
      throw new Error('Failed to fetch shipment tracking');
    }
  }

  async createDeliveryRoute(routeData: any) {
    try {
      const [route] = await db.insert(deliveryRoutes).values(routeData).returning();

      return {
        success: true,
        data: route,
        message: 'Delivery route created successfully'
      };
    } catch (error) {
      console.error('Error creating delivery route:', error);
      throw new Error('Failed to create delivery route');
    }
  }

  async getDeliveryRoutes(driverId?: number) {
    try {
      let query = db.select().from(deliveryRoutes).orderBy(desc(deliveryRoutes.routeDate));

      if (driverId) {
        query = query.where(eq(deliveryRoutes.driverId, driverId));
      }

      const routes = await query;

      return {
        success: true,
        data: routes,
        count: routes.length
      };
    } catch (error) {
      console.error('Error fetching delivery routes:', error);
      throw new Error('Failed to fetch delivery routes');
    }
  }

  async recordDeliveryAttempt(attemptData: any) {
    try {
      const [attempt] = await db.insert(deliveryAttempts).values(attemptData).returning();

      // Update shipment status if delivery was successful
      if (attemptData.status === 'successful') {
        await this.updateShipmentStatus(attemptData.shipmentId, 'delivered', {
          deliveredBy: attemptData.driverId,
          recipientName: attemptData.recipientName
        });
      }

      return {
        success: true,
        data: attempt,
        message: 'Delivery attempt recorded successfully'
      };
    } catch (error) {
      console.error('Error recording delivery attempt:', error);
      throw new Error('Failed to record delivery attempt');
    }
  }

  async getDeliveryAttempts(shipmentId: number) {
    try {
      const attempts = await db
        .select()
        .from(deliveryAttempts)
        .where(eq(deliveryAttempts.shipmentId, shipmentId))
        .orderBy(deliveryAttempts.attemptDate);

      return {
        success: true,
        data: attempts,
        count: attempts.length
      };
    } catch (error) {
      console.error('Error fetching delivery attempts:', error);
      throw new Error('Failed to fetch delivery attempts');
    }
  }

  async calculateShippingCost(weight: number, distance: number, shippingMethodId: number) {
    try {
      const [method] = await db
        .select()
        .from(shippingMethods)
        .where(eq(shippingMethods.id, shippingMethodId));

      if (!method) {
        throw new NotFoundException(`Shipping method with ID ${shippingMethodId} not found`);
      }

      let cost = parseFloat(method.baseCost.toString());
      
      if (method.costPerKg && weight) {
        cost += parseFloat(method.costPerKg.toString()) * weight;
      }
      
      if (method.costPerKm && distance) {
        cost += parseFloat(method.costPerKm.toString()) * distance;
      }

      return {
        success: true,
        data: {
          shippingCost: cost.toFixed(2),
          estimatedDays: method.estimatedDays,
          shippingMethod: method.name
        }
      };
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      throw new Error('Failed to calculate shipping cost');
    }
  }
}