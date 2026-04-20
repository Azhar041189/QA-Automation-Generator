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

    const aiModel = options.aiModel || null;

    if (tool.toLowerCase() === 'playwright') {
        code = await convertManualStepsToPlaywright(formattedTestCases, aiModel, tool, language);
    } else if (tool.toLowerCase() === 'selenium') {
        // If enterprise options are selected, generate full framework
        if (options.headless || options.useExcel) {
            const projectName = `enterprise-selenium-${Date.now()}`;
            const projectPath = generateSeleniumTestNGFramework(projectName);
            message = `Enterprise Framework generated at: ${projectPath}\n\n`;
            code = message + await convertManualStepsToSelenium(formattedTestCases, aiModel, tool, language);
        } else {
            code = await convertManualStepsToSelenium(formattedTestCases, aiModel, tool, language);
        }
    }

    return {
        success: true,
        code: code
    };
}

module.exports = { generateFromManual };
