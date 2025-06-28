# Security Audit Report - Keyframes Action

## Executive Summary

A comprehensive security audit was performed on the Keyframes Action codebase. Several critical security vulnerabilities were identified that require immediate attention, with the most severe being the exposure of API keys in client-side code.

## Critical Issues (Immediate Action Required)

### 1. API Key Exposure in Client Code 🚨
**Severity**: CRITICAL  
**Files Affected**: 
- `/client/src/lib/ai-service.ts`
- `/client/src/lib/script-service.ts`
- `/client/src/lib/agent-service.ts`

**Issue**: OpenAI API key is directly exposed in browser JavaScript
```typescript
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true
});
```

**Risk**: Anyone can extract the API key from browser DevTools, leading to:
- Unauthorized API usage and billing
- Potential abuse of your OpenAI account
- Complete compromise of AI service access

### 2. No Authentication System 🚨
**Severity**: CRITICAL  
**Issue**: The application has no authentication or authorization mechanism
- User table exists but is not implemented
- No session management
- No access control for sensitive operations

## High Priority Issues

### 3. Plain Text Password Storage
**Severity**: HIGH  
**File**: `/db/schema.ts`
```typescript
password: text("password").notNull(), // No hashing!
```

### 4. Direct API Calls from Client
**Severity**: HIGH  
**Issue**: All AI operations happen directly from the browser
- No backend proxy layer
- No rate limiting
- No request validation

## Medium Priority Issues

### 5. Missing CORS Configuration
**Severity**: MEDIUM  
**Issue**: No CORS headers configured on the server

### 6. Server Binding to All Interfaces
**Severity**: MEDIUM  
**File**: `/server/index.ts`
```typescript
server.listen(PORT, "0.0.0.0", () => { // Exposes to all networks
```

### 7. No Input Validation
**Severity**: MEDIUM  
**Issue**: Forms and user inputs lack proper validation and sanitization

## Remediation Plan

### Phase 1: Critical Security Fixes (Do First)

#### 1.1 Move AI Services to Backend
```typescript
// Create new file: /server/routes/ai.ts
import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Server-side only
});

router.post('/api/ai/adapt-content', authenticateUser, async (req, res) => {
  try {
    const { content, tone, filter, frameType, unitType } = req.body;
    
    // Validate inputs
    if (!content || !tone || !filter) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Call OpenAI API from backend
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [/* ... */]
    });
    
    res.json({ adaptedContent: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

#### 1.2 Update Client Code
```typescript
// Update /client/src/lib/ai-service.ts
export async function adaptFrameContent(
  content: string,
  tone: string,
  filter: string,
  frameType: string,
  unitType: string
): Promise<string> {
  const response = await fetch('/api/ai/adapt-content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}` // Add auth
    },
    body: JSON.stringify({ content, tone, filter, frameType, unitType })
  });
  
  if (!response.ok) {
    throw new Error('Failed to adapt content');
  }
  
  const data = await response.json();
  return data.adaptedContent;
}
```

### Phase 2: Authentication Implementation

#### 2.1 Add Password Hashing
```bash
npm install bcrypt @types/bcrypt
```

```typescript
// Update /db/schema.ts
import bcrypt from 'bcrypt';

// When creating user:
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// When verifying:
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

#### 2.2 Implement JWT Authentication
```bash
npm install jsonwebtoken @types/jsonwebtoken
```

```typescript
// /server/middleware/auth.ts
import jwt from 'jsonwebtoken';

export function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
```

### Phase 3: Security Hardening

#### 3.1 Add Security Headers
```bash
npm install helmet
```

```typescript
// /server/index.ts
import helmet from 'helmet';

app.use(helmet());
```

#### 3.2 Configure CORS
```bash
npm install cors @types/cors
```

```typescript
// /server/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:5173',
  credentials: true
}));
```

#### 3.3 Add Rate Limiting
```bash
npm install express-rate-limit
```

```typescript
// /server/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP'
});

// Apply to AI routes
app.use('/api/ai', aiLimiter);
```

#### 3.4 Input Validation
```bash
npm install express-validator
```

```typescript
// /server/middleware/validation.ts
import { body, validationResult } from 'express-validator';

export const validateAdaptContent = [
  body('content').isString().trim().isLength({ min: 1, max: 5000 }),
  body('tone').isString().isIn(ALLOWED_TONES),
  body('filter').isString().isIn(ALLOWED_FILTERS),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

### Phase 4: Environment & Configuration

#### 4.1 Update Environment Variables
```bash
# .env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret-key-here
SESSION_SECRET=your-session-secret
```

#### 4.2 Update Server Configuration
```typescript
// /server/index.ts
const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
```

## Implementation Priority

1. **Week 1**: 
   - Move all AI API calls to backend
   - Remove API keys from client code
   - Implement basic authentication

2. **Week 2**:
   - Add password hashing
   - Implement proper session management
   - Add CORS configuration

3. **Week 3**:
   - Add input validation
   - Implement rate limiting
   - Add security headers

4. **Week 4**:
   - Security testing
   - Documentation update
   - Deployment preparation

## Testing Checklist

- [ ] Verify API keys are not exposed in browser
- [ ] Test authentication flow
- [ ] Verify password hashing
- [ ] Test CORS restrictions
- [ ] Verify rate limiting works
- [ ] Test input validation
- [ ] Check for XSS vulnerabilities
- [ ] Verify HTTPS in production
- [ ] Test session management
- [ ] Audit npm dependencies

## Conclusion

The most critical issue is the exposure of API keys in client-side code. This should be addressed immediately by moving all AI service calls to protected backend endpoints. The implementation plan above provides a systematic approach to securing the application while maintaining functionality.