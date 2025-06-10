import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { VendorService } from '../services/vendor.service';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';

@ApiTags('Vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createVendor(@Body() createVendorDto: CreateVendorDto) {
    return await this.vendorService.createVendor(createVendorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiResponse({ status: 200, description: 'List of all vendors' })
  async getAllVendors() {
    return await this.vendorService.getAllVendors();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get vendor statistics' })
  @ApiResponse({ status: 200, description: 'Vendor statistics' })
  async getVendorStats() {
    return await this.vendorService.getVendorStats();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get vendors by status' })
  @ApiParam({ name: 'status', enum: ['verified', 'unverified', 'active', 'inactive'] })
  @ApiResponse({ status: 200, description: 'List of vendors by status' })
  async getVendorsByStatus(@Param('status') status: 'verified' | 'unverified' | 'active' | 'inactive') {
    return await this.vendorService.getVendorsByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Vendor details' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async getVendorById(@Param('id') id: string) {
    return await this.vendorService.getVendorById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vendor' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async updateVendor(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return await this.vendorService.updateVendor(+id, updateVendorDto);
  }

  @Patch(':id/verify')
  @ApiOperation({ summary: 'Verify vendor' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Vendor verified successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async verifyVendor(@Param('id') id: string) {
    return await this.vendorService.verifyVendor(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vendor' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async deleteVendor(@Param('id') id: string) {
    return await this.vendorService.deleteVendor(+id);
  }
}