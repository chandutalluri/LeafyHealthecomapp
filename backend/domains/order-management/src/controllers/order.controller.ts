import { Controller, Get, Post, Put, Body, Param, Query, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto, UpdatePaymentStatusDto } from '../dto/update-order.dto';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Authentication required for order creation');
    }
    const createdBy = req.user.id;
    return this.orderService.createOrder(createOrderDto, createdBy);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async findAll() {
    return this.orderService.findAll();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get orders by status' })
  @ApiResponse({ status: 200, description: 'Orders by status retrieved successfully' })
  async findByStatus(@Param('status') status: string) {
    return this.orderService.getOrdersByStatus(status);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get orders by customer' })
  @ApiResponse({ status: 200, description: 'Customer orders retrieved successfully' })
  async findByCustomer(@Param('customerId') customerId: string) {
    return this.orderService.getOrdersByCustomer(parseInt(customerId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(parseInt(id));
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
    @Request() req
  ) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Authentication required for order status updates');
    }
    const changedBy = req.user.id;
    return this.orderService.updateStatus(parseInt(id), updateStatusDto, changedBy);
  }

  @Put(':id/payment')
  @ApiOperation({ summary: 'Update payment status' })
  @ApiResponse({ status: 200, description: 'Payment status updated successfully' })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentStatusDto
  ) {
    return this.orderService.updatePaymentStatus(parseInt(id), updatePaymentDto);
  }
}