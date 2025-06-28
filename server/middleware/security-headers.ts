import { Request, Response, NextFunction } from 'express';

/**
 * Security headers middleware
 * Implements security best practices similar to Helmet
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // X-DNS-Prefetch-Control: Controls browser DNS prefetching
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  
  // X-Frame-Options: Prevents clickjacking attacks
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Strict-Transport-Security: Forces HTTPS connections
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // X-Download-Options: Prevents IE from executing downloads
  res.setHeader('X-Download-Options', 'noopen');
  
  // X-Content-Type-Options: Prevents MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-Permitted-Cross-Domain-Policies: Controls Adobe products' cross-domain behavior
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Referrer-Policy: Controls how much referrer information is sent
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // X-XSS-Protection: Basic XSS protection for older browsers
  res.setHeader('X-XSS-Protection', '0'); // Disabled as it can introduce vulnerabilities
  
  // Remove X-Powered-By header to hide Express
  res.removeHeader('X-Powered-By');
  
  // Content-Security-Policy: Comprehensive protection against XSS and injection attacks
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net", // Allow inline scripts for React
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Allow inline styles
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.openai.com wss: ws:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'"
  ];
  
  // Relax CSP in development
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Content-Security-Policy-Report-Only', cspDirectives.join('; '));
  } else {
    res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
  }
  
  // Permissions-Policy: Controls browser features
  const permissionsPolicy = [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()',
    'interest-cohort=()' // Opt out of FLoC
  ];
  
  res.setHeader('Permissions-Policy', permissionsPolicy.join(', '));
  
  next();
}

/**
 * Additional security middleware for API endpoints
 */
export function apiSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent caching of sensitive API responses
  if (req.path.includes('/auth') || req.path.includes('/user')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  // Add request ID for tracking
  if (!res.getHeader('X-Request-ID')) {
    res.setHeader('X-Request-ID', (req as any).requestId || 'unknown');
  }
  
  next();
}