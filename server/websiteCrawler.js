const { chromium } = require("playwright");

async function crawl(startUrl, maxPages = 10) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const visited = new Set();
    const pagesToVisit = [startUrl];
    const discoveredPages = [];
    const pageActions = {};

    while (pagesToVisit.length > 0 && discoveredPages.length < maxPages) {
        const currentUrl = pagesToVisit.shift();

        if (visited.has(currentUrl)) continue;

        try {
            await page.goto(currentUrl, { waitUntil: 'networkidle' });
            visited.add(currentUrl);
            discoveredPages.push(currentUrl);

            // Extract links from the page
            const links = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('a[href]'));
                return anchors.map(anchor => anchor.href);
            });

            // Filter and add new links to visit queue
            for (const link of links) {
                try {
                    const urlObj = new URL(link);
                    // Only follow links on the same domain
                    if (urlObj.origin === new URL(startUrl).origin && !visited.has(link)) {
                        pagesToVisit.push(link);
                    }
                } catch (e) {
                    // Skip invalid URLs
                }
            }

            // Detect interactive elements on the page
            const actions = await page.evaluate(() => {
                const elements = [];

                // Find input fields
                document.querySelectorAll('input, textarea, select').forEach(el => {
                    elements.push({
                        type: el.tagName.toLowerCase(),
                        selector: generateSelector(el),
                        placeholder: el.placeholder || '',
                        label: getAssociatedLabel(el)
                    });
                });

                // Find buttons and clickable elements
                document.querySelectorAll('button, [role="button"], .btn, .button').forEach(el => {
                    elements.push({
                        type: 'button',
                        selector: generateSelector(el),
                        text: el.textContent.trim() || el.value || '',
                        label: getAssociatedLabel(el)
                    });
                });

                // Find links
                document.querySelectorAll('a[href]:not([href="#"]):not([href=""])').forEach(el => {
                    elements.push({
                        type: 'link',
                        selector: generateSelector(el),
                        text: el.textContent.trim(),
                        href: el.href
                    });
                });

                return elements;
            });

            pageActions[currentUrl] = actions;

        } catch (error) {
            console.error(`Error crawling ${currentUrl}:`, error.message);
        }
    }

    await browser.close();

    return {
        pages: discoveredPages,
        actions: pageActions
    };
}

function generateSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.name) return `[name="${element.name}"]`;
    if (element.placeholder) return `[placeholder="${element.placeholder}"]`;
    if (element.textContent.trim()) {
        const text = element.textContent.trim().substring(0, 50);
        return `text="${text}"`;
    }
    return element.tagName.toLowerCase();
}

function getAssociatedLabel(element) {
    // Check for aria-label
    if (element.getAttribute('aria-label')) {
        return element.getAttribute('aria-label');
    }

    // Check for aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
        const labelElement = document.getElementById(labelledBy);
        if (labelElement) {
            return labelElement.textContent.trim();
        }
    }

    // Check for associated label element
    if (element.id) {
        const labelElement = document.querySelector(`label[for="${element.id}"]`);
        if (labelElement) {
            return labelElement.textContent.trim();
        }
    }

    // Check parent label
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
        if (parent.tagName.toLowerCase() === 'label') {
            return parent.textContent.trim();
        }
        parent = parent.parentElement;
    }

    return '';
}

module.exports = { crawl };