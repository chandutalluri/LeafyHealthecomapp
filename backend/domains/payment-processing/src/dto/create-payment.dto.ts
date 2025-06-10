import { IsNotEmpty, IsString, IsNumber, IsOptional, IsIn, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Order ID for this payment' })
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({ description: 'Customer ID making the payment' })
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty({ description: 'Payment amount', example: '99.99' })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ description: 'Currency code', example: 'USD', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Payment method type', example: 'credit_card' })
  @IsString()
  @IsIn(['credit_card', 'debit_card', 'bank_transfer', 'digital_wallet', 'cash'])
  paymentMethod: string;

  @ApiProperty({ description: 'Payment method ID if using saved method', required: false })
  @IsNumber()
  @IsOptional()
  paymentMethodId?: number;

  @ApiProperty({ description: 'Card token for new card payments', required: false })
  @IsString()
  @IsOptional()
  cardToken?: string;

  @ApiProperty({ description: 'Additional payment metadata', required: false })
  @IsOptional()
  metadata?: any;
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Payment gateway to use', example: 'stripe' })
  @IsString()
  @IsNotEmpty()
  gateway: string;

  @ApiProperty({ description: 'Payment intent or transaction reference', required: false })
  @IsString()
  @IsOptional()
  paymentIntentId?: string;

  @ApiProperty({ description: 'Additional processing options', required: false })
  @IsOptional()
  options?: any;
}