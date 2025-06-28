#!/bin/bash

# Quick Authentication Test Script
# Tests basic auth flow using curl

API_BASE="http://localhost:5000/api"
EMAIL="test$(date +%s)@example.com"
USERNAME="testuser$(date +%s)"
PASSWORD="TestPassword123!"

echo "=== Authentication Quick Test ==="
echo "API Base: $API_BASE"
echo "Test Email: $EMAIL"
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
HEALTH=$(curl -s "$API_BASE/health")
echo "Response: $HEALTH"
echo ""

# Test 2: Registration
echo "2. Testing Registration..."
REGISTER=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")
echo "Response: $REGISTER"

# Extract access token
ACCESS_TOKEN=$(echo $REGISTER | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "Access Token: ${ACCESS_TOKEN:0:20}..."
echo ""

# Test 3: Login
echo "3. Testing Login..."
LOGIN=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "Response: $LOGIN"
echo ""

# Test 4: Get Current User
echo "4. Testing Protected Route (Get Current User)..."
ME=$(curl -s "$API_BASE/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo "Response: $ME"
echo ""

# Test 5: AI Endpoint
echo "5. Testing AI Endpoint..."
AI=$(curl -s -X POST "$API_BASE/ai/adapt-content" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Test content","tone":"professional","filter":"enhance"}')
echo "Response: ${AI:0:100}..."
echo ""

# Test 6: Rate Limiting
echo "6. Testing Rate Limiting (5 failed login attempts)..."
for i in {1..6}; do
  ATTEMPT=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@example.com","password":"wrong"}')
  echo "Attempt $i: HTTP $ATTEMPT"
  if [ "$ATTEMPT" = "429" ]; then
    echo "Rate limit enforced!"
    break
  fi
done
echo ""

echo "=== Test Complete ==="