function generatePlaywright(steps) {
    let code = ""

    steps.forEach(step => {
        if (step.type === "click")
            code += `await page.click('${step.selector}')\n`
        if (step.type === "type")
            code += `await page.fill('${step.selector}','${step.value}')\n`
    })

    return code
}

function generateSelenium(steps) {
    let code = ""

    steps.forEach(step => {
        if (step.type === "click")
            code += `driver.findElement(By.css("${step.selector}")).click();\n`
        if (step.type === "type")
            code += `driver.findElement(By.css("${step.selector}")).sendKeys("${step.value}");\n`
    })

    return code
}

function generateCypress(steps) {
    let code = ""

    steps.forEach(step => {
        if (step.type === "click")
            code += `cy.get('${step.selector}').click()\n`
        if (step.type === "type")
            code += `cy.get('${step.selector}').type('${step.value}')\n`
    })

    return code
}

module.exports = { generatePlaywright, generateSelenium, generateCypress }