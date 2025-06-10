import { Controller, Get, Post, Body, Param, Put, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../../../shared/auth';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of all categories' })
  async findAll() {
    const categories = await this.categoryService.findAll();
    return {
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    };
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get category hierarchy' })
  @ApiResponse({ status: 200, description: 'Category hierarchy tree' })
  async getHierarchy() {
    const hierarchy = await this.categoryService.getHierarchy();
    return {
      success: true,
      message: 'Category hierarchy retrieved successfully',
      data: hierarchy
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category details' })
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(+id);
    return {
      success: true,
      message: 'Category retrieved successfully',
      data: category
    };
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Get category with products' })
  @ApiResponse({ status: 200, description: 'Category with products' })
  async findWithProducts(@Param('id') id: string) {
    const categoryWithProducts = await this.categoryService.findWithProducts(+id);
    return {
      success: true,
      message: 'Category with products retrieved successfully',
      data: categoryWithProducts
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return {
      success: true,
      message: 'Category created successfully',
      data: category
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateCategoryDto>) {
    const category = await this.categoryService.update(+id, updateData);
    return {
      success: true,
      message: 'Category updated successfully',
      data: category
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async remove(@Param('id') id: string) {
    const result = await this.categoryService.remove(+id);
    return {
      success: true,
      message: 'Category deleted successfully',
      data: result
    };
  }
}