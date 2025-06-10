import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShipmentDto {
  @ApiProperty({ description: 'Order ID for the shipment' })
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @ApiProperty({ description: 'Customer ID for the shipment' })
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @ApiProperty({ description: 'Carrier name' })
  @IsNotEmpty()
  @IsString()
  carrier: string;

  @ApiProperty({ description: 'Shipping method' })
  @IsNotEmpty()
  @IsString()
  shippingMethod: string;

  @ApiProperty({ description: 'Shipping address', required: false })
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiProperty({ description: 'Shipping cost', required: false })
  @IsOptional()
  @IsDecimal()
  shippingCost?: string;

  @ApiProperty({ description: 'Package weight', required: false })
  @IsOptional()
  @IsDecimal()
  weight?: string;

  @ApiProperty({ description: 'Package dimensions', required: false })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiProperty({ description: 'Estimated delivery date', required: false })
  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}