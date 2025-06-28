import { Request, Response, NextFunction } from 'express';

// Simple CORS middleware without external dependencies
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin || '';
  
  // Define allowed origins
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://localhost:3000',
    'https://localhost:5000',
    'https://localhost:5173',
    'https://localhost:5174',
    'https://keyframes.getmoreviews.com',
    'https://www.keyframes.getmoreviews.com',
  ];
  
  // In production, add allowed origins from environment
  if (process.env.NODE_ENV === 'production' && process.env.ALLOWED_ORIGINS) {
    const productionOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    allowedOrigins.push(...productionOrigins);
  }
  
  // In development, allow any localhost origin
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (allowedOrigins.includes(origin) || (isDevelopment && isLocalhost) || !origin) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Request-ID, Accept, Origin');
    res.setHeader('Access-Control-Expose-Headers', 'X-Request-ID, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}

// Strict CORS for sensitive endpoints
export function strictCorsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin || '';
  const strictOrigins = process.env.STRICT_ORIGINS?.split(',').map(o => o.trim()) || [];
  
  if (strictOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
  } else {
    return res.status(403).json({ error: 'Not allowed by strict CORS policy' });
  }
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}