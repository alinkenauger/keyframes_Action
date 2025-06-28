import { Request, Response, NextFunction } from 'express';
import { AuthService, type TokenPayload } from '../services/auth.service';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Extract token from Authorization header
 */
function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Authentication middleware - verifies JWT token
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req.headers.authorization);
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'NO_TOKEN' 
    });
  }
  
  try {
    const payload = AuthService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN' 
    });
  }
}

/**
 * Optional authentication - adds user to request if token is valid
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req.headers.authorization);
  
  if (!token) {
    return next();
  }
  
  try {
    const payload = AuthService.verifyAccessToken(token);
    req.user = payload;
  } catch (error) {
    // Token is invalid but we don't block the request
  }
  
  next();
}

/**
 * Rate limiting is now imported from the centralized rateLimiting module
 */
export { authRateLimiter, registerRateLimiter } from './rateLimiting-simple';

/**
 * Validate request body middleware
 */
export function validateBody(schema: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors || error.message
      });
    }
  };
}