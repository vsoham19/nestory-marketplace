
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Make the script executable
const scriptPath = path.join(__dirname, 'src', 'dev-script.js');
try {
  fs.chmodSync(scriptPath, '755');
} catch (err) {
  console.error('Failed to make script executable:', err);
}

// Run the script
const devProcess = spawn('node', [scriptPath], {
  stdio: 'inherit',
  shell: true
});

devProcess.on('error', (error) => {
  console.error('Failed to start development script:', error);
  process.exit(1);
});
