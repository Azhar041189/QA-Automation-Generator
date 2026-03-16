const axios = require('axios');

async function getFigmaDesign(fileKey, token) {
    try {
        const response = await axios.get(
            `https://api.figma.com/v1/files/${fileKey}`,
            {
                headers: {
                    "X-Figma-Token": token
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching Figma design: ${error.message}`);
    }
}

function parseComponents(nodes) {
    const components = [];

    function traverseNode(node) {
        // Check if node is a component or instance
        if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
            components.push({
                id: node.id,
                name: node.name,
                type: node.type,
                description: node.description || ''
            });
        }

        // Process children if they exist
        if (node.children) {
            node.children.forEach(traverseNode);
        }
    }

    // Start traversal from the document's children
    if (nodes && nodes.children) {
        nodes.children.forEach(traverseNode);
    }

    return components;
}

function generateLocatorFromComponent(component) {
    // Generate a locator based on component name
    const name = component.name.toLowerCase();

    if (name.includes('button') || name.includes('btn')) {
        // Try to find by text content or role
        return `role=button[name="${component.name}"]`;
    } else if (name.includes('input') || name.includes('field') || name.includes('text')) {
        // Try to find by label or placeholder
        return `role=textbox[name="${component.name}"]`;
    } else if (name.includes('checkbox')) {
        return `role=checkbox[name="${component.name}"]`;
    } else if (name.includes('radio')) {
        return `role=radio[name="${component.name}"]`;
    } else if (name.includes('dropdown') || name.includes('select')) {
        return `role=combobox[name="${component.name}"]`;
    } else if (name.includes('link')) {
        return `role=link[name="${component.name}"]`;
    } else {
        // Fallback to testid or CSS selector based on name
        const testId = name.replace(/\s+/g, '-');
        return `[data-test-id="${testId}"]`;
    }
}

function generatePageObject(components, pageName) {
    let content = `import { Page } from '@playwright/test'\n\nexport class ${pageName}Page {\n\n  constructor(private page: Page) {}\n\n`;

    components.forEach(component => {
        const locator = generateLocatorFromComponent(component);
        const propertyName = component.name
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/^_|_$/g, '')
            .toLowerCase();

        content += `  ${propertyName} = '${locator}'\n\n`;
    });

    content += '}\n';
    return content;
}

function generateTestFromComponents(components, pageName, testSteps = '') {
    let content = `import { test, expect } from '@playwright/test'\n`;
    content += `import { ${pageName}Page } from '../pages/${pageName}Page'\n\n`;
    content += `test.describe('${pageName} Page Tests', () => {\n\n`;
    content += `  let page: ${pageName}Page;\n\n`;
    content += `  test.beforeEach(async ({ page: browserPage }) => {\n`;
    content += `    page = new ${pageName}Page(browserPage);\n`;
    content += `    // Navigate to the page - URL should be configured in test setup\n`;
    content += `    // await browserPage.goto('https://example.com/${pageName.toLowerCase()}');\n`;
    content += `  });\n\n`;

    if (testSteps) {
        content += `  test('${testSteps}', async () => {\n`;
        content += `    // TODO: Implement test steps based on: ${testSteps}\n`;
        content += `  });\n\n`;
    } else {
        // Generate basic interaction tests for each component
        components.forEach(component => {
            const propertyName = component.name
                .replace(/[^a-zA-Z0-9]/g, '_')
                .replace(/^_|_$/g, '')
                .toLowerCase();

            if (component.name.toLowerCase().includes('button') ||
                component.name.toLowerCase().includes('btn')) {
                content += `  test('click ${component.name} button', async () => {\n`;
                content += `    await page.${propertyName}.click();\n`;
                content += `  });\n\n`;
            } else if (component.name.toLowerCase().includes('input') ||
                component.name.toLowerCase().includes('field') ||
                component.name.toLowerCase().includes('text')) {
                content += `  test('fill ${component.name} field', async () => {\n`;
                content += `    await page.${propertyName}.fill('test value');\n`;
                content += `  });\n\n`;
            } else if (component.name.toLowerCase().includes('checkbox')) {
                content += `  test('toggle ${component.name} checkbox', async () => {\n`;
                content += `    await page.${propertyName}.check();\n`;
                content += `  });\n\n`;
                content += `  test('uncheck ${component.name} checkbox', async () => {\n`;
                content += `    await page.${propertyName}.uncheck();\n`;
                content += `  });\n\n`;
            } else if (component.name.toLowerCase().includes('radio')) {
                content += `  test('select ${component.name} radio', async () => {\n`;
                content += `    await page.${propertyName}.check();\n`;
                content += `  });\n\n`;
            } else if (component.name.toLowerCase().includes('dropdown') ||
                component.name.toLowerCase().includes('select')) {
                content += `  test('select option in ${component.name} dropdown', async () => {\n`;
                content += `    await page.${propertyName}.selectOption('option1');\n`;
                content += `  });\n\n`;
            } else if (component.name.toLowerCase().includes('link')) {
                content += `  test('click ${component.name} link', async () => {\n`;
                content += `    await page.${propertyName}.click();\n`;
                content += `  });\n\n`;
            }
        });
    }

    content += `});\n`;
    return content;
}

module.exports = {
    getFigmaDesign,
    parseComponents,
    generateLocatorFromComponent,
    generatePageObject,
    generateTestFromComponents
};