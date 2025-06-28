# Authentication Testing Guide

This guide covers how to test the authentication system end-to-end.

## Automated Testing

We've created a comprehensive test script that validates all authentication flows.

### Running the Test Script

1. **Start the server** (in one terminal):
   ```bash
   npm run dev
   ```

2. **Run the tests** (in another terminal):
   ```bash
   node test-auth.js
   ```

### What the Test Script Covers

The automated test script (`test-auth.js`) tests:

1. **Health Check** - Verifies server is running
2. **CORS Headers** - Ensures proper CORS configuration
3. **Registration** - Creates a new user account
4. **Login** - Authenticates with credentials
5. **Protected Routes** - Accesses authenticated endpoints
6. **AI Routes** - Tests AI endpoints with authentication
7. **Token Refresh** - Validates JWT refresh flow
8. **Rate Limiting** - Verifies rate limits are enforced
9. **Logout** - Ensures tokens are invalidated

## Manual Testing

### 1. Testing Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPassword123!"
  }'
```

Expected response:
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Testing Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### 3. Testing Protected Routes

```bash
# Get current user
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Access AI endpoint
curl -X POST http://localhost:5000/api/ai/adapt-content \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test content",
    "tone": "professional",
    "filter": "enhance"
  }'
```

### 4. Testing Rate Limiting

```bash
# Trigger rate limit by making multiple requests
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "wrong@example.com", "password": "wrong"}'
done
```

After 5 attempts, you should receive:
```json
{
  "error": "Too many authentication attempts, please try again later",
  "retryAfter": 900
}
```

### 5. Testing Token Refresh

```bash
# Login first to get refresh token cookie
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# Refresh the token
curl -X POST http://localhost:5000/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

## UI Testing

### 1. Registration Flow
1. Navigate to `/register`
2. Fill in the form:
   - Email: valid email
   - Username: 3-20 characters, alphanumeric
   - Password: 8+ chars, uppercase, lowercase, number
3. Submit and verify redirect to home page
4. Check that user menu appears in navigation

### 2. Login Flow
1. Navigate to `/login`
2. Enter credentials
3. Verify redirect to home page
4. Check user menu shows username

### 3. Protected Routes
1. Log out (click avatar → Log out)
2. Try to access `/custom-gpt`
3. Verify redirect to `/login`
4. Log in and verify access is granted

### 4. AI Features
1. While logged in, use any AI feature
2. Note the higher rate limits (100/hour vs 20/hour)
3. Check browser console for rate limit headers

## Security Checklist

- [ ] Registration validates email format
- [ ] Password requirements are enforced
- [ ] Passwords are hashed (check database)
- [ ] JWT tokens expire after 15 minutes
- [ ] Refresh tokens work correctly
- [ ] Logout invalidates tokens
- [ ] Rate limiting prevents brute force
- [ ] CORS only allows configured origins
- [ ] API keys are not exposed to client
- [ ] Protected routes require authentication
- [ ] Tokens are stored securely (httpOnly cookies for refresh)

## Troubleshooting

### Common Issues

1. **"Server is not running"**
   - Make sure to run `npm run dev` first
   - Check that port 5000 is not in use

2. **"CORS error"**
   - Check that the origin is allowed in CORS config
   - Ensure credentials are included in requests

3. **"Rate limit exceeded"**
   - Wait for the time specified in `Retry-After` header
   - Rate limits reset after the window expires

4. **"Token expired"**
   - Use the refresh endpoint to get a new access token
   - Ensure refresh token cookie is included

### Debug Mode

To see detailed logs:
1. Check server console for request logs
2. Look for rate limit headers in responses
3. Monitor browser DevTools Network tab
4. Check `X-Request-ID` headers for tracking

## Production Considerations

1. **Environment Variables**
   - Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
   - Configure `ALLOWED_ORIGINS` for your domain
   - Set `NODE_ENV=production`

2. **Rate Limiting**
   - Consider using Redis for distributed rate limiting
   - Adjust limits based on actual usage patterns
   - Monitor for false positives

3. **Security**
   - Always use HTTPS in production
   - Implement request signing for sensitive operations
   - Add audit logging for auth events
   - Consider 2FA for additional security