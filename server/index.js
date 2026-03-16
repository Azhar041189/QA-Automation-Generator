const express = require("express")
const { scan } = require("./domScanner")
const { convertStep } = require("./stepConverter")
const { buildProject } = require("./projectBuilder")

const app = express()

app.use(express.json())

app.post("/generate", async (req, res) => {

    const { url, steps, tool } = req.body

    const dom = await scan(url)

    const codeSteps = steps.map(step => convertStep(step))

    const project = buildProject(tool, url, codeSteps, dom)

    res.json(project)

})

app.listen(3000, () => {
    console.log("QA Generator running on port 3000")
})