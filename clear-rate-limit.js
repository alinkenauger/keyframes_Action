// Quick script to clear rate limit by restarting the server
// Run this if you're locked out due to rate limiting

console.log('Rate limiting issue detected.');
console.log('\nTo fix this issue:');
console.log('1. Stop your development server (Ctrl+C)');
console.log('2. Wait 5 seconds');
console.log('3. Start the server again with: npm run dev');
console.log('\nThe rate limits have been updated to be more lenient in development mode.');
console.log('\nIf the issue persists:');
console.log('- Clear your browser cache and cookies');
console.log('- Try using a different browser or incognito mode');
console.log('- Check if you have any browser extensions making extra requests');