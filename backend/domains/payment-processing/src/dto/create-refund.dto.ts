import { IsNotEmpty, IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRefundDto {
  @ApiProperty({ description: 'Payment ID to refund' })
  @IsNumber()
  @IsNotEmpty()
  paymentId: number;

  @ApiProperty({ description: 'Refund amount', example: '25.00' })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ description: 'Reason for refund', example: 'Customer request' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ description: 'Additional refund metadata', required: false })
  @IsOptional()
  metadata?: any;
}

export class CreatePaymentMethodDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty({ description: 'Payment method type', example: 'credit_card' })
  @IsString()
  @IsIn(['credit_card', 'debit_card', 'bank_account', 'digital_wallet'])
  type: string;

  @ApiProperty({ description: 'Payment provider', example: 'stripe' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ description: 'Provider payment method ID' })
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @ApiProperty({ description: 'Set as default payment method', default: false })
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({ description: 'Last four digits of card', required: false })
  @IsString()
  @IsOptional()
  lastFour?: string;

  @ApiProperty({ description: 'Card expiry month', required: false })
  @IsNumber()
  @IsOptional()
  expiryMonth?: number;

  @ApiProperty({ description: 'Card expiry year', required: false })
  @IsNumber()
  @IsOptional()
  expiryYear?: number;

  @ApiProperty({ description: 'Card brand', required: false })
  @IsString()
  @IsOptional()
  cardBrand?: string;

  @ApiProperty({ description: 'Billing address JSON', required: false })
  @IsOptional()
  billingAddress?: any;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: any;
}