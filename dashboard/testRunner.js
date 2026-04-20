const { spawn } = require("child_process")
const path = require("path")

function runTests(onData) {
    return new Promise((resolve, reject) => {
        // Run Playwright tests using spawn for real-time output
        const child = spawn("npx", ["playwright", "test"], { 
            cwd: path.join(__dirname, '..'),
            shell: true 
        });

        let output = "";
        let errorOutput = "";

        child.stdout.on("data", (data) => {
            const chunk = data.toString();
            output += chunk;
            if (onData) onData(chunk);
        });

        child.stderr.on("data", (data) => {
            const chunk = data.toString();
            errorOutput += chunk;
            if (onData) onData(chunk, true);
        });

        child.on("close", (code) => {
            if (code === 0) {
                resolve({ success: true, output });
            } else {
                resolve({ 
                    success: false, 
                    output, 
                    error: errorOutput || `Process exited with code ${code}` 
                });
            }
        });

        child.on("error", (err) => {
            reject(new Error(`Failed to start test process: ${err.message}`));
        });
    });
}

function runSingleTest(testName, onData) {
    return new Promise((resolve, reject) => {
        const child = spawn("npx", ["playwright", "test", testName], { 
            cwd: path.join(__dirname, '..'),
            shell: true 
        });

        let output = "";
        let errorOutput = "";

        child.stdout.on("data", (data) => {
            const chunk = data.toString();
            output += chunk;
            if (onData) onData(chunk);
        });

        child.stderr.on("data", (data) => {
            const chunk = data.toString();
            errorOutput += chunk;
            if (onData) onData(chunk, true);
        });

        child.on("close", (code) => {
            if (code === 0) {
                resolve({ success: true, output });
            } else {
                resolve({ success: false, output, error: errorOutput });
            }
        });
    });
}

module.exports = { runTests, runSingleTest };