const { generateCode } = require('./server/ollamaService');

async function runTest() {
    console.log('--- Testing gemma3:1b ---');
    const step = "Open Google and search for Playwright";
    console.log(`Manual Step: ${step}`);
    
    try {
        const result = await generateCode(step);
        console.log('Generated Code:');
        console.log(result);
        
        if (result.includes('page.goto') || result.includes('page.fill')) {
            console.log('\nSUCCESS: Model produced valid automation code.');
        } else {
            console.log('\nWARNING: Model produced unexpected output.');
        }
    } catch (err) {
        console.error('ERROR during test:', err.message);
    }
}

runTest();
