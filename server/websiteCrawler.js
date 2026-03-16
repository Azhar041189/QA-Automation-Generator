const { chromium } = require("playwright");

async function crawl(startUrl, maxPages = 10) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    function getBaseDomain(url) {
        try {
            const hostname = new URL(url).hostname;
            const parts = hostname.split('.');
            return parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
        } catch (e) { return null; }
    }

    const startDomain = getBaseDomain(startUrl);
    const visited = new Set();
    const pagesToVisit = [startUrl];
    const discoveredPages = [];
    const pageActions = {};

    while (pagesToVisit.length > 0 && discoveredPages.length < maxPages) {
        const currentUrl = pagesToVisit.shift();

        if (visited.has(currentUrl)) continue;

        try {
            console.log(`Crawling: ${currentUrl}`);
            await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            // Wait for potential client-side redirects or heavy JS
            await page.waitForTimeout(3000);
            
            const effectiveUrl = page.url();
            visited.add(currentUrl);
            visited.add(effectiveUrl);
            discoveredPages.push(effectiveUrl);

            // Extract links from the page
            const links = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('a[href]'));
                return anchors.map(anchor => {
                    try {
                        return new URL(anchor.getAttribute('href'), window.location.href).href.split('#')[0];
                    } catch (e) { return null; }
                }).filter(Boolean);
            });

            // Filter and add new links to visit queue
            for (const link of links) {
                const linkDomain = getBaseDomain(link);
                if (linkDomain === startDomain && !visited.has(link)) {
                    pagesToVisit.push(link);
                }
            }

            // Detect interactive elements on the page
            const actions = await page.evaluate(() => {
                const elements = [];

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
                    if (element.getAttribute('aria-label')) {
                        return element.getAttribute('aria-label');
                    }
                    const labelledBy = element.getAttribute('aria-labelledby');
                    if (labelledBy) {
                        const labelElement = document.getElementById(labelledBy);
                        if (labelElement) return labelElement.textContent.trim();
                    }
                    if (element.id) {
                        const labelElement = document.querySelector(`label[for="${element.id}"]`);
                        if (labelElement) return labelElement.textContent.trim();
                    }
                    let parent = element.parentElement;
                    while (parent && parent !== document.body) {
                        if (parent.tagName.toLowerCase() === 'label') {
                            return parent.textContent.trim();
                        }
                        parent = parent.parentElement;
                    }
                    return '';
                }

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

module.exports = { crawl };