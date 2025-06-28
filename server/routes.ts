import type { Express } from "express";
import { createServer, type Server } from "http";
import cookieParser from "cookie-parser";
import aiRoutes from "./routes/ai";
import authRoutes from "./routes/auth";
import { authenticateToken } from "./middleware/auth";

export function registerRoutes(app: Express): Server {
  // Add cookie parser for refresh tokens
  app.use(cookieParser());

  // Public routes
  app.use("/api/auth", authRoutes);
  
  // Health check endpoint (public)
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      authenticated: !!req.headers.authorization 
    });
  });

  // Protected API routes - require authentication
  app.use("/api/ai", authenticateToken, aiRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
