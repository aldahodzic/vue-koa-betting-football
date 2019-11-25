const puppeteer = require("puppeteer");

module.exports = async (url, infoSelector = "body") => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto(url, {timeout: 180000});

    await page.waitForSelector(infoSelector);

    const html = await page.evaluate(s => document.querySelector(s).outerHTML, infoSelector);

    await browser.close();

    return html;
};