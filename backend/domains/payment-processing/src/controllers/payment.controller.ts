import { Controller, Get, Post, Put, Body, Param, Query, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto, ProcessPaymentDto } from '../dto/create-payment.dto';
import { CreateRefundDto, CreatePaymentMethodDto } from '../dto/create-refund.dto';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Authentication required for payment operations');
    }
    const userId = req.user.id;
    return this.paymentService.createPayment(createPaymentDto, userId);
  }

  @Post(':id/process')
  @ApiOperation({ summary: 'Process a payment through gateway' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  async process(
    @Param('id') id: string,
    @Body() processPaymentDto: ProcessPaymentDto,
    @Request() req
  ) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Authentication required for payment processing');
    }
    const userId = req.user.id;
    return this.paymentService.processPayment(parseInt(id), processPaymentDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('status') status?: string
  ) {
    return this.paymentService.findAll(
      customerId ? parseInt(customerId) : undefined,
      status
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.paymentService.findOne(parseInt(id));
  }

  @Post('refunds')
  @ApiOperation({ summary: 'Create a refund' })
  @ApiResponse({ status: 201, description: 'Refund created successfully' })
  async createRefund(@Body() createRefundDto: CreateRefundDto, @Request() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Authentication required for refund operations');
    }
    const userId = req.user.id;
    return this.paymentService.createRefund(createRefundDto, userId);
  }

  @Post('methods')
  @ApiOperation({ summary: 'Create a payment method' })
  @ApiResponse({ status: 201, description: 'Payment method created successfully' })
  async createPaymentMethod(@Body() createMethodDto: CreatePaymentMethodDto) {
    return this.paymentService.createPaymentMethod(createMethodDto);
  }

  @Get('methods/customer/:customerId')
  @ApiOperation({ summary: 'Get customer payment methods' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully' })
  async getCustomerPaymentMethods(@Param('customerId') customerId: string) {
    return this.paymentService.getCustomerPaymentMethods(parseInt(customerId));
  }
}