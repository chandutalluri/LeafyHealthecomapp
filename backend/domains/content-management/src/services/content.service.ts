import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql, like } from 'drizzle-orm';
import { 
  db, 
  contentItems, 
  contentCategories, 
  mediaLibrary, 
  contentRevisions, 
  contentTemplates,
  type ContentItem,
  type InsertContentItem,
  type ContentCategory,
  type InsertContentCategory
} from '../database';

@Injectable()
export class ContentService {

  async createContent(contentData: InsertContentItem) {
    try {
      const slug = this.generateSlug(contentData.title);
      
      const [content] = await db.insert(contentItems).values({
        ...contentData,
        slug
      }).returning();

      return {
        success: true,
        data: content,
        message: 'Content created successfully'
      };
    } catch (error) {
      console.error('Error creating content:', error);
      throw new Error('Failed to create content');
    }
  }

  async getAllContent(contentType?: string, status?: string) {
    try {
      let query = db
        .select({
          id: contentItems.id,
          title: contentItems.title,
          slug: contentItems.slug,
          contentType: contentItems.contentType,
          status: contentItems.status,
          excerpt: contentItems.excerpt,
          featuredImage: contentItems.featuredImage,
          authorId: contentItems.authorId,
          categoryId: contentItems.categoryId,
          publishedAt: contentItems.publishedAt,
          createdAt: contentItems.createdAt,
          updatedAt: contentItems.updatedAt
        })
        .from(contentItems)
        .orderBy(desc(contentItems.updatedAt));

      if (contentType) {
        query = query.where(eq(contentItems.contentType, contentType));
      }

      if (status) {
        query = query.where(eq(contentItems.status, status));
      }

      const allContent = await query;

      return {
        success: true,
        data: allContent,
        count: allContent.length
      };
    } catch (error) {
      console.error('Error fetching content:', error);
      throw new Error('Failed to fetch content');
    }
  }

  async getContentById(id: number) {
    try {
      const [content] = await db
        .select()
        .from(contentItems)
        .where(eq(contentItems.id, id));

      if (!content) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      return {
        success: true,
        data: content
      };
    } catch (error) {
      console.error('Error fetching content:', error);
      throw new Error('Failed to fetch content');
    }
  }

  async getContentBySlug(slug: string) {
    try {
      const [content] = await db
        .select()
        .from(contentItems)
        .where(and(
          eq(contentItems.slug, slug),
          eq(contentItems.status, 'published')
        ));

      if (!content) {
        throw new NotFoundException(`Content with slug ${slug} not found`);
      }

      return {
        success: true,
        data: content
      };
    } catch (error) {
      console.error('Error fetching content by slug:', error);
      throw new Error('Failed to fetch content by slug');
    }
  }

  async updateContent(id: number, updateData: Partial<InsertContentItem>) {
    try {
      const [updatedContent] = await db
        .update(contentItems)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(contentItems.id, id))
        .returning();

      if (!updatedContent) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      return {
        success: true,
        data: updatedContent,
        message: 'Content updated successfully'
      };
    } catch (error) {
      console.error('Error updating content:', error);
      throw new Error('Failed to update content');
    }
  }

  async publishContent(id: number) {
    try {
      const [publishedContent] = await db
        .update(contentItems)
        .set({
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(contentItems.id, id))
        .returning();

      if (!publishedContent) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      return {
        success: true,
        data: publishedContent,
        message: 'Content published successfully'
      };
    } catch (error) {
      console.error('Error publishing content:', error);
      throw new Error('Failed to publish content');
    }
  }

  async createCategory(categoryData: InsertContentCategory) {
    try {
      const slug = this.generateSlug(categoryData.name);
      
      const [category] = await db.insert(contentCategories).values({
        ...categoryData,
        slug
      }).returning();

      return {
        success: true,
        data: category,
        message: 'Content category created successfully'
      };
    } catch (error) {
      console.error('Error creating content category:', error);
      throw new Error('Failed to create content category');
    }
  }

  async getCategories() {
    try {
      const categories = await db
        .select()
        .from(contentCategories)
        .where(eq(contentCategories.isActive, true))
        .orderBy(contentCategories.sortOrder, contentCategories.name);

      return {
        success: true,
        data: categories,
        count: categories.length
      };
    } catch (error) {
      console.error('Error fetching content categories:', error);
      throw new Error('Failed to fetch content categories');
    }
  }

  async uploadMedia(mediaData: any) {
    try {
      const [media] = await db.insert(mediaLibrary).values(mediaData).returning();

      return {
        success: true,
        data: media,
        message: 'Media uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      throw new Error('Failed to upload media');
    }
  }

  async getMediaLibrary() {
    try {
      const media = await db
        .select()
        .from(mediaLibrary)
        .where(eq(mediaLibrary.isPublic, true))
        .orderBy(desc(mediaLibrary.createdAt));

      return {
        success: true,
        data: media,
        count: media.length
      };
    } catch (error) {
      console.error('Error fetching media library:', error);
      throw new Error('Failed to fetch media library');
    }
  }

  async searchContent(searchTerm: string) {
    try {
      const searchResults = await db
        .select()
        .from(contentItems)
        .where(and(
          eq(contentItems.status, 'published'),
          sql`(${contentItems.title} ILIKE ${`%${searchTerm}%`} OR ${contentItems.content} ILIKE ${`%${searchTerm}%`})`
        ))
        .orderBy(desc(contentItems.publishedAt));

      return {
        success: true,
        data: searchResults,
        count: searchResults.length
      };
    } catch (error) {
      console.error('Error searching content:', error);
      throw new Error('Failed to search content');
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}