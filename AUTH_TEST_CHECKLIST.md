# Authentication Test Checklist

## Pre-requisites
- [ ] Server is running (`npm run dev`)
- [ ] Database is connected
- [ ] Environment variables are set

## Registration Tests
- [ ] Can register with valid email, username, password
- [ ] Registration fails with invalid email format
- [ ] Registration fails with short password (<8 chars)
- [ ] Registration fails with password missing uppercase/lowercase/number
- [ ] Registration fails with duplicate email
- [ ] Registration fails with duplicate username
- [ ] Registration returns access token
- [ ] Registration sets refresh token cookie
- [ ] Rate limit blocks after 3 attempts per hour

## Login Tests
- [ ] Can login with email and password
- [ ] Login fails with wrong password
- [ ] Login fails with non-existent email
- [ ] Login returns access token
- [ ] Login sets refresh token cookie
- [ ] Rate limit blocks after 5 attempts per 15 minutes

## Token Tests
- [ ] Access token works for protected routes
- [ ] Expired access token returns 401
- [ ] Invalid access token returns 401
- [ ] Can refresh access token with refresh token
- [ ] Refresh token rotation works
- [ ] Old refresh token is invalidated after use

## Protected Route Tests
- [ ] `/api/auth/me` requires authentication
- [ ] `/api/auth/me` returns current user info
- [ ] `/api/ai/*` endpoints work with authentication
- [ ] Protected routes return 401 without token

## AI Endpoint Tests
- [ ] Anonymous users can access AI endpoints (20 req/hour limit)
- [ ] Authenticated users get higher limits (100 req/hour)
- [ ] Rate limit headers are present
- [ ] AI endpoints validate input
- [ ] AI endpoints handle OpenAI errors gracefully

## Logout Tests
- [ ] Logout endpoint invalidates tokens
- [ ] Cannot use old access token after logout
- [ ] Refresh token is cleared

## CORS Tests
- [ ] Localhost origins are allowed in development
- [ ] Production domain is allowed
- [ ] Unknown origins are blocked
- [ ] Credentials are allowed for valid origins
- [ ] OPTIONS preflight requests work

## Rate Limiting Tests
- [ ] General API: 100 requests per 15 minutes
- [ ] Login: 5 attempts per 15 minutes
- [ ] Registration: 3 attempts per hour
- [ ] AI endpoints: 20/hour (anonymous), 100/hour (authenticated)
- [ ] Health check: 10 per minute
- [ ] Rate limit headers are included
- [ ] 429 status with retry-after header when exceeded

## Security Tests
- [ ] Passwords are hashed in database
- [ ] JWT secrets are not exposed
- [ ] OpenAI API key is not exposed to client
- [ ] SQL injection is prevented
- [ ] XSS is prevented
- [ ] Request IDs are included for tracking

## UI Integration Tests
- [ ] Registration form works and redirects
- [ ] Login form works and redirects
- [ ] User menu shows when authenticated
- [ ] Logout button works
- [ ] Protected routes redirect to login
- [ ] AI features work when authenticated
- [ ] Error messages display properly

## Performance Tests
- [ ] Auth endpoints respond quickly (<200ms)
- [ ] Token validation is fast
- [ ] Rate limiting doesn't impact performance
- [ ] Database queries are optimized

## Error Handling Tests
- [ ] Server errors return appropriate status codes
- [ ] Validation errors have clear messages
- [ ] Network errors are handled gracefully
- [ ] Database connection errors don't expose details