import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiting without external dependencies
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class SimpleRateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private windowMs: number;
  private maxRequests: number;
  private message: string;
  private keyGenerator: (req: Request) => string;

  constructor(options: {
    windowMs: number;
    max: number;
    message?: string;
    keyGenerator?: (req: Request) => string;
  }) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.max;
    this.message = options.message || 'Too many requests, please try again later.';
    this.keyGenerator = options.keyGenerator || ((req) => req.ip || 'unknown');
    
    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.keyGenerator(req);
      const now = Date.now();
      const entry = this.limits.get(key);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
      
      if (!entry || entry.resetTime < now) {
        // Create new entry or reset existing one
        this.limits.set(key, {
          count: 1,
          resetTime: now + this.windowMs,
        });
        res.setHeader('X-RateLimit-Remaining', (this.maxRequests - 1).toString());
        res.setHeader('X-RateLimit-Reset', new Date(now + this.windowMs).toISOString());
        return next();
      }

      // Check if limit exceeded
      if (entry.count >= this.maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        res.setHeader('Retry-After', retryAfter.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
        
        return res.status(429).json({
          error: this.message,
          retryAfter,
          requestId: (req as any).requestId,
        });
      }

      // Increment counter
      entry.count++;
      res.setHeader('X-RateLimit-Remaining', (this.maxRequests - entry.count).toString());
      res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
      next();
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetTime < now) {
        this.limits.delete(key);
      }
    }
  }
}

// Create rate limiters
export const generalRateLimiter = new SimpleRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
}).middleware();

export const authRateLimiter = new SimpleRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
}).middleware();

export const registerRateLimiter = new SimpleRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many registration attempts, please try again later.',
}).middleware();

export const aiRateLimiter = new SimpleRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'AI request limit exceeded. Please try again later.',
  keyGenerator: (req) => {
    const userId = (req as any).user?.id || 'anonymous';
    return `${req.ip}-${userId}`;
  },
}).middleware();

export const premiumAiRateLimiter = new SimpleRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: 'AI request limit exceeded. Please try again later.',
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    return userId ? `user-${userId}` : `${req.ip}-anonymous`;
  },
}).middleware();

export const healthCheckRateLimiter = new SimpleRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many health check requests.',
}).middleware();

export const passwordResetRateLimiter = new SimpleRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: 'Too many password reset attempts, please try again later.',
}).middleware();

// Middleware to add rate limit info to response headers
export function addRateLimitHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-RateLimit-Policy', 'sliding-window');
  res.setHeader('X-RateLimit-Cost', '1');
  
  if (req.path.includes('/ai/')) {
    res.setHeader('X-RateLimit-Cost', '5');
  }
  
  next();
}

// Factory for custom rate limiters
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}) {
  return new SimpleRateLimiter(options).middleware();
}