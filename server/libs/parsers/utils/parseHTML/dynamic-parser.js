const config = require("config");

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgentPlugin = require('puppeteer-extra-plugin-anonymize-ua');

puppeteer.use(StealthPlugin());
puppeteer.use(UserAgentPlugin({ makeWindows: true }));

module.exports = async (url, {dataSelector, waitSelector}) => {

    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', request => {
        const requestUrl = request._url.split('?')[0].split('#')[0];
        if (
            config.parser.block.resources.includes(request.resourceType()) ||
            config.parser.block.sites.some(resource => requestUrl.includes(resource))
        ) request.abort();
        else request.continue();
    });

    await page.goto(url, {timeout: config.parser.timeout.dynamic.page});

    await page.waitForSelector(dataSelector, {timeout: config.parser.timeout.dynamic.dom});

    if(waitSelector) await page.waitForSelector(waitSelector, {timeout: config.parser.timeout.dynamic.dom});

    const html = await page.evaluate(s => document.querySelector(s).outerHTML, dataSelector);

    await browser.close();

    return html;
};