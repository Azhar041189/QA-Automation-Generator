function convertStep(step) {

    step = step.toLowerCase()

    if (step.includes("open"))
        return `await page.goto(url)`

    if (step.includes("username"))
        return `await page.fill('#username','testuser')`

    if (step.includes("password"))
        return `await page.fill('#password','password')`

    if (step.includes("click"))
        return `await page.click('#login')`

    if (step.includes("verify"))
        return `await expect(page).toHaveURL(/dashboard/)`

    return "// step not recognized"

}

module.exports = { convertStep }