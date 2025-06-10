import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShipmentDto {
  @ApiProperty({ description: 'Shipment status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Tracking number', required: false })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiProperty({ description: 'Estimated delivery date', required: false })
  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: string;

  @ApiProperty({ description: 'Actual delivery date', required: false })
  @IsOptional()
  @IsDateString()
  actualDeliveryDate?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}