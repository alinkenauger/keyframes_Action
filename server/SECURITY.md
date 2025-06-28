# Security Configuration

## CORS (Cross-Origin Resource Sharing)

The server implements comprehensive CORS protection to prevent unauthorized cross-origin requests.

### Default Configuration

#### Development Mode
- Allows all `localhost` and `127.0.0.1` origins
- Enables credentials (cookies) for authentication
- Supports all standard HTTP methods

#### Production Mode
- Only allows origins specified in `ALLOWED_ORIGINS` environment variable
- Strict origin checking - requests from non-allowed origins are rejected
- Credentials are allowed only for whitelisted origins

### Environment Variables

```bash
# Comma-separated list of allowed origins
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# For strict CORS on sensitive endpoints (optional)
STRICT_ORIGINS=https://admin.yourdomain.com
```

### CORS Headers

The following headers are configured:

- **Access-Control-Allow-Origin**: Dynamic based on request origin
- **Access-Control-Allow-Credentials**: `true` (for cookie-based auth)
- **Access-Control-Allow-Methods**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- **Access-Control-Allow-Headers**: Content-Type, Authorization, X-Request-ID, etc.
- **Access-Control-Expose-Headers**: Rate limit headers, Request ID
- **Access-Control-Max-Age**: 86400 (24 hours)

### Preflight Requests

OPTIONS requests are automatically handled and return a 200 status with appropriate CORS headers.

### Implementation Details

The CORS middleware is applied globally before any other middleware to ensure all routes are protected. For sensitive endpoints requiring stricter CORS policies, use the `strictCorsMiddleware`.

```typescript
// Example of using strict CORS for admin endpoints
router.use('/admin', strictCorsMiddleware);
```

## Rate Limiting

The server implements comprehensive rate limiting to prevent abuse and protect against DDoS attacks.

### Rate Limit Tiers

1. **General API Rate Limit**
   - 100 requests per 15 minutes per IP
   - Applied to all API endpoints

2. **Authentication Endpoints**
   - Login: 5 attempts per 15 minutes
   - Registration: 3 attempts per hour
   - Password Reset: 3 attempts per 15 minutes

3. **AI Endpoints**
   - Anonymous users: 20 requests per hour
   - Authenticated users: 100 requests per hour
   - Rate limits are per user when authenticated

4. **Health Check**
   - 10 requests per minute
   - Prevents abuse of monitoring endpoints

### Rate Limit Headers

All responses include rate limit information:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: When the rate limit window resets
- `Retry-After`: Seconds until retry (on 429 responses)

### Implementation

Rate limiting uses an in-memory store by default. For production deployments with multiple servers, consider using Redis for distributed rate limiting.

## Additional Security Measures

1. **Rate Limiting**: Comprehensive rate limiting on all endpoints
2. **Request Validation**: All inputs are validated using Zod schemas
3. **JWT Authentication**: Secure token-based authentication with refresh tokens
4. **Password Hashing**: Uses bcrypt with appropriate salt rounds
5. **API Key Protection**: OpenAI keys are stored server-side only
6. **Request Monitoring**: All API requests are logged with unique IDs
7. **Error Handling**: Consistent error responses without exposing sensitive data
8. **CORS Protection**: Strict origin validation for production

## Security Best Practices

1. Always use HTTPS in production
2. Keep dependencies updated
3. Set strong JWT secrets in production
4. Configure rate limiting appropriately
5. Monitor logs for suspicious activity
6. Regularly rotate API keys and secrets
7. Use environment variables for sensitive configuration
8. Never commit `.env` files to version control