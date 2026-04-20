const { generateCode } = require('./ollamaService');

async function convertStep(step) {
    if (!step || step.trim() === "") return "// empty step";
    
    // Call Ollama for intelligent conversion
    const code = await generateCode(step);
    
    return code;
}

module.exports = { convertStep }