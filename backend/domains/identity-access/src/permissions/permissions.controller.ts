import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckPermissionDto, UserPermissionsDto } from './dto/permissions.dto';

@ApiTags('permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user permissions by user ID' })
  @ApiResponse({ status: 200, description: 'User permissions retrieved successfully' })
  async getUserPermissions(@Param('userId') userId: string): Promise<UserPermissionsDto> {
    return this.permissionsService.getUserPermissions(userId);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current user permissions' })
  @ApiResponse({ status: 200, description: 'Current user permissions retrieved successfully' })
  async getCurrentUserPermissions(@Request() req): Promise<UserPermissionsDto> {
    return this.permissionsService.getUserPermissions(req.user.sub);
  }

  @Post('check')
  @ApiOperation({ summary: 'Check if user has specific permission' })
  @ApiResponse({ status: 200, description: 'Permission check completed' })
  async checkPermission(
    @Body() checkPermissionDto: CheckPermissionDto,
    @Request() req
  ): Promise<{ hasPermission: boolean; reason?: string }> {
    return this.permissionsService.checkPermission(
      req.user.sub,
      checkPermissionDto.domain,
      checkPermissionDto.action
    );
  }

  @Get('domains')
  @ApiOperation({ summary: 'Get all available domains and their actions' })
  @ApiResponse({ status: 200, description: 'Available domains retrieved successfully' })
  async getAvailableDomains() {
    return this.permissionsService.getAvailableDomains();
  }

  @Get('user/:userId/domains')
  @ApiOperation({ summary: 'Get accessible domains for specific user' })
  @ApiResponse({ status: 200, description: 'User accessible domains retrieved successfully' })
  async getUserAccessibleDomains(@Param('userId') userId: string) {
    return this.permissionsService.getUserAccessibleDomains(userId);
  }
}