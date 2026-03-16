# QA Automation Generator

A comprehensive AI-powered test automation platform that generates complete automation frameworks from URLs, manual test cases, or design files.

## Features

### Core Capabilities
- **URL-based Test Generation**: Scan any website and generate automation tests
- **Manual Test Case Conversion**: Convert Excel/Jira test cases to automation code
- **Design-to-Automation**: Generate tests from Figma designs
- **Multi-language Support**: Java, Python, JavaScript, TypeScript
- **Multi-tool Support**: Selenium, Playwright
- **Framework Generation**: Complete POM-based frameworks with utilities

### Advanced Features
- **Self-healing Locators**: Automatically detect and fix broken locators
- **Visual Regression Testing**: Screenshot comparison for UI change detection
- **Smart Test Data Generation**: Contextual test data using Faker library
- **Website Crawling**: Automatically discover and test all pages on a site
- **CI/CD Integration**: GitHub Actions workflows for automated testing
- **Reporting**: Allure and ExtentReports integration
- **Chrome Extension**: Record user actions and generate tests
- **Control Panel Dashboard**: Web UI to manage all aspects of the platform

## Project Structure

```
qa-automation-ai/
├── test-generator.html                 # Version 1: Simple HTML generator
├── qa-test-generator.html              # Version 2: With ZIP download
├── super-qa-generator.html             # Version 3: Framework with POM
├── qa-automation-forge.html            # Version 4: With screenshots, reporting, CI/CD
├── server/                             # Node.js backend services
│   ├── index.js                        # Main Express server
│   ├── domScanner.js                   # Website DOM scanning
│   ├── locatorGenerator.js             # Optimal selector generation
│   ├── stepConverter.js                # Manual steps to automation code
│   ├── projectBuilder.js               # Framework assembly
│   ├── apiTestGenerator.js             # API test generation
│   ├── selfHealingLocator.js           # Self-healing locator algorithms
│   ├── visualRegression.js             # Screenshot capture and comparison
│   ├── testDataGenerator.js            # Smart test data generation
│   ├── websiteCrawler.js               # Automatic site crawling
│   └── figmaIntegration.js             # Figma design integration
├── web-ui/                             # Simple web interface for backend
│   └── index.html
├── vscode-extension/                   # VS Code extension for test generation
│   ├── extension.js
│   └── package.json
├── chrome-extension/                   # Chrome extension for test recording
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   └── recorder.js
├── dashboard/                          # QA Automation Control Panel
│   ├── server.js                       # Dashboard backend API
│   ├── testRunner.js                   # Test execution service
│   ├── reportService.js                # Report generation service
│   └── index.html                      # Dashboard UI
└── framework-generators/               # 1-click framework generators
    ├── selenium-testng-generator.js    # Selenium/TestNG framework
    └── manual-test-converter.js        # Excel/Jira to automation converter
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Usage

### Web Interface (HTML Files)
Simply open any of the HTML files in a browser:
- `test-generator.html` - Basic test generation
- `qa-test-generator.html` - With ZIP download capability
- `super-qa-generator.html` - Framework generation with POM structure
- `qa-automation-forge.html` - Advanced features with screenshots and CI/CD

### Backend Server
Start the Node.js server:
```bash
node server/index.js
```
Then use the web UI at `web-ui/index.html` or make API calls to `http://localhost:3000/generate`

### Dashboard
Start the dashboard server:
```bash
node dashboard/server.js
```
Access the control panel at `dashboard/index.html`

### Chrome Extension
1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension` folder

### VS Code Extension
1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Click the "..." menu and select "Install from VSIX..."
4. Package the extension first (requires vsce tool)

## API Endpoints

### Generate Tests from URL
```
POST http://localhost:3000/generate
Body: {
  "url": "https://example.com",
  "steps": ["Open login page", "Enter username", "Enter password", "Click login"],
  "tool": "playwright"
}
```

### Run Tests
```
POST http://localhost:4000/run-tests
```

### Crawl Website
```
POST http://localhost:4000/crawl-website
Body: {
  "url": "https://example.com",
  "maxPages": 10
}
```

### Convert Manual Tests
```
POST http://localhost:4000/generate-from-manual
Body: {
  "testCases": ["Step 1", "Step 2", "Step 3"],
  "tool": "playwright",
  "language": "typescript"
}
```

## Framework Generators

### 1-click Selenium/TestNG Framework
```bash
node framework-generators/selenium-testng-generator.js
```
Generates a complete Selenium/TestNG framework with POM, data-driven testing, and reporting.

### Manual Test Case Converter
```bash
node framework-generators/manual-test-converter.js --file testcases.xlsx --tool playwright --language typescript
```
Converts Excel/Jira test cases to automation code.

## Supported Technologies

### Languages
- Java (with TestNG/JUnit)
- Python (with PyTest/unittest)
- JavaScript
- TypeScript

### Tools
- Selenium WebDriver
- Playwright

### Frameworks & Libraries
- TestNG
- JUnit
- PyTest
- ExtentReports
- Allure Reports
- Apache POI (Excel handling)
- Faker (test data generation)
- Canvas (image comparison)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Playwright team for excellent browser automation library
- Selenium project for pioneering web automation
- Open Source community for all the amazing libraries used