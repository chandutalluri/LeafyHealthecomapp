const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3050;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Default Indian languages
const DEFAULT_LANGUAGES = [
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

// Create tables if they don't exist
async function initializeTables() {
  try {
    // Create languages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS languages (
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
      )
    `);

    // Create translations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS translations (
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
      )
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_language_code ON languages(code);
      CREATE INDEX IF NOT EXISTS idx_language_active ON languages(is_active);
      CREATE INDEX IF NOT EXISTS idx_translation_key_lang ON translations(key, language_code);
      CREATE INDEX IF NOT EXISTS idx_translation_context ON translations(context);
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'multi-language-management',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all languages endpoint
app.get('/multi-language-management/languages', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        code,
        name,
        native_name,
        is_active,
        is_default,
        region,
        direction,
        created_at,
        updated_at
      FROM languages 
      ORDER BY name ASC
    `);
    
    const languages = result.rows.map(row => ({
      id: row.id,
      code: row.code,
      name: row.name,
      nativeName: row.native_name,
      isActive: row.is_active,
      isDefault: row.is_default,
      region: row.region,
      direction: row.direction,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    res.json(languages);
  } catch (error) {
    console.error('❌ Get languages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch languages'
    });
  }
});

// Initialize default languages endpoint
app.post('/multi-language-management/initialize', async (req, res) => {
  try {
    console.log('🌐 Initializing default Indian languages...');
    
    const results = [];
    
    for (const lang of DEFAULT_LANGUAGES) {
      try {
        // Check if language already exists
        const existing = await pool.query('SELECT * FROM languages WHERE code = $1', [lang.code]);
        
        if (existing.rows.length === 0) {
          await pool.query(`
            INSERT INTO languages (code, name, native_name, is_default, region, direction, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            lang.code,
            lang.name,
            lang.nativeName,
            lang.isDefault || false,
            lang.region,
            'ltr',
            true
          ]);
          
          results.push({
            success: true,
            language: `${lang.name} (${lang.nativeName})`,
            code: lang.code,
            region: lang.region
          });
          
          console.log(`✅ Added language: ${lang.name} (${lang.nativeName})`);
        } else {
          results.push({
            success: false,
            language: `${lang.name} (${lang.nativeName})`,
            code: lang.code,
            message: 'Already exists'
          });
        }
      } catch (error) {
        results.push({
          success: false,
          language: `${lang.name} (${lang.nativeName})`,
          error: error.message
        });
      }
    }
    
    const successful = results.filter(r => r.success).length;
    const total = results.length;
    
    res.json({
      success: true,
      message: `Successfully initialized ${successful}/${total} Indian languages`,
      results,
      stats: {
        total: total,
        successful: successful,
        failed: total - successful
      }
    });
    
  } catch (error) {
    console.error('❌ Language initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize languages',
      message: error.message
    });
  }
});

// Get all languages endpoint
app.get('/multi-language-management/languages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM languages ORDER BY name');
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Get languages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch languages'
    });
  }
});

// Get language statistics endpoint
app.get('/multi-language-management/stats', async (req, res) => {
  try {
    const languagesResult = await pool.query('SELECT * FROM languages ORDER BY name');
    const stats = [];
    
    for (const language of languagesResult.rows) {
      const translationResult = await pool.query(
        'SELECT COUNT(*) as count FROM translations WHERE language_code = $1',
        [language.code]
      );
      
      stats.push({
        code: language.code,
        name: language.name,
        nativeName: language.native_name,
        region: language.region,
        translationCount: parseInt(translationResult.rows[0].count),
        isActive: language.is_active,
        isDefault: language.is_default
      });
    }
    
    res.json({
      success: true,
      data: stats,
      totalLanguages: stats.length,
      totalTranslations: stats.reduce((sum, lang) => sum + lang.translationCount, 0)
    });
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// Add sample grocery translations endpoint
app.post('/multi-language-management/add-sample-translations', async (req, res) => {
  try {
    const sampleTranslations = [
      // Hindi translations
      { key: 'product.rice.basmati', languageCode: 'hi', value: 'बासमती चावल', context: 'product' },
      { key: 'product.lentils.dal', languageCode: 'hi', value: 'दाल', context: 'product' },
      { key: 'category.vegetables', languageCode: 'hi', value: 'सब्जियां', context: 'category' },
      { key: 'category.fruits', languageCode: 'hi', value: 'फल', context: 'category' },
      { key: 'checkout.total', languageCode: 'hi', value: 'कुल राशि', context: 'checkout' },
      
      // Tamil translations
      { key: 'product.rice.basmati', languageCode: 'ta', value: 'பாஸ்மதி அரிசி', context: 'product' },
      { key: 'product.lentils.dal', languageCode: 'ta', value: 'பருப்பு', context: 'product' },
      { key: 'category.vegetables', languageCode: 'ta', value: 'காய்கறிகள்', context: 'category' },
      { key: 'category.fruits', languageCode: 'ta', value: 'பழங்கள்', context: 'category' },
      { key: 'checkout.total', languageCode: 'ta', value: 'மொத்தம்', context: 'checkout' },
      
      // Bengali translations
      { key: 'product.rice.basmati', languageCode: 'bn', value: 'বাসমতী চাল', context: 'product' },
      { key: 'product.lentils.dal', languageCode: 'bn', value: 'ডাল', context: 'product' },
      { key: 'category.vegetables', languageCode: 'bn', value: 'সবজি', context: 'category' },
      { key: 'category.fruits', languageCode: 'bn', value: 'ফল', context: 'category' },
      { key: 'checkout.total', languageCode: 'bn', value: 'মোট', context: 'checkout' }
    ];
    
    const results = [];
    
    for (const translation of sampleTranslations) {
      try {
        // Check if translation already exists
        const existing = await pool.query(
          'SELECT * FROM translations WHERE key = $1 AND language_code = $2',
          [translation.key, translation.languageCode]
        );
        
        if (existing.rows.length === 0) {
          await pool.query(`
            INSERT INTO translations (key, language_code, value, context, is_approved)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            translation.key,
            translation.languageCode,
            translation.value,
            translation.context,
            true
          ]);
          
          results.push({
            success: true,
            key: translation.key,
            language: translation.languageCode,
            value: translation.value
          });
        } else {
          results.push({
            success: false,
            key: translation.key,
            language: translation.languageCode,
            message: 'Already exists'
          });
        }
      } catch (error) {
        results.push({
          success: false,
          key: translation.key,
          error: error.message
        });
      }
    }
    
    const successful = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      message: `Added ${successful}/${results.length} sample grocery translations`,
      results
    });
    
  } catch (error) {
    console.error('❌ Add sample translations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add sample translations'
    });
  }
});

// Start server
async function startServer() {
  try {
    await initializeTables();
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`🌐 Multi-Language Management service running on port ${port}`);
      console.log(`❤️  Health check: http://localhost:${port}/health`);
      console.log(`🔧 Initialize languages: POST /multi-language-management/initialize`);
      console.log(`📊 Language stats: GET /multi-language-management/stats`);
      console.log(`🛒 Sample translations: POST /multi-language-management/add-sample-translations`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();