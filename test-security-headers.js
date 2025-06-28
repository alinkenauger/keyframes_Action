#!/usr/bin/env node

/**
 * Security Headers Test Script
 * Tests that all security headers are properly set
 */

const API_BASE = 'http://localhost:5000';

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

// Expected security headers
const expectedHeaders = {
  'x-dns-prefetch-control': 'off',
  'x-frame-options': 'SAMEORIGIN',
  'x-download-options': 'noopen',
  'x-content-type-options': 'nosniff',
  'x-permitted-cross-domain-policies': 'none',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-xss-protection': '0',
  'content-security-policy': null, // Will check for existence
  'permissions-policy': null, // Will check for existence
};

// Headers that should NOT be present
const unwantedHeaders = ['x-powered-by'];

async function testSecurityHeaders() {
  console.log(`${colors.cyan}=== Security Headers Test ===${colors.reset}`);
  console.log(`Testing: ${API_BASE}\n`);

  try {
    // Test root endpoint
    console.log(`${colors.yellow}Testing root endpoint (/)...${colors.reset}`);
    const rootResponse = await fetch(API_BASE + '/');
    await checkHeaders(rootResponse, 'Root');

    // Test API endpoint
    console.log(`\n${colors.yellow}Testing API endpoint (/api/health)...${colors.reset}`);
    const apiResponse = await fetch(API_BASE + '/api/health');
    await checkHeaders(apiResponse, 'API');

    // Test auth endpoint for cache headers
    console.log(`\n${colors.yellow}Testing auth endpoint (/api/auth/me)...${colors.reset}`);
    const authResponse = await fetch(API_BASE + '/api/auth/me');
    await checkHeaders(authResponse, 'Auth', true);

    // Test HTTPS redirect header (simulated)
    console.log(`\n${colors.yellow}Testing HTTPS headers...${colors.reset}`);
    const httpsResponse = await fetch(API_BASE + '/api/health', {
      headers: { 'x-forwarded-proto': 'https' }
    });
    
    if (httpsResponse.headers.get('strict-transport-security')) {
      console.log(`${colors.green}✓ HSTS header present when HTTPS detected${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ HSTS header missing when HTTPS detected${colors.reset}`);
    }

  } catch (error) {
    console.log(`${colors.red}✗ Server is not running or error occurred: ${error.message}${colors.reset}`);
    console.log(`\nPlease start the server with 'npm run dev' and try again.`);
    process.exit(1);
  }
}

async function checkHeaders(response, endpoint, checkCache = false) {
  const headers = Object.fromEntries(response.headers.entries());
  let passed = 0;
  let failed = 0;

  // Check expected headers
  for (const [header, expectedValue] of Object.entries(expectedHeaders)) {
    const actualValue = headers[header];
    
    if (expectedValue === null) {
      // Just check for existence
      if (actualValue) {
        console.log(`${colors.green}✓ ${header}: Present${colors.reset}`);
        passed++;
      } else {
        console.log(`${colors.red}✗ ${header}: Missing${colors.reset}`);
        failed++;
      }
    } else {
      // Check exact value
      if (actualValue === expectedValue) {
        console.log(`${colors.green}✓ ${header}: ${actualValue}${colors.reset}`);
        passed++;
      } else {
        console.log(`${colors.red}✗ ${header}: Expected '${expectedValue}', got '${actualValue || 'missing'}'${colors.reset}`);
        failed++;
      }
    }
  }

  // Check unwanted headers
  for (const header of unwantedHeaders) {
    if (headers[header]) {
      console.log(`${colors.red}✗ ${header}: Should not be present (value: ${headers[header]})${colors.reset}`);
      failed++;
    } else {
      console.log(`${colors.green}✓ ${header}: Correctly removed${colors.reset}`);
      passed++;
    }
  }

  // Check cache headers for auth endpoints
  if (checkCache) {
    const cacheControl = headers['cache-control'];
    if (cacheControl && cacheControl.includes('no-store')) {
      console.log(`${colors.green}✓ cache-control: Properly set for auth endpoint${colors.reset}`);
      passed++;
    } else {
      console.log(`${colors.red}✗ cache-control: Should include 'no-store' for auth endpoints${colors.reset}`);
      failed++;
    }
  }

  // Check CORS headers
  if (headers['access-control-allow-origin']) {
    console.log(`${colors.green}✓ CORS headers present${colors.reset}`);
    passed++;
  }

  // Summary for this endpoint
  console.log(`\n${endpoint} Summary: ${colors.green}${passed} passed${colors.reset}, ${colors.red}${failed} failed${colors.reset}`);
  
  return { passed, failed };
}

// Parse CSP header for readability
function parseCSP(csp) {
  if (!csp) return 'Not set';
  
  const directives = csp.split(';').map(d => d.trim());
  console.log(`${colors.blue}Content Security Policy:${colors.reset}`);
  directives.forEach(directive => {
    console.log(`  ${directive}`);
  });
}

// Run the tests
testSecurityHeaders().then(() => {
  console.log(`\n${colors.magenta}=== Test Complete ===${colors.reset}`);
  console.log(`\n${colors.cyan}Recommendations:${colors.reset}`);
  console.log(`1. Ensure all security headers are properly set`);
  console.log(`2. Review CSP directives for your specific needs`);
  console.log(`3. Test with production settings for accurate results`);
  console.log(`4. Consider using a security scanner like Mozilla Observatory`);
});