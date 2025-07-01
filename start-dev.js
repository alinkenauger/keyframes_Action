#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

// Start the server with tsx and path resolution
const server = spawn('npx', ['tsx', 'server/index.ts'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: {
        ...process.env,
        NODE_ENV: 'development'
    }
});

server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

server.on('exit', (code) => {
    process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    server.kill('SIGINT');
});

process.on('SIGTERM', () => {
    server.kill('SIGTERM');
});