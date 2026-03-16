const express = require("express")
const { runTests } = require("./testRunner")
const { openReport } = require("./reportService")
const { crawlWebsite } = require("./crawlerService")
const { generateFromManual } = require("./testCaseGenerator")

const app = express()

app.use(express.json())

app.post("/run-tests", async (req, res) => {
    try {
        const result = await runTests()
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
        const { testCases, tool, language } = req.body
        const result = await generateFromManual(testCases, tool, language)
        res.json({ success: true, data: result })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.listen(4000, () => {
    console.log("QA Dashboard API running on port 4000")
})