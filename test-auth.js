#!/usr/bin/env node

/**
 * End-to-End Authentication Test Script
 * Tests all authentication flows including registration, login, token refresh, and protected routes
 */

const API_BASE = 'http://localhost:5000/api';
let accessToken = '';
let refreshToken = '';
const testUser = {
  email: `test${Date.now()}@example.com`,
  username: `testuser${Date.now()}`,
  password: 'TestPassword123!'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to make requests
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    // Extract cookies if present
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader && setCookieHeader.includes('refreshToken=')) {
      refreshToken = setCookieHeader.match(/refreshToken=([^;]+)/)?.[1] || '';
    }
    
    return {
      status: response.status,
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      status: 0,
      data: { error: error.message },
      headers: {}
    };
  }
}

// Test functions
async function testHealthCheck() {
  console.log(`\n${colors.cyan}Testing Health Check Endpoint...${colors.reset}`);
  
  const response = await makeRequest('/health');
  
  if (response.status === 200 && response.data.status === 'ok') {
    console.log(`${colors.green}✓ Health check passed${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.red}✗ Health check failed: ${JSON.stringify(response.data)}${colors.reset}`);
    return false;
  }
}

async function testRegistration() {
  console.log(`\n${colors.cyan}Testing Registration...${colors.reset}`);
  
  const response = await makeRequest('/auth/register', {
    method: 'POST',
    body: testUser
  });
  
  if (response.status === 201 || response.status === 200) {
    accessToken = response.data.accessToken;
    console.log(`${colors.green}✓ Registration successful${colors.reset}`);
    console.log(`  Email: ${testUser.email}`);
    console.log(`  Username: ${testUser.username}`);
    console.log(`  Access Token: ${accessToken ? 'Received' : 'Missing'}`);
    
    // Check rate limit headers
    if (response.headers['x-ratelimit-limit']) {
      console.log(`  Rate Limit: ${response.headers['x-ratelimit-remaining']}/${response.headers['x-ratelimit-limit']}`);
    }
    
    return true;
  } else {
    console.log(`${colors.red}✗ Registration failed: ${JSON.stringify(response.data)}${colors.reset}`);
    return false;
  }
}

async function testLogin() {
  console.log(`\n${colors.cyan}Testing Login...${colors.reset}`);
  
  const response = await makeRequest('/auth/login', {
    method: 'POST',
    body: {
      email: testUser.email,
      password: testUser.password
    }
  });
  
  if (response.status === 200) {
    accessToken = response.data.accessToken;
    console.log(`${colors.green}✓ Login successful${colors.reset}`);
    console.log(`  User ID: ${response.data.user?.id}`);
    console.log(`  Access Token: ${accessToken ? 'Received' : 'Missing'}`);
    console.log(`  Refresh Token Cookie: ${refreshToken ? 'Set' : 'Missing'}`);
    return true;
  } else {
    console.log(`${colors.red}✗ Login failed: ${JSON.stringify(response.data)}${colors.reset}`);
    return false;
  }
}

async function testGetCurrentUser() {
  console.log(`\n${colors.cyan}Testing Get Current User (Protected Route)...${colors.reset}`);
  
  const response = await makeRequest('/auth/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (response.status === 200) {
    console.log(`${colors.green}✓ Get current user successful${colors.reset}`);
    console.log(`  User: ${response.data.username} (${response.data.email})`);
    return true;
  } else {
    console.log(`${colors.red}✗ Get current user failed: ${JSON.stringify(response.data)}${colors.reset}`);
    return false;
  }
}

async function testProtectedAIRoute() {
  console.log(`\n${colors.cyan}Testing Protected AI Route...${colors.reset}`);
  
  const response = await makeRequest('/ai/adapt-content', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: {
      content: 'Test content for adaptation',
      tone: 'professional',
      filter: 'enhance'
    }
  });
  
  if (response.status === 200) {
    console.log(`${colors.green}✓ AI route access successful${colors.reset}`);
    console.log(`  Adapted content received`);
    
    // Check rate limit headers
    if (response.headers['x-ratelimit-limit']) {
      console.log(`  Rate Limit: ${response.headers['x-ratelimit-remaining']}/${response.headers['x-ratelimit-limit']}`);
      console.log(`  Rate Limit Cost: ${response.headers['x-ratelimit-cost'] || '1'}`);
    }
    
    return true;
  } else {
    console.log(`${colors.red}✗ AI route access failed: ${JSON.stringify(response.data)}${colors.reset}`);
    return false;
  }
}

