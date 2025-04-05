
#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('Starting development server with Vite...');

// Run vite in development mode
const devProcess = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true
});

devProcess.on('error', (error) => {
  console.error('Failed to start development server:', error);
  process.exit(1);
});
