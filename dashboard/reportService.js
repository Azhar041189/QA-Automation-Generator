const { exec } = require("child_process")
const path = require("path")

function openReport() {
    return new Promise((resolve, reject) => {
        // Favor Playwright's native HTML report viewer
        console.log("Attempting to open Playwright HTML report...");
        exec("npx playwright show-report", { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
            if (err) {
                // Try Allure as fallback
                exec("npx allure serve allure-results", { cwd: path.join(__dirname, '..') }, (err2, stdout2, stderr2) => {
                    if (err2) {
                        resolve({
                            success: false,
                            message: "Report viewer failed to start.",
                            error: "No report found. Run tests first."
                        });
                    } else {
                        resolve({ success: true, message: "Allure report opened" });
                    }
                });
            } else {
                resolve({ success: true, message: "Playwright HTML report opened" });
            }
        });
    });
}

module.exports = { openReport };