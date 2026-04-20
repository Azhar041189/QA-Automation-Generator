const XLSX = require("xlsx");
const { generateCode } = require("../server/ollamaService");

function excelToJson(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

async function convertManualStepsToPlaywright(testCases, model = null, tool = 'Playwright', language = 'TypeScript') {
    let code = `import { test, expect } from '@playwright/test'\n\n`;

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const testName = testCase['Test Case Name'] || `Test Case ${i + 1}`;
        const steps = testCase['Steps'] || '';

        code += `test('${testName}', async ({ page }) => {\n`;

        // Process steps using Ollama
        const stepLines = steps.split('\n').filter(line => line.trim() !== '');
        for (const step of stepLines) {
            const aiCode = await generateCode(step, model, tool, language);
            code += `    ${aiCode}\n`;
        }

        code += `});\n\n`;
    }

    return code;
}

async function convertManualStepsToSelenium(testCases, model = null, tool = 'Selenium', language = 'Java') {
    let code = `package tests;\n\n`;
    code += `import base.BaseTest;\n`;
    code += `import org.testng.Assert;\n`;
    code += `import org.testng.annotations.Test;\n`;
    code += `import pages.LoginPage;\n\n`;
    code += `public class ManualTestConverter extends BaseTest {\n\n`;

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const testName = testCase['Test Case Name'] || `testCase${i + 1}`;
        const steps = testCase['Steps'] || '';

        // Convert test name to valid Java method name
        const javaMethodName = testName
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/^_|_$/g, '')
            .toLowerCase();

        code += `    @Test\n`;
        code += `    public void ${javaMethodName}() {\n`;
        code += `        // Navigate to application\n`;
        code += `        driver.get("https://example.com");\n\n`;

        // Process steps using Ollama
        const stepLines = steps.split('\n').filter(line => line.trim() !== '');
        for (const step of stepLines) {
            const javaCode = await generateCode(step, model, tool, language);
            code += `        ${javaCode}\n`;
        }

        code += `    }\n\n`;
    }

    code += `}\n`;
    return code;
}

async function convertExcelToAutomation(excelFilePath, tool, language) {
    try {
        const testCases = excelToJson(excelFilePath);

        let automationCode;
        if (tool.toLowerCase() === 'playwright' && language.toLowerCase() === 'typescript') {
            automationCode = await convertManualStepsToPlaywright(testCases);
        } else if (tool.toLowerCase() === 'selenium' && language.toLowerCase() === 'java') {
            automationCode = await convertManualStepsToSelenium(testCases);
        } else {
            throw new Error(`Unsupported tool/language combination: ${tool}/${language}`);
        }

        return {
            success: true,
            data: automationCode,
            testCaseCount: testCases.length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { 
    convertExcelToAutomation,
    convertManualStepsToPlaywright,
    convertManualStepsToSelenium
};