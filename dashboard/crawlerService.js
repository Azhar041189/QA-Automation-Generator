const { crawl } = require("../server/websiteCrawler");

async function crawlWebsite(url, maxPages) {
    return await crawl(url, maxPages);
}

module.exports = { crawlWebsite };
