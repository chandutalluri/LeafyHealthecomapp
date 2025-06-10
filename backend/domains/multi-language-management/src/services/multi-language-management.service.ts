import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { db } from '../database/connection';
import { languagesTable, translationsTable } from '../entities/multi-language-management.entity';
import { 
  CreateLanguageDto, 
  UpdateLanguageDto, 
  CreateTranslationDto, 
  UpdateTranslationDto,
  BulkTranslationDto 
} from '../dto/multi-language-management.dto';
import { eq, and, ilike, count } from 'drizzle-orm';

@Injectable()
export class MultiLanguageManagementService {
  // Default supported Indian languages
  private readonly DEFAULT_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', isDefault: true, region: 'Global' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', region: 'North India' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'South India' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'South India' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'East India' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'West India' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'West India' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'South India' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'South India' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'North India' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'East India' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Northeast India' }
  ];

  async initializeDefaultLanguages() {
    console.log('🌐 Initializing default Indian languages...');
    
    for (const lang of this.DEFAULT_LANGUAGES) {
      const existing = await this.findLanguageByCode(lang.code);
      if (!existing) {
        await this.createLanguage(lang as CreateLanguageDto);
        console.log(`✅ Added language: ${lang.name} (${lang.nativeName})`);
      }
    }
    
    return { message: 'Default Indian languages initialized successfully' };
  }

  // Language Management
  async findAllLanguages(query: any = {}) {
    const { limit = 50, offset = 0, active = true, region } = query;
    
    let whereConditions = [];
    
    if (active !== undefined) {
      whereConditions.push(eq(languagesTable.isActive, active));
    }
    
    if (region) {
      whereConditions.push(ilike(languagesTable.region, `%${region}%`));
    }
    
    if (whereConditions.length > 0) {
      return db.select().from(languagesTable)
        .where(and(...whereConditions))
        .limit(limit)
        .offset(offset)
        .orderBy(languagesTable.name);
    }
    
    return db.select().from(languagesTable)
      .limit(limit)
      .offset(offset)
      .orderBy(languagesTable.name);
  }

  async findLanguageByCode(code: string) {
    const [language] = await db
      .select()
      .from(languagesTable)
      .where(eq(languagesTable.code, code));
    
    return language;
  }

  async createLanguage(createDto: CreateLanguageDto) {
    // Check for duplicate language code
    const existing = await this.findLanguageByCode(createDto.code);
    if (existing) {
      throw new ConflictException(`Language with code '${createDto.code}' already exists`);
    }

    const [language] = await db
      .insert(languagesTable)
      .values({
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return language;
  }

  async updateLanguage(code: string, updateDto: UpdateLanguageDto) {
    const [language] = await db
      .update(languagesTable)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(languagesTable.code, code))
      .returning();
    
    if (!language) {
      throw new NotFoundException(`Language with code '${code}' not found`);
    }
    
    return language;
  }

  async deleteLanguage(code: string) {
    // Prevent deletion of default language
    const language = await this.findLanguageByCode(code);
    if (language?.isDefault) {
      throw new ConflictException('Cannot delete the default language');
    }

    const [deleted] = await db
      .delete(languagesTable)
      .where(eq(languagesTable.code, code))
      .returning();
    
    if (!deleted) {
      throw new NotFoundException(`Language with code '${code}' not found`);
    }
    
    return { message: `Language '${code}' deleted successfully` };
  }

  // Translation Management
  async getTranslations(languageCode: string, context?: string) {
    let whereConditions = [eq(translationsTable.languageCode, languageCode)];
    
    if (context) {
      whereConditions.push(eq(translationsTable.context, context));
    }
    
    const translations = await db
      .select()
      .from(translationsTable)
      .where(and(...whereConditions));
    
    // Convert to key-value object for easy frontend consumption
    return translations.reduce((acc, translation) => {
      acc[translation.key] = translation.value;
      return acc;
    }, {});
  }

  async createTranslation(createDto: CreateTranslationDto) {
    // Check if translation already exists
    const existing = await this.findTranslation(createDto.key, createDto.languageCode);
    if (existing) {
      throw new ConflictException(`Translation for key '${createDto.key}' in language '${createDto.languageCode}' already exists`);
    }

    // Verify language exists
    const language = await this.findLanguageByCode(createDto.languageCode);
    if (!language) {
      throw new NotFoundException(`Language with code '${createDto.languageCode}' not found`);
    }

    const [translation] = await db
      .insert(translationsTable)
      .values({
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return translation;
  }

  async updateTranslation(id: string, updateDto: UpdateTranslationDto) {
    const [translation] = await db
      .update(translationsTable)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(translationsTable.id, id))
      .returning();
    
    if (!translation) {
      throw new NotFoundException(`Translation with ID '${id}' not found`);
    }
    
    return translation;
  }

  async findTranslation(key: string, languageCode: string) {
    const [translation] = await db
      .select()
      .from(translationsTable)
      .where(
        and(
          eq(translationsTable.key, key),
          eq(translationsTable.languageCode, languageCode)
        )
      );
    
    return translation;
  }

  async bulkCreateTranslations(bulkDto: BulkTranslationDto) {
    const results = [];
    
    // Verify language exists
    const language = await this.findLanguageByCode(bulkDto.languageCode);
    if (!language) {
      throw new NotFoundException(`Language with code '${bulkDto.languageCode}' not found`);
    }
    
    for (const translation of bulkDto.translations) {
      try {
        const result = await this.createTranslation({
          key: translation.key,
          value: translation.value,
          context: translation.context as any,
          languageCode: bulkDto.languageCode,
        });
        results.push({ success: true, translation: result });
      } catch (error) {
        results.push({ 
          success: false, 
          key: translation.key, 
          error: error.message 
        });
      }
    }
    
    return {
      total: bulkDto.translations.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  async getLanguageStats() {
    const languages = await this.findAllLanguages({ limit: 100 });
    const stats = [];
    
    for (const language of languages) {
      const [{ translationCount }] = await db
        .select({ translationCount: count() })
        .from(translationsTable)
        .where(eq(translationsTable.languageCode, language.code));
      
      stats.push({
        code: language.code,
        name: language.name,
        nativeName: language.nativeName,
        region: language.region,
        translationCount,
        isActive: language.isActive,
        isDefault: language.isDefault
      });
    }
    
    return stats;
  }

  async searchTranslations(languageCode: string, searchTerm: string, context?: string) {
    let whereConditions = [
      eq(translationsTable.languageCode, languageCode),
      ilike(translationsTable.value, `%${searchTerm}%`)
    ];
    
    if (context) {
      whereConditions.push(eq(translationsTable.context, context));
    }
    
    return db
      .select()
      .from(translationsTable)
      .where(and(...whereConditions))
      .limit(50);
  }

  async approveTranslation(id: string, approvedBy: string) {
    const [translation] = await db
      .update(translationsTable)
      .set({
        isApproved: true,
        translatedBy: approvedBy,
        updatedAt: new Date(),
      })
      .where(eq(translationsTable.id, id))
      .returning();
    
    if (!translation) {
      throw new NotFoundException(`Translation with ID '${id}' not found`);
    }
    
    return translation;
  }

  // Legacy methods for backward compatibility
  async findAll(query: any = {}) {
    return this.findAllLanguages(query);
  }

  async findOne(id: string) {
    const [language] = await db
      .select()
      .from(languagesTable)
      .where(eq(languagesTable.id, id));
    
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    
    return language;
  }

  async create(createDto: any) {
    return this.createLanguage(createDto);
  }

  async update(id: string, updateDto: any) {
    // Find language by ID first to get the code
    const language = await this.findOne(id);
    return this.updateLanguage(language.code, updateDto);
  }

  async remove(id: string) {
    // Find language by ID first to get the code
    const language = await this.findOne(id);
    return this.deleteLanguage(language.code);
  }
}