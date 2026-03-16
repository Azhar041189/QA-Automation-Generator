---
description: Comprehensive workflow for generating and managing QA automation tests
---

# QA Automation AI User Workflow

This workflow guides you through the process of generating, executing, and monitoring automated tests using the QA Forge Control Panel.

## 1. Environment Setup
Launch the complete ecosystem using the integrated start script:
// turbo
1. Run `npm start` in the project root.
   - This starts the **Main Generation Server** (port 3000) and the **Dashboard UI** (port 4000).
2. Open your browser to `http://localhost:4000`.

## 2. Configuration (One-time Setup)
Ensure the AI generates code tailored to your environment:
1. Click on **Settings** in the sidebar.
2. Set your **Default Framework** (e.g., Playwright).
3. Set your **Default Language** (e.g., Python or TypeScript).
4. Click **Save Preferences**.

## 3. Test Generation
Create your first automated test:
1. Return to the **Dashboard** tab.
2. Enter the **Target Website URL**.
3. In the **Manual Test Case / Steps** area, describe what the test should do (e.g., "Login with valid credentials and verify dashboard title").
4. Click **Generate Automation Code**.
   - View the progress in the **Interactive Console**.
   - Once finished, the test file is automatically saved to the `tests/` directory.

## 4. Test Management & Execution
Review and run your tests:
1. Click on **Test Suite** in the sidebar.
2. Find your newly generated test in the list.
3. Click the **Run** button next to the test.
   - Watch the execution logs in the console.

## 5. Reporting & Analysis
Verify and debug test results:
1. Click on **Reports** in the sidebar.
2. Review the **Execution History** to see pass/fail trends.
3. Click **Launch Full Report viewer** to open the interactive Allure report.

## 6. Integrations (Optional)
Connect your design and CI workflows:
1. Click on **Integrations** in the sidebar.
2. Configure **Figma** to generate Page Objects from designs.
3. Connect **GitHub Actions** or **Jenkins** for CI/CD triggered runs.
