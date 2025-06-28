/**
 * Shared TypeScript interfaces for API contracts
 * These types ensure type safety between client and server
 */

// Request/Response types for AI endpoints

export interface AdaptContentRequest {
  content: string;
  tone: string;
  filter: string;
  frameType: string;
  unitType: string;
}

export interface AdaptContentResponse {
  adaptedContent: string;
}

export interface GenerateScriptRequest {
  frames: Array<{
    id: string;
    content: string;
    unitType: string;
    type?: string;
  }>;
  duration: number;
}

export interface GenerateScriptResponse {
  script: string;
}

export interface GenerateCustomContentRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface GenerateCustomContentResponse {
  content: string;
}

export interface AgentRequest {
  command: string;
  context?: string;
}

export interface AgentResponse {
  result: string;
}

// Error response type
export interface APIError {
  error: string;
  code?: string;
  details?: any;
  requestId?: string;
}

// Generic API response wrapper
export interface APIResponseWrapper<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

// Health check response
export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version?: string;
  services?: {
    openai: 'healthy' | 'unhealthy';
    database: 'healthy' | 'unhealthy';
  };
}