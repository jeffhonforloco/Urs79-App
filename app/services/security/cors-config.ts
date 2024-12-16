export const corsConfig = {
  allowedOrigins: [
    'https://urs79.app',
    'https://api.urs79.app',
    'https://admin.urs79.app'
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['Content-Length', 'X-RateLimit-Limit'],
  maxAge: 86400, // 24 hours
  credentials: true
};