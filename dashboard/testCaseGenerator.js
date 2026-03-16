const { convertManualStepsToPlaywright, convertManualStepsToSelenium } = require("../framework-generators/manual-test-converter");
const { generateSeleniumTestNGFramework } = require("../framework-generators/selenium-testng-generator");

async function generateFromManual(testCases, tool, language, options = {}) {
    // Formulate the test cases into the structure expected by the converter
    const formattedTestCases = [{
        'Test Case Name': 'Dashboard Generated Test',
        'Steps': Array.isArray(testCases) ? testCases.join('\n') : testCases
    }];

    let code;
    let message = "";

    if (tool.toLowerCase() === 'playwright') {
        code = convertManualStepsToPlaywright(formattedTestCases);
    } else if (tool.toLowerCase() === 'selenium') {
        // If enterprise options are selected, generate full framework
        if (options.headless || options.useExcel) {
            const projectName = `enterprise-selenium-${Date.now()}`;
            const projectPath = generateSeleniumTestNGFramework(projectName);
            message = `Enterprise Framework generated at: ${projectPath}\n\n`;
            code = message + convertManualStepsToSelenium(formattedTestCases);
        } else {
            code = convertManualStepsToSelenium(formattedTestCases);
        }
    }

    return {
        success: true,
        code: code
    };
}

module.exports = { generateFromManual };
