const { chromium } = require("playwright")

async function scan(url) {

    const browser = await chromium.launch()
    const page = await browser.newPage()

    await page.goto(url)

    const elements = await page.evaluate(() => {

        const els = []

        document.querySelectorAll("input,button,a").forEach(el => {

            els.push({
                tag: el.tagName,
                id: el.id,
                name: el.name,
                text: el.innerText
            })

        })

        return els

    })

    await browser.close()

    return elements
}

module.exports = { scan }