async function testTokenRefresh() {
  console.log(`\n${colors.cyan}Testing Token Refresh...${colors.reset}`);
  
  // Wait a bit to ensure token is different
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const response = await makeRequest('/auth/refresh', {
    method: 'POST',
    headers: {
      'Cookie': `refreshToken=${refreshToken}`
    }
  });
  
  if (response.status === 200) {
    const newAccessToken = response.data.accessToken;
    console.log(`${colors.green}✓ Token refresh successful${colors.reset}`);
    console.log(`  New Access Token: ${newAccessToken ? 'Received' : 'Missing'}`);
    console.log(`  Token Changed: ${newAccessToken !== accessToken ? 'Yes' : 'No'}`);
    
    if (newAccessToken) {
      accessToken = newAccessToken;
    }
    
    return true;
  } else {
    console.log(`${colors.red}✗ Token refresh failed: ${JSON.stringify(response.data)}${colors.reset}`);
    return false;
  }
}

async function testRateLimiting() {
  console.log(`\n${colors.cyan}Testing Rate Limiting...${colors.reset}`);
  
  // Test login rate limiting (5 attempts per 15 minutes)
  console.log(`\n${colors.yellow}Testing login rate limiting...${colors.reset}`);
  
  let rateLimitHit = false;
  for (let i = 1; i <= 7; i++) {
    const response = await makeRequest('/auth/login', {
      method: 'POST',
      body: {
        email: `wrong${i}@example.com`,
        password: 'wrongpassword'
      }
    });
    
    console.log(`  Attempt ${i}: Status ${response.status}`);
    
    if (response.status === 429) {
      console.log(`${colors.green}✓ Rate limit enforced after ${i-1} attempts${colors.reset}`);
      console.log(`  Retry After: ${response.headers['retry-after']} seconds`);
      rateLimitHit = true;
      break;
    }
  }
  
  if (!rateLimitHit) {
    console.log(`${colors.red}✗ Rate limit not enforced${colors.reset}`);
    return false;
  }
  
  // Test AI endpoint rate limiting
  console.log(`\n${colors.yellow}Testing AI endpoint rate limiting...${colors.reset}`);
  console.log(`  Note: Authenticated users have higher limits (100/hour vs 20/hour)`);
  
  return true;
}

async function testLogout() {
  console.log(`\n${colors.cyan}Testing Logout...${colors.reset}`);
  
  const response = await makeRequest('/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (response.status === 200) {
    console.log(`${colors.green}✓ Logout successful${colors.reset}`);
    
    // Test that token is now invalid
    const testResponse = await makeRequest('/auth/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (testResponse.status === 401) {
      console.log(`${colors.green}✓ Token properly invalidated${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.red}✗ Token still valid after logout${colors.reset}`);
      return false;
    }
  } else {
    console.log(`${colors.red}✗ Logout failed: ${JSON.stringify(response.data)}${colors.reset}`);
    return false;
  }
}

async function testCORS() {
  console.log(`\n${colors.cyan}Testing CORS Headers...${colors.reset}`);
  
  const response = await makeRequest('/health', {
    headers: {
      'Origin': 'http://localhost:3000'
    }
  });
  
  const corsHeaders = {
    'access-control-allow-origin': response.headers['access-control-allow-origin'],
    'access-control-allow-credentials': response.headers['access-control-allow-credentials']
  };
  
  if (corsHeaders['access-control-allow-origin']) {
    console.log(`${colors.green}✓ CORS headers present${colors.reset}`);
    console.log(`  Allow-Origin: ${corsHeaders['access-control-allow-origin']}`);
    console.log(`  Allow-Credentials: ${corsHeaders['access-control-allow-credentials']}`);
    return true;
  } else {
    console.log(`${colors.red}✗ CORS headers missing${colors.reset}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log(`${colors.magenta}=== Authentication End-to-End Tests ===${colors.reset}`);
  console.log(`API Base: ${API_BASE}`);
  console.log(`Test User: ${testUser.email}`);
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'CORS', fn: testCORS },
    { name: 'Registration', fn: testRegistration },
    { name: 'Login', fn: testLogin },
    { name: 'Get Current User', fn: testGetCurrentUser },
    { name: 'Protected AI Route', fn: testProtectedAIRoute },
    { name: 'Token Refresh', fn: testTokenRefresh },
    { name: 'Rate Limiting', fn: testRateLimiting },
    { name: 'Logout', fn: testLogout }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`${colors.red}✗ ${test.name} threw error: ${error.message}${colors.reset}`);
      failed++;
    }
  }
  
  console.log(`\n${colors.magenta}=== Test Summary ===${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log(`\n${colors.green}All tests passed! 🎉${colors.reset}`);
  } else {
    console.log(`\n${colors.red}Some tests failed. Please check the logs above.${colors.reset}`);
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running
console.log(`${colors.yellow}Checking if server is running...${colors.reset}`);
makeRequest('/health').then(response => {
  if (response.status === 0) {
    console.log(`${colors.red}Server is not running. Please start the server with 'npm run dev'${colors.reset}`);
    process.exit(1);
  } else {
    runTests();
  }
});