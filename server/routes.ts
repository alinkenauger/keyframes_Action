import type { Express } from "express";
import { createServer, type Server } from "http";
import cookieParser from "cookie-parser";
import aiRoutes from "./routes/ai";
import authRoutes from "./routes/auth";
import userApiKeysRoutes from "./routes/userApiKeys";
import { authenticateToken } from "./middleware/auth";
import { healthCheckRateLimiter } from "./middleware/rateLimiting-simple";

export function registerRoutes(app: Express): Server {
  // Add cookie parser for refresh tokens
  app.use(cookieParser());

  // Public routes
  app.use("/api/auth", authRoutes);
  
  // Health check endpoint (public)
  app.get("/api/health", healthCheckRateLimiter, (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      authenticated: !!req.headers.authorization 
    });
  });

  // AI routes - authentication is optional (handled internally for rate limiting)
  app.use("/api/ai", aiRoutes);
  
  // User API keys routes - requires authentication
  app.use("/api/user/api-keys", userApiKeysRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
