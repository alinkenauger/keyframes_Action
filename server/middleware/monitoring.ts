import { Request, Response, NextFunction } from 'express';

// Extend Request type to include custom properties
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers['x-request-id'] as string || generateRequestId();
  const startTime = Date.now();
  
  req.requestId = requestId;
  req.startTime = startTime;
  
  // Log request
  console.log('[REQUEST]', {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString(),
  });
  
  // Log response
  const originalSend = res.send;
  res.send = function(data: any) {
    const duration = Date.now() - startTime;
    
    console.log('[RESPONSE]', {
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
    
    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    return originalSend.call(this, data);
  };
  
  next();
}

/**
 * Error logging middleware
 */
export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
  const requestId = req.requestId || generateRequestId();
  const duration = req.startTime ? Date.now() - req.startTime : 0;
  
  console.error('[ERROR]', {
    requestId,
    method: req.method,
    path: req.path,
    status: err.status || 500,
    error: err.message,
    stack: err.stack,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
  });
  
  next(err);
}

/**
 * Performance monitoring
 */
const performanceMetrics = new Map<string, number[]>();

export function performanceMonitor(req: Request, res: Response, next: NextFunction) {
  const route = `${req.method} ${req.route?.path || req.path}`;
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    // Store metrics
    if (!performanceMetrics.has(route)) {
      performanceMetrics.set(route, []);
    }
    
    const metrics = performanceMetrics.get(route)!;
    metrics.push(duration);
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
    
    // Log slow requests
    if (duration > 1000) {
      console.warn('[SLOW_REQUEST]', {
        requestId: req.requestId,
        route,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });
    }
  });
  
  next();
}

/**
 * Get performance statistics
 */
export function getPerformanceStats() {
  const stats: Record<string, any> = {};
  
  performanceMetrics.forEach((durations, route) => {
    if (durations.length === 0) return;
    
    const sorted = [...durations].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    stats[route] = {
      count: sorted.length,
      mean: sum / sorted.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
    };
  });
  
  return stats;
}

/**
 * Health check endpoint
 */
export function healthCheck(req: Request, res: Response) {
  const stats = getPerformanceStats();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    performance: stats,
    environment: process.env.NODE_ENV,
  });
}