import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { db, categories, products, auditLogs } from '../database';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class CategoryService {
  async findAll() {
    const allCategories = await db.select().from(categories);
    return allCategories;
  }

  async findOne(id: number) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return category;
  }

  async findWithProducts(id: number) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const categoryProducts = await db.select()
      .from(products)
      .where(and(eq(products.categoryId, id), eq(products.isActive, true)));

    return {
      ...category,
      products: categoryProducts
    };
  }

  async create(createCategoryDto: CreateCategoryDto) {
    // Check if category name already exists at the same level
    const existingQuery = createCategoryDto.parentId 
      ? and(eq(categories.name, createCategoryDto.name), eq(categories.parentId, createCategoryDto.parentId))
      : eq(categories.name, createCategoryDto.name);

    const [existingCategory] = await db.select().from(categories).where(existingQuery);
    
    if (existingCategory) {
      throw new ConflictException('Category name already exists at this level');
    }

    const result = await db.insert(categories).values({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      parentId: createCategoryDto.parentId,
      sortOrder: createCategoryDto.sortOrder || 0,
      imageUrl: createCategoryDto.imageUrl,
      isActive: createCategoryDto.isActive !== false
    }).returning();
    
    const newCategory = result[0];

    return newCategory;
  }

  async update(id: number, updateData: Partial<CreateCategoryDto>) {
    const [existingCategory] = await db.select().from(categories).where(eq(categories.id, id));
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const [updatedCategory] = await db.update(categories)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(categories.id, id))
      .returning();

    return updatedCategory;
  }

  async remove(id: number) {
    const [existingCategory] = await db.select().from(categories).where(eq(categories.id, id));
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if category has products
    const [productInCategory] = await db.select().from(products).where(eq(products.categoryId, id));
    if (productInCategory) {
      throw new ConflictException('Cannot delete category that contains products');
    }

    // Check if category has subcategories
    const [subcategory] = await db.select().from(categories).where(eq(categories.parentId, id));
    if (subcategory) {
      throw new ConflictException('Cannot delete category that has subcategories');
    }

    await db.delete(categories).where(eq(categories.id, id));

    return { deleted: true };
  }

  async getHierarchy() {
    const allCategories = await db.select().from(categories);
    
    // Build hierarchy tree
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map of all categories
    allCategories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build hierarchy
    allCategories.forEach(category => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        rootCategories.push(categoryMap.get(category.id));
      }
    });

    return rootCategories;
  }
}