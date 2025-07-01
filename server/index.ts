import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
import { requestLogger, errorLogger, performanceMonitor } from "./middleware/monitoring";
import { corsMiddleware } from "./middleware/cors-simple";
import { generalRateLimiter, addRateLimitHeaders } from "./middleware/rateLimiting-simple";
import { securityHeaders, apiSecurityHeaders } from "./middleware/security-headers";

const app = express();

// Security headers should be first
app.use(securityHeaders);

// Enable CORS before other middleware
app.use(corsMiddleware);

// Add rate limit headers to all responses
app.use(addRateLimitHeaders);

// Apply general rate limiting to all routes
app.use(generalRateLimiter);

// API-specific security headers
app.use('/api', apiSecurityHeaders);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Add monitoring middleware
app.use(requestLogger);
app.use(performanceMonitor);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  // Error handling middleware
  app.use(errorLogger);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ 
      error: message,
      requestId: _req.requestId 
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT from environment or default to 5000
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
