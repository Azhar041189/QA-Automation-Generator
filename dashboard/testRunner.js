const { exec } = require("child_process")
const path = require("path")

function runTests() {
    return new Promise((resolve, reject) => {
        // Run Playwright tests
        exec("npx playwright test", { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
            if (err) {
                // If there's an error but we still have stdout, resolve with the output
                if (stdout) {
                    resolve({
                        success: false,
                        output: stdout,
                        error: stderr
                    });
                } else {
                    reject(new Error(`Test execution failed: ${stderr}`));
                }
            } else {
                resolve({
                    success: true,
                    output: stdout
                });
            }
        });
    });
}

module.exports = { runTests };