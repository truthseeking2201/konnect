#!/usr/bin/env node

// This is just a utility to help with starting the project

console.log('🚀 Starting Konstellation Echo Lite "Neon Singularity"...');

const { execSync } = require('child_process');

// Run the Next.js dev server
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start the development server:', error);
  process.exit(1);
}