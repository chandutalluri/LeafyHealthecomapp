# Multi-Language Management Microservice

A comprehensive language localization service for Indian grocery platforms, supporting 12+ regional languages with native scripts.

## Overview

This microservice provides complete multi-language support for e-commerce platforms targeting the Indian market. It includes pre-configured support for major Indian languages including Hindi (हिंदी), Tamil (தமிழ்), Bengali (বাংলা), Telugu (తెలుగు), and more.

## Features

### Language Management
- **12+ Indian Languages**: Pre-configured support for major regional languages
- **Native Script Support**: Full Unicode support for Devanagari, Tamil, Bengali, and other scripts
- **Regional Classification**: Languages organized by Indian regions (North, South, East, West, Northeast)
- **Activation Control**: Enable/disable languages dynamically
- **Default Language**: Configurable default language (typically English or Hindi)

### Translation Management
- **Context-Aware Translations**: Organized by context (product, category, UI, checkout, etc.)
- **Bulk Operations**: Import/export translations in bulk
- **Translation Approval**: Workflow for reviewing and approving translations
- **Search & Filter**: Advanced search capabilities across translations
- **Version Control**: Track translation changes and updates

### Production Features
- **Database Integration**: PostgreSQL with Drizzle ORM
- **JWT Authentication**: Secure API endpoints
- **Swagger Documentation**: Complete API documentation
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Indexed database queries
- **Error Handling**: Comprehensive error responses

## Supported Languages

| Code | Language | Native Name | Region | Status |
|------|----------|-------------|---------|--------|
| en | English | English | Global | ✅ Default |
| hi | Hindi | हिंदी | North India | ✅ Active |
| ta | Tamil | தமிழ் | South India | ✅ Active |
| te | Telugu | తెలుగు | South India | ✅ Active |
| bn | Bengali | বাংলা | East India | ✅ Active |
| mr | Marathi | मराठी | West India | ✅ Active |
| gu | Gujarati | ગુજરાતી | West India | ✅ Active |
| kn | Kannada | ಕನ್ನಡ | South India | ✅ Active |
| ml | Malayalam | മലയാളം | South India | ✅ Active |
| pa | Punjabi | ਪੰਜਾਬੀ | North India | ✅ Active |
| or | Odia | ଓଡ଼ିଆ | East India | ✅ Active |
| as | Assamese | অসমীয়া | Northeast India | ✅ Active |

## API Endpoints

### Language Management
```
GET    /multi-language-management/languages          # Get all languages
POST   /multi-language-management/languages          # Add new language
GET    /multi-language-management/languages/:code    # Get language by code
PUT    /multi-language-management/languages/:code    # Update language
DELETE /multi-language-management/languages/:code    # Delete language
```

### Translation Management
```
GET    /multi-language-management/translations/:languageCode           # Get translations
POST   /multi-language-management/translations                         # Add translation
PUT    /multi-language-management/translations/:id                     # Update translation
POST   /multi-language-management/translations/bulk                    # Bulk add translations
GET    /multi-language-management/translations/:languageCode/search    # Search translations
PATCH  /multi-language-management/translations/:id/approve             # Approve translation
```

### Statistics & Management
```
GET    /multi-language-management/stats       # Get language statistics
POST   /multi-language-management/initialize  # Initialize default languages
```

## Database Schema

### Languages Table
```sql
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  direction VARCHAR(3) DEFAULT 'ltr',
  region VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Translations Table
```sql
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL,
  language_code VARCHAR(10) NOT NULL,
  value TEXT NOT NULL,
  context VARCHAR(100),
  is_approved BOOLEAN DEFAULT false,
  translated_by VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage Examples

### Initialize Default Languages
```bash
POST /multi-language-management/initialize
```

### Add Product Translation
```json
POST /multi-language-management/translations
{
  "key": "product.rice.basmati",
  "languageCode": "hi",
  "value": "बासमती चावल",
  "context": "product",
  "translatedBy": "translator@example.com"
}
```

### Bulk Add Translations
```json
POST /multi-language-management/translations/bulk
{
  "languageCode": "hi",
  "translations": [
    {
      "key": "category.vegetables",
      "value": "सब्जियां",
      "context": "category"
    },
    {
      "key": "category.fruits",
      "value": "फल",
      "context": "category"
    }
  ]
}
```

### Get Translations for Frontend
```bash
GET /multi-language-management/translations/hi?context=product
```

## Frontend Integration

The service provides translation objects optimized for frontend consumption:

```javascript
// Example response format
{
  "product.rice.basmati": "बासमती चावल",
  "product.lentils.dal": "दाल",
  "category.vegetables": "सब्जियां",
  "checkout.total": "कुल राशि"
}
```

## Development Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Database**
```bash
# Set DATABASE_URL in environment
export DATABASE_URL="postgresql://..."
```

3. **Run Migrations**
```bash
npm run db:push
```

4. **Start Service**
```bash
npm run start:dev
```

5. **Initialize Languages**
```bash
curl -X POST http://localhost:3050/multi-language-management/initialize
```

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-jwt-secret
NODE_ENV=production
PORT=3050
```

## Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3050
CMD ["npm", "run", "start:prod"]
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Documentation

Full Swagger documentation available at: `http://localhost:3050/api`

## Performance Considerations

- **Database Indexing**: Optimized indexes for language codes and translation keys
- **Caching**: Implement Redis caching for frequently accessed translations
- **Lazy Loading**: Load translations on-demand by context
- **Compression**: Gzip compression for API responses
- **Pagination**: Limit large translation sets

## Security

- **JWT Authentication**: All endpoints require valid JWT tokens
- **Input Validation**: Comprehensive validation using class-validator
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **Rate Limiting**: Implement rate limiting for public endpoints

## Monitoring

- **Health Checks**: `/health` endpoint for service monitoring
- **Metrics**: Translation usage and performance metrics
- **Logging**: Structured logging for debugging and audit trails
- **Error Tracking**: Integration with error monitoring services

## Contributing

1. Follow TypeScript best practices
2. Add tests for new features
3. Update documentation
4. Ensure proper error handling
5. Validate translations with native speakers

## License

Proprietary - LeafyHealth Platform