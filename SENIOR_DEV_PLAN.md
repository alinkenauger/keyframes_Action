# Senior Developer Implementation Plan

## Executive Summary
We've successfully migrated API keys from client to server. Now we need to ensure production readiness with proper error handling, testing, and monitoring.

## Current State Analysis

### ✅ Completed
- API keys removed from client code
- Backend endpoints created for all AI operations
- Client services updated to use backend API

### 🚨 Critical Gaps
1. No error recovery mechanisms
2. No request retry logic
3. Missing TypeScript contracts
4. No API versioning
5. Limited error context for debugging

## Professional Implementation Strategy

### Phase 1: API Client Robustness (Immediate)

#### 1.1 Create Professional API Client
```typescript
// client/src/lib/api-client.ts
interface APIResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class APIClient {
  private baseURL: string;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  async request<T>(
    endpoint: string,
    options: RequestInit,
    retries = this.retryAttempts
  ): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': this.generateRequestId(),
          ...options.headers,
        },
      });

      if (!response.ok && retries > 0 && this.shouldRetry(response.status)) {
        await this.delay(this.retryDelay * (this.retryAttempts - retries + 1));
        return this.request(endpoint, options, retries - 1);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      if (retries > 0) {
        await this.delay(this.retryDelay * (this.retryAttempts - retries + 1));
        return this.request(endpoint, options, retries - 1);
      }
      
      return {
        error: this.getErrorMessage(error),
        status: 0,
      };
    }
  }

  private shouldRetry(status: number): boolean {
    return [408, 429, 500, 502, 503, 504].includes(status);
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

#### 1.2 TypeScript Contracts
```typescript
// shared/types/api.ts
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

export interface APIError {
  error: string;
  code?: string;
  details?: any;
}
```

### Phase 2: Error Handling & User Experience

#### 2.1 Graceful Degradation
```typescript
// Enhanced adaptFrameContent with proper error handling
export async function adaptFrameContent(
  content: string,
  tone: string,
  filter: string,
  frameType: string,
  unitType: string
): Promise<string> {
  // Input validation
  if (!content?.trim()) {
    throw new Error('Content is required');
  }

  // Try primary method
  try {
    return await adaptContentWithAgent(content, tone, filter, unitType);
  } catch (agentError) {
    console.warn('Agent adaptation failed, trying API fallback:', agentError);
    
    // Try API fallback
    try {
      const response = await apiClient.post<AdaptContentResponse>(
        '/ai/adapt-content',
        { content, tone, filter, frameType, unitType }
      );
      
      if (response.data?.adaptedContent) {
        return truncateToLimit(response.data.adaptedContent, unitType);
      }
    } catch (apiError) {
      console.error('API adaptation failed:', apiError);
      
      // Last resort: return original with notification
      showToast({
        title: 'AI Service Temporarily Unavailable',
        description: 'Your content has been saved without AI enhancement.',
        type: 'warning'
      });
      
      return content;
    }
  }
}
```

### Phase 3: Monitoring & Observability

#### 3.1 Request Logging
```typescript
// server/middleware/logging.ts
export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || generateId();
  
  req.requestId = requestId;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      error: res.locals.error,
    };
    
    if (res.statusCode >= 400) {
      logger.error('API Error', logData);
    } else {
      logger.info('API Request', logData);
    }
  });
  
  next();
};
```

#### 3.2 Performance Monitoring
```typescript
// server/middleware/performance.ts
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  // Track API performance
  const histogram = getHistogram('api_request_duration');
  const end = histogram.startTimer({ 
    method: req.method, 
    route: req.route?.path || 'unknown' 
  });
  
  res.on('finish', () => {
    end();
  });
  
  next();
};
```

### Phase 4: Testing Strategy

#### 4.1 Unit Tests
```typescript
// __tests__/api-client.test.ts
describe('API Client', () => {
  it('should retry failed requests', async () => {
    fetchMock.mockResponses(
      [JSON.stringify({ error: 'Server Error' }), { status: 500 }],
      [JSON.stringify({ error: 'Server Error' }), { status: 500 }],
      [JSON.stringify({ adaptedContent: 'Success' }), { status: 200 }]
    );
    
    const result = await apiClient.post('/ai/adapt-content', {...});
    expect(result.data.adaptedContent).toBe('Success');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
```

#### 4.2 Integration Tests
```typescript
// __tests__/ai-service.integration.test.ts
describe('AI Service Integration', () => {
  it('should handle complete adaptation flow', async () => {
    const result = await adaptFrameContent(
      'Test content',
      'professional',
      'engaging',
      'hook',
      'intro'
    );
    
    expect(result).toBeTruthy();
    expect(result.length).toBeLessThanOrEqual(150); // Unit constraint
  });
});
```

### Phase 5: Deployment Strategy

#### 5.1 Feature Flags
```typescript
// lib/feature-flags.ts
export const Features = {
  USE_BACKEND_AI: process.env.NEXT_PUBLIC_USE_BACKEND_AI === 'true',
  ENABLE_RETRY_LOGIC: process.env.NEXT_PUBLIC_ENABLE_RETRY === 'true',
};

// Usage
if (Features.USE_BACKEND_AI) {
  return await callBackendAPI(...);
} else {
  return await callDirectAPI(...); // Fallback
}
```

#### 5.2 Gradual Rollout
1. Deploy backend endpoints
2. Deploy client with feature flag OFF
3. Test with internal users (flag ON)
4. Gradual rollout: 10% → 50% → 100%
5. Remove old code after stability confirmed

### Phase 6: Documentation

#### 6.1 API Documentation
```yaml
# api-docs.yaml
/api/ai/adapt-content:
  post:
    summary: Adapt frame content with AI
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/AdaptContentRequest'
    responses:
      200:
        description: Successfully adapted content
      400:
        description: Invalid request
      429:
        description: Rate limit exceeded
      500:
        description: Server error
```

## Implementation Timeline

### Week 1: Foundation
- [x] Move API to backend
- [ ] Implement robust API client
- [ ] Add TypeScript contracts
- [ ] Basic error handling

### Week 2: Reliability
- [ ] Add retry logic
- [ ] Implement circuit breaker
- [ ] Add request logging
- [ ] Performance monitoring

### Week 3: Testing & Documentation
- [ ] Comprehensive test suite
- [ ] API documentation
- [ ] Load testing
- [ ] Security audit

### Week 4: Deployment
- [ ] Feature flags setup
- [ ] Gradual rollout
- [ ] Monitor metrics
- [ ] Remove legacy code

## Success Metrics

1. **Reliability**: 99.9% uptime for AI features
2. **Performance**: <2s response time for 95th percentile
3. **Error Rate**: <0.1% failed requests
4. **Security**: Zero API key exposures

## Risk Mitigation

### Technical Risks
- **API Downtime**: Implement circuit breaker and fallbacks
- **Performance Degradation**: Add caching layer
- **Data Loss**: Implement request queuing

### Business Risks
- **User Experience**: Graceful degradation with clear messaging
- **Cost Overruns**: Implement rate limiting and monitoring

## Conclusion

This plan transforms a basic API migration into a production-ready, enterprise-grade solution. The focus is on reliability, observability, and maintainability while ensuring zero downtime and excellent user experience.