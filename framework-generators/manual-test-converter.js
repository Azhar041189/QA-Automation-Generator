const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

function excelToJson(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

function convertManualStepsToPlaywright(testCases) {
    let code = `import { test, expect } from '@playwright/test'\n\n`;

    testCases.forEach((testCase, index) => {
        const testName = testCase['Test Case Name'] || `Test Case ${index + 1}`;
        const steps = testCase['Steps'] || '';

        code += `test('${testName}', async ({ page }) => {\n`;

        // Process steps
        const stepLines = steps.split('\n').filter(line => line.trim() !== '');
        stepLines.forEach(step => {
            const trimmedStep = step.trim();
            if (trimmedStep.toLowerCase().includes('open') || trimmedStep.toLowerCase().includes('navigate')) {
                // Extract URL if present
                const urlMatch = trimmedStep.match(/https?:\/\/[^\s]+/);
                if (urlMatch) {
                    code += `    await page.goto('${urlMatch[0]}');\n`;
                } else {
                    code += `    // TODO: Navigate to appropriate URL\n`;
                }
            } else if (trimmedStep.toLowerCase().includes('click')) {
                // Try to extract element identifier
                if (trimmedStep.includes('button') || trimmedStep.includes('link')) {
                    code += `    // TODO: Click on element: ${trimmedStep}\n`;
                    code += `    // await page.click('selector-for-element');\n`;
                } else {
                    code += `    // TODO: Click on element: ${trimmedStep}\n`;
                    code += `    // await page.click('selector-for-element');\n`;
                }
            } else if (trimmedStep.toLowerCase().includes('enter') ||
                trimmedStep.toLowerCase().includes('type') ||
                trimmedStep.toLowerCase().includes('input')) {
                // Try to extract field name and value
                if (trimmedStep.includes('username') || trimmedStep.includes('email')) {
                    code += `    await page.fill('[name="username"], input#username, input[name="user"]', 'testuser');\n`;
                } else if (trimmedStep.includes('password') || trimmedStep.includes('pass')) {
                    code += `    await page.fill('[name="password"], input#password, input[type="password"]', 'testpass');\n`;
                } else {
                    code += `    // TODO: Enter text: ${trimmedStep}\n`;
                    code += `    // await page.fill('selector-for-field', 'testvalue');\n`;
                }
            } else if (trimmedStep.toLowerCase().includes('verify') ||
                trimmedStep.toLowerCase().includes('check') ||
                trimmedStep.toLowerCase().includes('assert')) {
                code += `    // TODO: Verify: ${trimmedStep}\n`;
                code += `    // await expect(page).toHaveURL(/expected/);\n`;
                code += `    // await expect(page.locator('selector')).toBeVisible();\n`;
            } else {
                code += `    // TODO: ${trimmedStep}\n`;
            }
        });

        code += `});\n\n`;
    });

    return code;
}

function convertManualStepsToSelenium(testCases) {
    let code = `package tests;\n\n`;
    code += `import base.BaseTest;\n`;
    code += `import org.testng.Assert;\n`;
    code += `import org.testng.annotations.Test;\n`;
    code += `import pages.LoginPage;\n\n`;
    code += `public class ManualTestConverter extends BaseTest {\n\n`;

    testCases.forEach((testCase, index) => {
        const testName = testCase['Test Case Name'] || `testCase${index + 1}`;
        const steps = testCase['Steps'] || '';

        // Convert test name to valid Java method name
        const javaMethodName = testName
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/^_|_$/g, '')
            .toLowerCase();

        code += `    @Test\n`;
        code += `    public void ${javaMethodName}() {\n`;
        code += `        // Navigate to application\n`;
        code += `        driver.get("https://example.com");\n`;
        code += `        \n`;

        // Process steps
        const stepLines = steps.split('\n').filter(line => line.trim() !== '');
        stepLines.forEach(step => {
            const trimmedStep = step.trim();
            if (trimmedStep.toLowerCase().includes('open') || trimmedStep.toLowerCase().includes('navigate')) {
                code += `        // TODO: Navigate to appropriate URL from step: "${trimmedStep}"\n`;
            } else if (trimmedStep.toLowerCase().includes('click')) {
                code += `        // TODO: Click on element from step: "${trimmedStep}"\n`;
                code += `        // driver.findElement(By.id("element-id")).click();\n`;
            } else if (trimmedStep.toLowerCase().includes('enter') ||
                trimmedStep.toLowerCase().includes('type') ||
                trimmedStep.toLowerCase().includes('input')) {
                if (trimmedStep.toLowerCase().includes('username') || trimmedStep.toLowerCase().includes('email')) {
                    code += `        // Enter username from step: "${trimmedStep}"\n`;
                    code += `        // driver.findElement(By.id("username")).sendKeys("testuser");\n`;
                } else if (trimmedStep.toLowerCase().includes('password') || trimmedStep.toLowerCase().includes('pass')) {
                    code += `        // Enter password from step: "${trimmedStep}"\n`;
                    code += `        // driver.findElement(By.id("password")).sendKeys("testpass");\n`;
                } else {
                    code += `        // TODO: Enter text from step: "${trimmedStep}"\n`;
                    code += `        // driver.findElement(By.id("field-id")).sendKeys("testvalue");\n`;
                }
            } else if (trimmedStep.toLowerCase().includes('verify') ||
                trimmedStep.toLowerCase().includes('check') ||
                trimmedStep.toLowerCase().includes('assert')) {
                code += `        // TODO: Verify from step: "${trimmedStep}"\n`;
                code += `        // Assert.assertTrue(driver.findElement(By.id("element")).isDisplayed());\n`;
            } else {
                code += `        // TODO: ${trimmedStep}\n`;
            }
        });

        code += `    }\n\n`;
    });

    code += `}\n`;
    return code;
}

function convertExcelToAutomation(excelFilePath, tool, language) {
    try {
        const testCases = excelToJson(excelFilePath);

        let automationCode;
        if (tool.toLowerCase() === 'playwright' && language.toLowerCase() === 'typescript') {
            automationCode = convertManualStepsToPlaywright(testCases);
        } else if (tool.toLowerCase() === 'selenium' && language.toLowerCase() === 'java') {
            automationCode = convertManualStepsToSelenium(testCases);
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

module.exports = { convertExcelToAutomation };