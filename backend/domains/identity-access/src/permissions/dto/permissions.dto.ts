import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsArray()
  @IsString({ each: true })
  actions: string[];
}

export class UpdatePermissionDto {
  @IsString()
  userId?: string;

  @IsString()
  domain?: string;

  @IsArray()
  @IsString({ each: true })
  actions?: string[];
}