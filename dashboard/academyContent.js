const academyChallenges = [
    {
        id: 'L1-001',
        title: 'My First Click',
        level: 'Beginner',
        description: 'Learn how to interact with a simple button. The goal is to find the "Login" button and click it.',
        steps: [
            '1. Open the practice page',
            '2. Find the Login button',
            '3. Click the button'
        ],
        hint: 'Use id="login-btn" as the most stable locator.',
        category: 'Web Basics'
    },
    {
        id: 'L1-002',
        title: 'Input Mastery',
        level: 'Beginner',
        description: 'Practice workflow for filling out a simple login form.',
        steps: [
            '1. Open practice page',
            '2. Type "student" in username',
            '3. Type "Password123" in password',
            '4. Click Submit'
        ],
        hint: 'Input fields often have name or id attributes.',
        category: 'Web Basics'
    },
    {
        id: 'L2-001',
        title: 'The Waiting Game',
        level: 'Intermediate',
        description: 'Learn how to handle elements that take time to appear.',
        steps: [
            '1. Click the "Load Data" button',
            '2. Wait for the loading spinner to disappear',
            '3. Verify text "Loaded Successfully" is visible'
        ],
        hint: 'Playwright handles wait-for-selector automatically, but assertions can be explicit.',
        category: 'Sync & Waits'
    }
];

if (typeof module !== 'undefined') {
    module.exports = { academyChallenges };
}
