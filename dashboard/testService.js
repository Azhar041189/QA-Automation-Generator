const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const testsDir = path.join(__dirname, '..', 'tests');

function getAvailableTests() {
    try {
        if (!fs.existsSync(testsDir)) {
            return [];
        }
        
        const files = fs.readdirSync(testsDir);
        // Look for common extensions
        const testFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.py') || f.endsWith('.java'));
        
        return testFiles.map(file => {
            return {
                name: file,
                target: 'Unknown', // In a real app we'd parse this from the file
                status: 'Ready'
            };
        });
    } catch (err) {
        console.error('Error reading tests dir:', err);
        return [];
    }
}

function runSingleTest(testName) {
    return new Promise((resolve, reject) => {
        // Build the command based on extension or tool.
        // Assuming playwright for TS/JS for simplicity, though this can be expanded.
        const cmd = `npx playwright test tests/${testName}`;
        
        exec(cmd, { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
            if (err) {
                if (stdout) {
                    resolve({ success: false, output: stdout, error: stderr });
                } else {
                    reject(new Error(`Test failed to execute: ${stderr}`));
                }
            } else {
                resolve({ success: true, output: stdout });
            }
        });
    });
}

module.exports = { getAvailableTests, runSingleTest };
