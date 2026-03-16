const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function captureScreenshot(page, name) {
    const screenshotsDir = path.join(__dirname, '..', 'reports', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const screenshotPath = path.join(screenshotsDir, `${name}.png`);
    await page.screenshot({ path: screenshotPath });
    return screenshotPath;
}

async function compareScreenshots(baselinePath, currentPath, threshold = 0.1) {
    try {
        const baselineImg = await loadImage(baselinePath);
        const currentImg = await loadImage(currentPath);

        const canvas = createCanvas(baselineImg.width, baselineImg.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(baselineImg, 0, 0);
        const baselineData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(currentImg, 0, 0);
        const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let diffPixels = 0;
        const totalPixels = baselineData.length / 4;

        for (let i = 0; i < baselineData.length; i += 4) {
            const rDiff = Math.abs(baselineData[i] - currentData[i]);
            const gDiff = Math.abs(baselineData[i + 1] - currentData[i + 1]);
            const bDiff = Math.abs(baselineData[i + 2] - currentData[i + 2]);

            if (rDiff > 25 || gDiff > 25 || bDiff > 25) {
                diffPixels++;
            }
        }

        const diffRatio = diffPixels / totalPixels;
        return {
            pass: diffRatio <= threshold,
            diffRatio,
            diffPixels,
            totalPixels
        };
    } catch (error) {
        throw new Error(`Error comparing screenshots: ${error.message}`);
    }
}

module.exports = { captureScreenshot, compareScreenshots };