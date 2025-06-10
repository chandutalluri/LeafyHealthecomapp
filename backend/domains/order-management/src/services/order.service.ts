import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { db, orders, orderItems, orderStatusHistory, products, inventory } from '../database';
import { eq, desc, and, sql } from 'drizzle-orm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto, UpdatePaymentStatusDto } from '../dto/update-order.dto';

@Injectable()
export class OrderService {

  async createOrder(createOrderDto: CreateOrderDto, createdBy: number) {
    const { items, ...orderData } = createOrderDto;

    // Validate products and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      // Check inventory availability
      const [inventoryRecord] = await db.select().from(inventory).where(eq(inventory.productId, item.productId));
      if (inventoryRecord && inventoryRecord.quantity < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}. Available: ${inventoryRecord.quantity}, Requested: ${item.quantity}`);
      }

      const itemTotal = parseFloat(item.unitPrice) * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        ...item,
        productName: product.name,
        productSku: product.sku,
        totalPrice: itemTotal.toString()
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create order
    const [newOrder] = await db.insert(orders).values({
      orderNumber,
      ...orderData,
      totalAmount: totalAmount.toString(),
      orderStatus: 'PENDING',
      paymentStatus: 'PENDING',
      createdBy
    }).returning();

    // Create order items
    const orderItemsData = validatedItems.map(item => ({
      orderId: newOrder.id,
      productId: item.productId,
      productName: item.productName,
      productSku: item.productSku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      notes: item.notes
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Create initial status history
    await db.insert(orderStatusHistory).values({
      orderId: newOrder.id,
      newStatus: 'PENDING',
      statusReason: 'Order created',
      changedBy: createdBy
    });

    // Reserve inventory
    for (const item of validatedItems) {
      const [currentInventory] = await db.select().from(inventory).where(eq(inventory.productId, item.productId));
      if (currentInventory) {
        await db.update(inventory)
          .set({
            reservedQuantity: (currentInventory.reservedQuantity || 0) + item.quantity,
            lastUpdated: new Date(),
            updatedBy: createdBy
          })
          .where(eq(inventory.productId, item.productId));
      }
    }

    return {
      success: true,
      message: 'Order created successfully',
      data: {
        ...newOrder,
        items: orderItemsData
      }
    };
  }

  async findAll() {
    const allOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerName: orders.customerName,
        customerEmail: orders.customerEmail,
        orderStatus: orders.orderStatus,
        paymentStatus: orders.paymentStatus,
        totalAmount: orders.totalAmount,
        orderDate: orders.orderDate,
        orderType: orders.orderType
      })
      .from(orders)
      .orderBy(desc(orders.createdAt));

    return {
      success: true,
      message: 'Orders retrieved successfully',
      data: allOrders
    };
  }

  async findOne(id: number) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Get order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    // Get status history
    const statusHistory = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, id))
      .orderBy(desc(orderStatusHistory.changedAt));

    return {
      success: true,
      message: 'Order retrieved successfully',
      data: {
        ...order,
        items,
        statusHistory
      }
    };
  }

  async updateStatus(id: number, updateStatusDto: UpdateOrderStatusDto, changedBy: number) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const previousStatus = order.orderStatus;

    // Update order status
    await db.update(orders)
      .set({
        orderStatus: updateStatusDto.orderStatus,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id));

    // Add to status history
    await db.insert(orderStatusHistory).values({
      orderId: id,
      previousStatus,
      newStatus: updateStatusDto.orderStatus,
      statusReason: updateStatusDto.statusReason,
      changedBy
    });

    // Handle inventory adjustments for specific status changes
    if (updateStatusDto.orderStatus === 'CONFIRMED') {
      await this.processInventoryDeduction(id);
    } else if (updateStatusDto.orderStatus === 'CANCELLED') {
      await this.releaseReservedInventory(id);
    }

    return {
      success: true,
      message: 'Order status updated successfully',
      data: {
        orderId: id,
        previousStatus,
        newStatus: updateStatusDto.orderStatus
      }
    };
  }

  async updatePaymentStatus(id: number, updatePaymentDto: UpdatePaymentStatusDto) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await db.update(orders)
      .set({
        paymentStatus: updatePaymentDto.paymentStatus,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id));

    return {
      success: true,
      message: 'Payment status updated successfully',
      data: {
        orderId: id,
        paymentStatus: updatePaymentDto.paymentStatus
      }
    };
  }

  async getOrdersByStatus(status: string) {
    const ordersByStatus = await db
      .select()
      .from(orders)
      .where(eq(orders.orderStatus, status))
      .orderBy(desc(orders.orderDate));

    return {
      success: true,
      message: `Orders with status ${status} retrieved successfully`,
      data: ordersByStatus
    };
  }

  async getOrdersByCustomer(customerId: number) {
    const customerOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.orderDate));

    return {
      success: true,
      message: 'Customer orders retrieved successfully',
      data: customerOrders
    };
  }

  private async processInventoryDeduction(orderId: number) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

    for (const item of items) {
      const [currentInventory] = await db.select().from(inventory).where(eq(inventory.productId, item.productId));
      if (currentInventory) {
        await db.update(inventory)
          .set({
            quantity: currentInventory.quantity - item.quantity,
            reservedQuantity: (currentInventory.reservedQuantity || 0) - item.quantity,
            lastUpdated: new Date()
          })
          .where(eq(inventory.productId, item.productId));
      }
    }
  }

  private async releaseReservedInventory(orderId: number) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

    for (const item of items) {
      const [currentInventory] = await db.select().from(inventory).where(eq(inventory.productId, item.productId));
      if (currentInventory) {
        await db.update(inventory)
          .set({
            reservedQuantity: Math.max(0, (currentInventory.reservedQuantity || 0) - item.quantity),
            lastUpdated: new Date()
          })
          .where(eq(inventory.productId, item.productId));
      }
    }
  }
}