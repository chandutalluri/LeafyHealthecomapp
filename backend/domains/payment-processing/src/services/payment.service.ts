import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import { db, payments, paymentMethods, refunds, paymentLogs, type Payment, type InsertPayment } from '../database';
import { CreatePaymentDto, ProcessPaymentDto } from '../dto/create-payment.dto';
import { CreateRefundDto, CreatePaymentMethodDto } from '../dto/create-refund.dto';

@Injectable()
export class PaymentService {
  // Create a new payment record
  async createPayment(createPaymentDto: CreatePaymentDto, userId: number) {
    try {
      const paymentData: InsertPayment = {
        orderId: createPaymentDto.orderId,
        customerId: createPaymentDto.customerId,
        amount: createPaymentDto.amount.toString(),
        currency: createPaymentDto.currency || 'INR',
        paymentMethod: createPaymentDto.paymentMethod,
        paymentStatus: 'pending',
        gatewayProvider: this.getGatewayProvider(createPaymentDto.paymentMethod),
      };

      const [payment] = await db.insert(payments).values(paymentData).returning();

      // Log the payment creation
      await db.insert(paymentLogs).values({
        paymentId: payment.id,
        action: 'payment_created',
        requestData: createPaymentDto,
        statusCode: 200,
      });

      return {
        success: true,
        message: 'Payment created successfully',
        data: payment
      };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
    }
  }

  // Process a payment through gateway
  async processPayment(paymentId: number, processDto: ProcessPaymentDto, userId: number) {
    try {
      const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId));
      
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${paymentId} not found`);
      }

      if (payment.paymentStatus !== 'pending') {
        throw new BadRequestException(`Payment is already ${payment.paymentStatus}`);
      }

      // Simulate payment gateway processing based on method
      const isSuccessful = this.simulateGatewayResponse(payment.paymentMethod);
      const transactionId = isSuccessful ? `txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}` : null;
      const gatewayReference = processDto.paymentIntentId || `ref_${Date.now()}`;

      const [updatedPayment] = await db
        .update(payments)
        .set({
          paymentStatus: isSuccessful ? 'completed' : 'failed',
          transactionId,
          gatewayReference,
          failureReason: isSuccessful ? null : 'Gateway processing failed',
          processedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(payments.id, paymentId))
        .returning();

      // Log the payment processing
      await db.insert(paymentLogs).values({
        paymentId: payment.id,
        action: 'payment_processed',
        requestData: processDto,
        responseData: { transactionId, gatewayReference, status: updatedPayment.paymentStatus },
        statusCode: isSuccessful ? 200 : 400,
        errorMessage: isSuccessful ? null : 'Payment processing failed',
      });

      return {
        success: isSuccessful,
        message: isSuccessful ? 'Payment processed successfully' : 'Payment processing failed',
        data: updatedPayment
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error('Failed to process payment');
    }
  }

  // Get all payments
  async findAllPayments(customerId?: number) {
    try {
      const query = db.select().from(payments).orderBy(desc(payments.createdAt));
      
      if (customerId) {
        return await query.where(eq(payments.customerId, customerId));
      }
      
      return await query;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new Error('Failed to fetch payments');
    }
  }

  // Get payment by ID
  async findPaymentById(id: number) {
    try {
      const [payment] = await db.select().from(payments).where(eq(payments.id, id));
      
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      
      return payment;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw new Error('Failed to fetch payment');
    }
  }

  // Create refund
  async createRefund(createRefundDto: CreateRefundDto, userId: number) {
    try {
      const [payment] = await db.select().from(payments).where(eq(payments.id, createRefundDto.paymentId));
      
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${createRefundDto.paymentId} not found`);
      }

      if (payment.paymentStatus !== 'completed') {
        throw new BadRequestException('Cannot refund a payment that is not completed');
      }

      const refundData = {
        paymentId: createRefundDto.paymentId,
        orderId: payment.orderId,
        amount: createRefundDto.amount.toString(),
        reason: createRefundDto.reason,
        refundStatus: 'pending' as const,
      };

      const [refund] = await db.insert(refunds).values(refundData).returning();

      // Log the refund creation
      await db.insert(paymentLogs).values({
        paymentId: payment.id,
        action: 'refund_created',
        requestData: createRefundDto,
        statusCode: 200,
      });

      return {
        success: true,
        message: 'Refund created successfully',
        data: refund
      };
    } catch (error) {
      console.error('Error creating refund:', error);
      throw new Error('Failed to create refund');
    }
  }

  // Save payment method
  async savePaymentMethod(createMethodDto: CreatePaymentMethodDto, customerId: number) {
    try {
      // If this is set as default, unset other defaults first
      if (createMethodDto.isDefault) {
        await db
          .update(paymentMethods)
          .set({ isDefault: false })
          .where(eq(paymentMethods.customerId, customerId));
      }

      const methodData = {
        customerId,
        methodType: createMethodDto.methodType,
        isDefault: createMethodDto.isDefault || false,
        details: createMethodDto.details, // Should be encrypted in production
      };

      const [paymentMethod] = await db.insert(paymentMethods).values(methodData).returning();

      return {
        success: true,
        message: 'Payment method saved successfully',
        data: paymentMethod
      };
    } catch (error) {
      console.error('Error saving payment method:', error);
      throw new Error('Failed to save payment method');
    }
  }

  // Get customer payment methods
  async getCustomerPaymentMethods(customerId: number) {
    try {
      return await db
        .select()
        .from(paymentMethods)
        .where(and(eq(paymentMethods.customerId, customerId), eq(paymentMethods.isActive, true)))
        .orderBy(desc(paymentMethods.isDefault), desc(paymentMethods.createdAt));
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }
  }

  // Helper methods
  private getGatewayProvider(paymentMethod: string): string {
    const methodMapping = {
      'upi': 'Razorpay',
      'card': 'Razorpay',
      'netbanking': 'Razorpay',
      'wallet': 'Paytm',
      'cod': 'Internal'
    };
    return methodMapping[paymentMethod] || 'Razorpay';
  }

  private simulateGatewayResponse(paymentMethod: string): boolean {
    // Different success rates for different payment methods
    const successRates = {
      'upi': 0.95,
      'card': 0.90,
      'netbanking': 0.85,
      'wallet': 0.92,
      'cod': 1.0
    };
    const rate = successRates[paymentMethod] || 0.85;
    return Math.random() < rate;
  }
}