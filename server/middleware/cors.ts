import cors from 'cors';
import type { CorsOptions } from 'cors';

// CORS configuration
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://localhost:3000',
      'https://localhost:5000',
      'https://localhost:5173',
      'https://localhost:5174',
    ];
    
    // In production, add your actual domain
    if (process.env.NODE_ENV === 'production' && process.env.ALLOWED_ORIGINS) {
      const productionOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
      allowedOrigins.push(...productionOrigins);
    }
    
    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development') {
      // In development, allow any localhost origin
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  credentials: true, // Allow cookies to be sent
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Request-ID',
    'Accept',
    'Origin',
  ],
  
  exposedHeaders: [
    'X-Request-ID',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'Retry-After',
  ],
  
  maxAge: 86400, // 24 hours
  
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

export const corsMiddleware = cors(corsOptions);

// Strict CORS for sensitive endpoints
export const strictCorsMiddleware = cors({
  ...corsOptions,
  origin: function (origin, callback) {
    const strictOrigins = process.env.STRICT_ORIGINS?.split(',').map(o => o.trim()) || [];
    
    if (strictOrigins.includes(origin || '')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by strict CORS policy'));
    }
  },
});