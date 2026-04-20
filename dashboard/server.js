const express = require("express")
const cors = require("cors")
const path = require("path")
const { runTests } = require("./testRunner")
const { openReport } = require("./reportService")
const { crawlWebsite } = require("./crawlerService")
const { generateFromManual } = require("./testCaseGenerator")
// newly added services for dashboard modules
const { getAvailableTests, runSingleTest } = require("./testService")
const { getHistory, addHistoryRecord } = require("./historyService")
const ollamaService = require("../server/ollamaService")

const app = express()

app.use(cors())
app.use(express.json())

// SSE Clients
let clients = [];

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    req.on('close', () => {
        clients = clients.filter(c => c.id !== clientId);
    });
});

function broadcast(data) {
    clients.forEach(c => c.res.write(`data: ${JSON.stringify(data)}\n\n`));
}

// Serve the dashboard UI
app.use(express.static(__dirname))

// Serve Playwright HTML reports statically
app.use("/report", express.static(path.join(__dirname, "..", "playwright-report")))

// Serve Allure report (if generated)
app.use("/allure", express.static(path.join(__dirname, "..", "allure-report")))

app.get("/tests", (req, res) => {
    try {
        const tests = getAvailableTests()
        res.json({ success: true, data: tests })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.post("/tests/run-single", async (req, res) => {
    try {
        const result = await runSingleTest(testName, (chunk) => {
            broadcast({ type: 'log', message: chunk });
        })
        
        // Log to history
        addHistoryRecord({
            type: 'single',
            name: testName,
            status: result.success ? 'Passed' : 'Failed'
        })

        res.json({ success: true, data: result })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.get("/history", (req, res) => {
    try {
        const history = getHistory()
        res.json({ success: true, data: history })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.post("/run-tests", async (req, res) => {
    try {
        broadcast({ type: 'status', message: 'Starting full suite' });
        const result = await runTests((chunk) => {
            broadcast({ type: 'log', message: chunk });
        })
        
        // Log to history
        addHistoryRecord({
            type: 'suite',
            name: 'Full Test Suite',
            status: result.success ? 'Passed' : 'Failed'
        })
        
        res.json({ success: true, data: result })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.post("/open-report", async (req, res) => {
    try {
        openReport()
        res.json({ success: true, message: "Report opened" })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.post("/crawl-website", async (req, res) => {
    try {
        const { url, maxPages } = req.body
        const result = await crawlWebsite(url, maxPages || 10)
        res.json({ success: true, data: result })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.post("/generate-from-manual", async (req, res) => {
    try {
        const { testCases, tool, language, options } = req.body
        const result = await generateFromManual(testCases, tool, language, options)
        res.json({ success: true, data: result })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.post("/ai/educational-generate", async (req, res) => {
    try {
        const { prompt, tool, language, model } = req.body
        const code = await ollamaService.educationalGenerateCode(prompt, model, tool, language)
        res.json({ success: true, code: code })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.post("/ai/chat", async (req, res) => {
    try {
        const { messages, model } = req.body
        const response = await ollamaService.chat(messages, model)
        res.json({ success: true, response: response })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.listen(4000, () => {
    console.log("QA Dashboard API running on http://localhost:4000")
})