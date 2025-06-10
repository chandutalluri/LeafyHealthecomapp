import { Controller, Get, Post, Body, Param, Put, Delete, Query, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products' })
  async findAll() {
    const products = await this.productService.findAll();
    return {
      success: true,
      message: 'Products retrieved successfully',
      data: products
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(@Query('q') query: string) {
    const results = await this.productService.searchProducts(query);
    return {
      success: true,
      message: 'Search completed successfully',
      data: results
    };
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock' })
  @ApiResponse({ status: 200, description: 'Products with low stock levels' })
  async getLowStock() {
    const products = await this.productService.getLowStockProducts();
    return {
      success: true,
      message: 'Low stock products retrieved successfully',
      data: products
    };
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, description: 'Products in category' })
  async findByCategory(@Param('categoryId') categoryId: string) {
    const products = await this.productService.findByCategory(+categoryId);
    return {
      success: true,
      message: 'Category products retrieved successfully',
      data: products
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product details' })
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(+id);
    return {
      success: true,
      message: 'Product retrieved successfully',
      data: product
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Authentication required for product creation');
    }
    const userId = req.user.id;
    const product = await this.productService.create(createProductDto, userId);
    return {
      success: true,
      message: 'Product created successfully',
      data: product
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateProductDto>, @Request() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Authentication required for product updates');
    }
    const userId = req.user.id;
    const product = await this.productService.update(+id, updateData, userId);
    return {
      success: true,
      message: 'Product updated successfully',
      data: product
    };
  }

  @Put(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager', 'staff')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product stock' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  async updateStock(@Param('id') id: string, @Body('quantity') quantity: number, @Request() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Authentication required for stock updates');
    }
    const userId = req.user.id;
    const result = await this.productService.updateStock(+id, quantity, userId);
    return {
      success: true,
      message: 'Stock updated successfully',
      data: result
    };
  }

  @Post('seed-indian-products')
  @ApiOperation({ summary: 'Seed database with Indian market products' })
  @ApiResponse({ status: 201, description: 'Products seeded successfully' })
  async seedIndianProducts() {
    const result = await this.productService.seedIndianProducts();
    return {
      success: true,
      message: result.message,
      data: result
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async remove(@Param('id') id: string, @Request() req) {
    if (!req.user?.id) {
      throw new UnauthorizedException('Authentication required for product deletion');
    }
    const userId = req.user.id;
    const result = await this.productService.remove(+id, userId);
    return {
      success: true,
      message: 'Product deleted successfully',
      data: result
    };
  }
}