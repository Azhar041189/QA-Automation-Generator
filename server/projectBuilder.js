function buildProject(tool, url, steps, dom) {

    const testCode = `
import { test, expect } from '@playwright/test'

test('Auto Generated Test', async ({ page }) => {

const url = '${url}'

${steps.join("\n")}

})
`

    return {
        files: [
            {
                name: "tests/generated.spec.ts",
                content: testCode
            }
        ]
    }

}

module.exports = { buildProject }