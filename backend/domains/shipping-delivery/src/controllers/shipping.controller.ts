import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { ShippingService } from '../services/shipping.service';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';

@ApiTags('shipping')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('shipments')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiResponse({ status: 201, description: 'Shipment created successfully' })
  async createShipment(@Body() createShipmentDto: CreateShipmentDto) {
    // Convert date string to Date object if needed
    const shipmentData = {
      ...createShipmentDto,
      estimatedDeliveryDate: createShipmentDto.estimatedDeliveryDate ? 
        new Date(createShipmentDto.estimatedDeliveryDate) : undefined
    };
    return this.shippingService.createShipment(shipmentData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shipments' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of shipments' })
  async getShipments(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.shippingService.getShipments(limit || 50, offset || 0);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get shipping statistics' })
  @ApiResponse({ status: 200, description: 'Shipping statistics' })
  async getShippingStats() {
    return this.shippingService.getShippingStats();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get shipments by status' })
  @ApiParam({ name: 'status', type: String })
  @ApiResponse({ status: 200, description: 'List of shipments with specified status' })
  async getShipmentsByStatus(@Param('status') status: string) {
    return this.shippingService.getShipmentsByStatus(status);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get shipments for a customer' })
  @ApiParam({ name: 'customerId', type: Number })
  @ApiResponse({ status: 200, description: 'List of customer shipments' })
  async getShipmentsByCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.shippingService.getShipmentsByCustomer(customerId);
  }

  @Get('track/:trackingNumber')
  @ApiOperation({ summary: 'Track a shipment by tracking number' })
  @ApiParam({ name: 'trackingNumber', type: String })
  @ApiResponse({ status: 200, description: 'Shipment tracking information' })
  async trackShipment(@Param('trackingNumber') trackingNumber: string) {
    const shipment = await this.shippingService.getShipmentByTrackingNumber(trackingNumber);
    const trackingHistory = await this.shippingService.getTrackingHistory(shipment.id);
    
    return {
      shipment,
      trackingHistory
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shipment by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Shipment details' })
  async getShipmentById(@Param('id', ParseIntPipe) id: number) {
    return this.shippingService.getShipmentById(id);
  }

  @Get(':id/tracking')
  @ApiOperation({ summary: 'Get tracking history for a shipment' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tracking history' })
  async getTrackingHistory(@Param('id', ParseIntPipe) id: number) {
    return this.shippingService.getTrackingHistory(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update shipment status' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Shipment status updated' })
  async updateShipmentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: { status: string; notes?: string }
  ) {
    return this.shippingService.updateShipmentStatus(id, updateDto.status, updateDto.notes);
  }

  @Post(':id/tracking-event')
  @ApiOperation({ summary: 'Add tracking event to shipment' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 201, description: 'Tracking event added' })
  async addTrackingEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() eventData: {
      status: string;
      location: string;
      description: string;
      timestamp: string;
    }
  ) {
    // Convert timestamp string to Date object
    const trackingData = {
      ...eventData,
      timestamp: new Date(eventData.timestamp)
    };
    return this.shippingService.addTrackingEvent(id, trackingData);
  }
}