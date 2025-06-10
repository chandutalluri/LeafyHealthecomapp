import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { db, products, categories, inventory, auditLogs } from '../database';
import { eq, and, like, or } from 'drizzle-orm';

@Injectable()
export class ProductService {
  async findAll() {
    const allProducts = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      sku: products.sku,
      barcode: products.barcode,
      categoryId: products.categoryId,
      price: products.price,
      costPrice: products.costPrice,
      weight: products.weight,
      unit: products.unit,
      stockQuantity: products.stockQuantity,
      minStockLevel: products.minStockLevel,
      maxStockLevel: products.maxStockLevel,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      taxRate: products.taxRate,
      expiryDate: products.expiryDate,
      batchNumber: products.batchNumber,
      nutritionalInfo: products.nutritionalInfo,
      allergens: products.allergens,
      tags: products.tags,
      images: products.images,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt
    }).from(products);

    return allProducts;
  }

  async findOne(id: number) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async findByCategory(categoryId: number) {
    const categoryProducts = await db.select()
      .from(products)
      .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)));
    
    return categoryProducts;
  }

  async searchProducts(query: string) {
    const searchResults = await db.select()
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          or(
            like(products.name, `%${query}%`),
            like(products.description, `%${query}%`),
            like(products.sku, `%${query}%`),
            like(products.barcode, `%${query}%`)
          )
        )
      );
    
    return searchResults;
  }

  async create(createProductDto: CreateProductDto, userId: number) {
    // Check if SKU already exists
    const [existingProduct] = await db.select().from(products).where(eq(products.sku, createProductDto.sku));
    if (existingProduct) {
      throw new ConflictException('SKU already exists');
    }

    // Check if barcode exists (if provided)
    if (createProductDto.barcode) {
      const [existingBarcode] = await db.select().from(products).where(eq(products.barcode, createProductDto.barcode));
      if (existingBarcode) {
        throw new ConflictException('Barcode already exists');
      }
    }

    const [newProduct] = await db.insert(products).values({
      name: createProductDto.name,
      description: createProductDto.description,
      sku: createProductDto.sku,
      barcode: createProductDto.barcode,
      categoryId: createProductDto.categoryId,
      price: createProductDto.price,
      costPrice: createProductDto.costPrice,
      weight: createProductDto.weight,
      unit: createProductDto.unit || 'piece',
      stockQuantity: createProductDto.stockQuantity || 0,
      minStockLevel: createProductDto.minStockLevel || 0,
      maxStockLevel: createProductDto.maxStockLevel || 1000,
      isActive: true,
      isFeatured: false,
      taxRate: '0',
      tags: createProductDto.tags || [],
      images: createProductDto.images || [],
      createdBy: userId
    }).returning();

    // Create initial inventory record
    await db.insert(inventory).values({
      productId: newProduct.id,
      quantity: createProductDto.stockQuantity || 0,
      location: 'main-warehouse',
      costPrice: createProductDto.costPrice,
      updatedBy: userId
    });

    // Log the product creation
    await db.insert(auditLogs).values({
      userId: userId,
      action: 'product_created',
      resource: 'products',
      details: { productId: newProduct.id, sku: newProduct.sku, name: newProduct.name }
    });

    return newProduct;
  }

  async update(id: number, updateData: Partial<CreateProductDto>, userId: number) {
    const [existingProduct] = await db.select().from(products).where(eq(products.id, id));
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check if new SKU conflicts (if being updated)
    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const [skuConflict] = await db.select().from(products).where(eq(products.sku, updateData.sku));
      if (skuConflict) {
        throw new ConflictException('SKU already exists');
      }
    }

    const [updatedProduct] = await db.update(products)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning();

    // Log the product update
    await db.insert(auditLogs).values({
      userId: userId,
      action: 'product_updated',
      resource: 'products',
      details: { productId: id, updates: updateData }
    });

    return updatedProduct;
  }

  async remove(id: number, userId: number) {
    const [existingProduct] = await db.select().from(products).where(eq(products.id, id));
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Soft delete - mark as inactive instead of actual deletion
    await db.update(products)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(products.id, id));

    // Log the product deletion
    await db.insert(auditLogs).values({
      userId: userId,
      action: 'product_deleted',
      resource: 'products',
      details: { productId: id, sku: existingProduct.sku }
    });

    return { deleted: true };
  }

  async updateStock(productId: number, newQuantity: number, userId: number) {
    // Update product stock quantity
    await db.update(products)
      .set({ 
        stockQuantity: newQuantity,
        updatedAt: new Date()
      })
      .where(eq(products.id, productId));

    // Update inventory record
    await db.update(inventory)
      .set({ 
        quantity: newQuantity,
        lastUpdated: new Date(),
        updatedBy: userId
      })
      .where(eq(inventory.productId, productId));

    // Log the stock update
    await db.insert(auditLogs).values({
      userId: userId,
      action: 'stock_updated',
      resource: 'inventory',
      details: { productId, newQuantity }
    });

    return { success: true, newQuantity };
  }

  async getLowStockProducts() {
    const lowStockProducts = await db.select()
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          // Products where current stock is less than or equal to minimum stock level
          // Note: This is a simplified comparison since we're using string fields
        )
      );

    return lowStockProducts.filter(product => 
      parseInt(product.stockQuantity?.toString() || '0') <= (product.minStockLevel || 0)
    );
  }

  async seedIndianProducts() {
    // Check if products already exist
    const existingProducts = await db.select().from(products);
    if (existingProducts.length > 0) {
      return { message: 'Products already seeded', count: existingProducts.length };
    }

    // Create categories first
    const [vegetablesCategory] = await db.insert(categories).values({
      name: 'Vegetables',
      description: 'Fresh organic vegetables'
    }).returning();

    const [fruitsCategory] = await db.insert(categories).values({
      name: 'Fruits', 
      description: 'Fresh seasonal fruits'
    }).returning();

    const [dairyCategory] = await db.insert(categories).values({
      name: 'Dairy',
      description: 'Fresh dairy products'
    }).returning();

    const [grainCategory] = await db.insert(categories).values({
      name: 'Grains',
      description: 'Whole grains and cereals'
    }).returning();

    const [spicesCategory] = await db.insert(categories).values({
      name: 'Spices',
      description: 'Indian spices and seasonings'
    }).returning();

    const [snacksCategory] = await db.insert(categories).values({
      name: 'Snacks',
      description: 'Healthy snacks and beverages'
    }).returning();

    // Seed products with authentic INR pricing for Indian market
    const indianProducts = [
      // Vegetables
      { name: 'Organic Spinach', description: 'Fresh organic spinach leaves', price: '249', categoryId: vegetablesCategory.id, sku: 'VEG001', unit: 'bunch', stockQuantity: 50 },
      { name: 'Roma Tomatoes', description: 'Fresh red roma tomatoes', price: '199', categoryId: vegetablesCategory.id, sku: 'VEG002', unit: 'kg', stockQuantity: 100 },
      { name: 'Red Bell Peppers', description: 'Crisp red bell peppers', price: '349', categoryId: vegetablesCategory.id, sku: 'VEG003', unit: 'kg', stockQuantity: 75 },
      { name: 'Organic Carrots', description: 'Fresh organic carrots', price: '179', categoryId: vegetablesCategory.id, sku: 'VEG004', unit: 'kg', stockQuantity: 80 },
      { name: 'Fresh Broccoli', description: 'Nutritious broccoli heads', price: '299', categoryId: vegetablesCategory.id, sku: 'VEG005', unit: 'piece', stockQuantity: 60 },
      { name: 'Green Beans', description: 'Fresh green beans', price: '219', categoryId: vegetablesCategory.id, sku: 'VEG006', unit: 'kg', stockQuantity: 45 },
      
      // Fruits
      { name: 'Bananas', description: 'Sweet ripe bananas', price: '89', categoryId: fruitsCategory.id, sku: 'FRT001', unit: 'dozen', stockQuantity: 120 },
      { name: 'Red Apples', description: 'Crisp red apples', price: '229', categoryId: fruitsCategory.id, sku: 'FRT002', unit: 'kg', stockQuantity: 90 },
      { name: 'Orange Oranges', description: 'Juicy Valencia oranges', price: '159', categoryId: fruitsCategory.id, sku: 'FRT003', unit: 'kg', stockQuantity: 85 },
      { name: 'Fresh Mangoes', description: 'Sweet Alphonso mangoes', price: '399', categoryId: fruitsCategory.id, sku: 'FRT004', unit: 'kg', stockQuantity: 40 },
      { name: 'Pomegranates', description: 'Fresh ruby pomegranates', price: '279', categoryId: fruitsCategory.id, sku: 'FRT005', unit: 'kg', stockQuantity: 35 },
      { name: 'Green Grapes', description: 'Sweet seedless grapes', price: '189', categoryId: fruitsCategory.id, sku: 'FRT006', unit: 'kg', stockQuantity: 55 },
      
      // Dairy
      { name: 'Fresh Milk', description: 'Pure fresh milk', price: '58', categoryId: dairyCategory.id, sku: 'DRY001', unit: 'liter', stockQuantity: 200 },
      { name: 'Paneer', description: 'Fresh cottage cheese', price: '149', categoryId: dairyCategory.id, sku: 'DRY002', unit: '250g', stockQuantity: 30 },
      { name: 'Greek Yogurt', description: 'Thick creamy yogurt', price: '89', categoryId: dairyCategory.id, sku: 'DRY003', unit: '200g', stockQuantity: 45 },
      { name: 'Butter', description: 'Fresh white butter', price: '119', categoryId: dairyCategory.id, sku: 'DRY004', unit: '100g', stockQuantity: 25 },
      
      // Grains
      { name: 'Basmati Rice', description: 'Premium aged basmati rice', price: '299', categoryId: grainCategory.id, sku: 'GRN001', unit: 'kg', stockQuantity: 150 },
      { name: 'Whole Wheat Flour', description: 'Fresh ground wheat flour', price: '79', categoryId: grainCategory.id, sku: 'GRN002', unit: 'kg', stockQuantity: 200 },
      { name: 'Red Lentils', description: 'Premium masoor dal', price: '189', categoryId: grainCategory.id, sku: 'GRN003', unit: 'kg', stockQuantity: 80 },
      { name: 'Chickpeas', description: 'Kabuli chana', price: '159', categoryId: grainCategory.id, sku: 'GRN004', unit: 'kg', stockQuantity: 90 },
      
      // Spices
      { name: 'Turmeric Powder', description: 'Pure turmeric powder', price: '149', categoryId: spicesCategory.id, sku: 'SPC001', unit: '100g', stockQuantity: 60 },
      { name: 'Cumin Seeds', description: 'Whole cumin seeds', price: '199', categoryId: spicesCategory.id, sku: 'SPC002', unit: '100g', stockQuantity: 40 },
      { name: 'Coriander Powder', description: 'Fresh ground coriander', price: '129', categoryId: spicesCategory.id, sku: 'SPC003', unit: '100g', stockQuantity: 55 },
      { name: 'Garam Masala', description: 'Authentic spice blend', price: '179', categoryId: spicesCategory.id, sku: 'SPC004', unit: '50g', stockQuantity: 35 },
      
      // Snacks
      { name: 'Almonds', description: 'Premium California almonds', price: '899', categoryId: snacksCategory.id, sku: 'SNK001', unit: '500g', stockQuantity: 25 },
      { name: 'Green Tea', description: 'Organic green tea bags', price: '249', categoryId: snacksCategory.id, sku: 'SNK002', unit: '25 bags', stockQuantity: 40 },
      { name: 'Dark Chocolate', description: '70% cocoa dark chocolate', price: '199', categoryId: snacksCategory.id, sku: 'SNK003', unit: '100g', stockQuantity: 30 }
    ];

    const createdProducts = [];
    for (const product of indianProducts) {
      const [newProduct] = await db.insert(products).values({
        ...product,
        isActive: true,
        isFeatured: Math.random() > 0.7, // Random featured products
        taxRate: '0',
        costPrice: (parseFloat(product.price) * 0.7).toString(), // 70% of selling price
        minStockLevel: 10,
        maxStockLevel: 500
      }).returning();
      
      createdProducts.push(newProduct);
    }

    return { 
      message: 'Indian products seeded successfully', 
      categories: 6,
      products: createdProducts.length,
      data: createdProducts
    };
  }
}