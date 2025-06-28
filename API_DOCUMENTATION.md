# API Documentation - Keyframes Action

## Overview

All AI functionality is now served through secure backend endpoints. The API uses JSON for requests and responses, includes retry logic, and proper error handling.

## Base URL

```
Development: http://localhost:5000/api
Production: https://yourdomain.com/api
```

## Authentication

Currently, the API is open. Authentication will be implemented in the next phase.

## Common Headers

```http
Content-Type: application/json
X-Request-ID: <unique-request-id>
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Human-readable error message",
  "requestId": "1234567890-abc123def",
  "code": "ERROR_CODE" // Optional
}
```

### Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (coming soon)
- `429` - Rate Limited
- `500` - Internal Server Error

## Endpoints

### 1. Adapt Content

Adapts frame content based on tone and filter settings.

**Endpoint:** `POST /api/ai/adapt-content`

**Request:**
```json
{
  "content": "Original frame content",
  "tone": "professional",
  "filter": "engaging",
  "frameType": "hook",
  "unitType": "intro"
}
```

**Response:**
```json
{
  "adaptedContent": "Professionally adapted engaging content"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/ai/adapt-content \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Welcome to our product",
    "tone": "casual",
    "filter": "friendly",
    "frameType": "hook",
    "unitType": "intro"
  }'
```

### 2. Generate Script

Generates a complete video script from frames.

**Endpoint:** `POST /api/ai/generate-script`

**Request:**
```json
{
  "frames": [
    {
      "id": "frame-1",
      "content": "Frame content",
      "unitType": "hook",
      "type": "bold-statement"
    }
  ],
  "duration": 60
}
```

**Response:**
```json
{
  "script": "Complete video script with timing markers..."
}
```

### 3. Generate Custom Content

Generates content using custom GPT configurations.

**Endpoint:** `POST /api/ai/generate-custom-content`

**Request:**
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant"
    },
    {
      "role": "user",
      "content": "Generate engaging content"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 200
}
```

**Response:**
```json
{
  "content": "Generated content from GPT-4"
}
```

### 4. AI Agent

Processes commands through AI agent.

**Endpoint:** `POST /api/ai/agent`

**Request:**
```json
{
  "command": "Create a hook for a fitness app",
  "context": "Target audience: young professionals"
}
```

**Response:**
```json
{
  "result": "Transform your busy life with 7-minute workouts..."
}
```

### 5. Health Check

Check API and service health.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "services": {
    "openai": "healthy",
    "database": "healthy"
  }
}
```

## Rate Limiting

- **Default:** 50 requests per 15 minutes per IP
- **Headers:** 
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: When limit resets (Unix timestamp)

## Client SDK Usage

### JavaScript/TypeScript

```typescript
import { apiClient } from '@/lib/api-client';
import type { AdaptContentRequest, AdaptContentResponse } from '@/types/api';

// Adapt content
const request: AdaptContentRequest = {
  content: "Your content",
  tone: "professional",
  filter: "engaging",
  frameType: "hook",
  unitType: "intro"
};

const response = await apiClient.post<AdaptContentResponse>(
  '/ai/adapt-content',
  request
);

if (response.data) {
  console.log(response.data.adaptedContent);
} else {
  console.error(response.error);
}
```

### Error Handling

```typescript
try {
  const response = await apiClient.post('/ai/adapt-content', data);
  // Handle success
} catch (error) {
  if (error.status === 429) {
    // Handle rate limit
    showToast('Please wait before making more requests');
  } else {
    // Handle other errors
    showToast('Something went wrong');
  }
}
```

## Testing

### Using cURL

```bash
# Test adapt content
curl -X POST http://localhost:5000/api/ai/adapt-content \
  -H "Content-Type: application/json" \
  -d '{"content":"Test","tone":"casual","filter":"friendly","frameType":"hook","unitType":"intro"}'

# Test health check
curl http://localhost:5000/api/health
```

### Using Postman

Import the included `postman_collection.json` for pre-configured requests.

## Migration Notes

1. **API Keys**: Never include API keys in client requests
2. **Retry Logic**: Client automatically retries failed requests
3. **Timeouts**: Default 30s timeout for all requests
4. **Error Handling**: Always check for `error` in response

## Future Enhancements

1. **Authentication**: JWT-based auth coming soon
2. **Webhooks**: Real-time notifications
3. **Batch Operations**: Process multiple items
4. **WebSocket**: Real-time updates
5. **GraphQL**: Alternative API interface