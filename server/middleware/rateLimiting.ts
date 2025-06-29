import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Helper to create consistent error responses
const rateLimitHandler = (req: Request, res: Response) => {
  res.status(429).json({
    error: 'Too many requests, please try again later.',
    retryAfter: res.getHeader('Retry-After'),
    requestId: req.requestId,
  });
};

// General API rate limiter - More lenient for development
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // More lenient in dev
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: (req) => {
    // Skip rate limiting for health checks and auth endpoints
    return req.path === '/api/health' || req.path.startsWith('/api/auth/');
  },
});

// Strict rate limiter for auth endpoints - 5 requests per 15 minutes
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Very strict rate limiter for registration - 3 requests per hour
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many registration attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// AI endpoint rate limiter - 20 requests per hour (due to cost)
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'AI request limit exceeded. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator: (req) => {
    // Use both IP and user ID if authenticated
    const userId = (req as any).user?.id || 'anonymous';
    return `${req.ip}-${userId}`;
  },
});

// Premium AI rate limiter - for authenticated users with higher limits
export const premiumAiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Higher limit for authenticated users
  message: 'AI request limit exceeded. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator: (req) => {
    // Use user ID for authenticated users
    const userId = (req as any).user?.id;
    if (!userId) {
      // Fall back to regular AI rate limiter for non-authenticated
      return `${req.ip}-anonymous`;
    }
    return `user-${userId}`;
  },
  skip: (req) => {
    // Skip if user is not authenticated (they'll use the regular AI limiter)
    return !(req as any).user;
  },
});

// Health check rate limiter - prevent abuse
export const healthCheckRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many health check requests.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// Password reset rate limiter
export const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: 'Too many password reset attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// Create a rate limiter factory for custom limits
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    keyGenerator: options.keyGenerator,
  });
}

// Middleware to add rate limit info to response headers
export function addRateLimitHeaders(req: Request, res: Response, next: Function) {
  // Add custom headers for client awareness
  res.setHeader('X-RateLimit-Policy', 'sliding-window');
  res.setHeader('X-RateLimit-Cost', '1'); // Cost of this request
  
  // For AI endpoints, indicate higher cost
  if (req.path.includes('/ai/')) {
    res.setHeader('X-RateLimit-Cost', '5');
  }
  
  next();
}