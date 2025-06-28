import type { Express } from "express";
import { createServer, type Server } from "http";
import aiRoutes from "./routes/ai";

export function registerRoutes(app: Express): Server {
  // API routes
  app.use("/api/ai", aiRoutes);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
