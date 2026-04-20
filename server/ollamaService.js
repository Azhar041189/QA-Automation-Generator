const axios = require('axios');

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_CHAT_URL = 'http://localhost:11434/api/chat';
let DEFAULT_MODEL = 'gemma4:e2b';

async function generateCode(prompt, modelOverride = null, tool = 'Playwright', language = 'JavaScript') {
    return _generateInternal(prompt, modelOverride, tool, language, false);
}

async function educationalGenerateCode(prompt, modelOverride = null, tool = 'Playwright', language = 'JavaScript') {
    return _generateInternal(prompt, modelOverride, tool, language, true);
}

async function _generateInternal(prompt, modelOverride, tool, language, isEducational) {
    const model = modelOverride || DEFAULT_MODEL;
    const systemPrompt = isEducational 
        ? `You are a world-class QA Automation Tutor. 
           Convert the ENTIRE manual test suite provided into full, executable ${tool} ${language} code. 
           CRITICAL: For every key action, include a line starting with "// STUDY:" explaining the locator strategy.
           Continue generating until the entire test suite is covered. 
           Return only the code with comments.`
        : `You are an expert QA Automation engineer. 
           Convert the following manual test step into executable ${tool} (${language}) code.
           Return ONLY the line of code, no explanations, no backticks, no markdown.`;

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: model,
            prompt: `${systemPrompt}
            
            Manual Step: "${prompt}"
            
            Executable ${tool} ${language} Code:`,
            stream: false,
            options: {
                temperature: 0.1,
                num_ctx: 4096,
                num_predict: 2048
            }
        });

        const rawResponse = response.data.response.trim();
        return rawResponse.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
    } catch (error) {
        console.error('Ollama generation error:', error.message);
        const isJava = language.toLowerCase() === 'java';
        if (prompt.toLowerCase().includes("open")) return isJava ? `driver.get(url);` : `await page.goto(url)`;
        if (prompt.toLowerCase().includes("click")) return isJava ? `driver.findElement(By.cssSelector("button")).click();` : `await page.click('button')`;
        return `// AI generation failed: ${error.message}`;
    }
}

async function getBestLocator(elementData, modelOverride = null) {
    const model = modelOverride || DEFAULT_MODEL;
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: model,
            prompt: `Given the following DOM element metadata, provide the most stable Playwright selector.
            Metadata: ${JSON.stringify(elementData)}
            
            Return ONLY the selector string (e.g., "#login-btn", "text=Submit", "[name='email']"). 
            No explanations.`,
            stream: false
        });

        const rawResponse = response.data.response.trim();
        return rawResponse.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
    } catch (error) {
        return null;
    }
}

async function chat(messages, modelOverride = null) {
    const model = modelOverride || DEFAULT_MODEL;
    try {
        const response = await axios.post(OLLAMA_CHAT_URL, {
            model: model,
            messages: messages,
            stream: false
        });
        return response.data.message.content;
    } catch (error) {
        console.error('Ollama chat error:', error.message);
        throw error;
    }
}

function setModel(modelName) {
    if (modelName) DEFAULT_MODEL = modelName;
}

module.exports = { generateCode, educationalGenerateCode, getBestLocator, setModel, chat };
