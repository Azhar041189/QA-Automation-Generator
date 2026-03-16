const express = require("express")
const cors = require("cors")
const path = require("path")
const { scan } = require("./domScanner")
const { convertStep } = require("./stepConverter")
const { buildProject } = require("./projectBuilder")
const { locator } = require("./locatorGenerator")
const { healLocator } = require("./selfHealingLocator")
const { generateApiTest } = require("./apiTestGenerator")
const { generateTestData } = require("./testDataGenerator")

const app = express()

app.use(cors())
app.use(express.json())

// Serve the web-ui
app.use(express.static(path.join(__dirname, "..", "web-ui")))

// Generate automation project from URL + steps
app.post("/generate", async (req, res) => {
    try {
        const { url, steps, tool } = req.body

        if (!url || !steps) {
            return res.status(400).json({ error: "URL and steps are required" })
        }

        const dom = await scan(url)
        const codeSteps = steps.map(step => convertStep(step))
        const project = buildProject(tool, url, codeSteps, dom)

        res.json(project)
    } catch (error) {
        console.error("Generate error:", error.message)
        res.status(500).json({ error: error.message })
    }
})

// Scan DOM elements from a URL
app.post("/scan", async (req, res) => {
    try {
        const { url } = req.body

        if (!url) {
            return res.status(400).json({ error: "URL is required" })
        }

        const elements = await scan(url)
        const locators = elements.map(el => ({
            ...el,
            locator: locator(el)
        }))

        res.json({ elements: locators })
    } catch (error) {
        console.error("Scan error:", error.message)
        res.status(500).json({ error: error.message })
    }
})

// Generate API test
app.post("/generate-api-test", (req, res) => {
    try {
        const { endpoint } = req.body

        if (!endpoint) {
            return res.status(400).json({ error: "Endpoint is required" })
        }

        const testCode = generateApiTest(endpoint)
        res.json({ code: testCode })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Generate test data
app.post("/generate-test-data", (req, res) => {
    try {
        const { type, count } = req.body
        const data = generateTestData(type || "user", count || 1)
        res.json({ data })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "QA Generator API" })
})

app.listen(3000, () => {
    console.log("QA Generator running on http://localhost:3000")
})