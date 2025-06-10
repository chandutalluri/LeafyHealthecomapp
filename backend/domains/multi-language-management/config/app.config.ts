export const appConfig = {
  port: process.env.PORT || 3050,
  environment: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  swagger: {
    title: 'Multi-Language Management API',
    description: 'Complete language localization system for Indian grocery platforms supporting Hindi, Tamil, Bengali, Telugu, and other regional languages',
    version: '1.0',
  },
};