const { exec } = require("child_process")
const path = require("path")

function openReport() {
    return new Promise((resolve, reject) => {
        // Try to open Allure report
        exec("npx allure serve allure-results", { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
            if (err) {
                // If Allure is not available, try to generate a basic report
                exec("npm run test:report", { cwd: path.join(__dirname, '..') }, (err2, stdout2, stderr2) => {
                    if (err2) {
                        reject(new Error(`Could not open report: ${stderr2}`));
                    } else {
                        resolve({
                            success: true,
                            message: "Basic report generated",
                            output: stdout2
                        });
                    }
                });
            } else {
                resolve({
                    success: true,
                    message: "Allure report opened",
                    output: stdout
                });
            }
        });
    });
}

module.exports = { openReport };