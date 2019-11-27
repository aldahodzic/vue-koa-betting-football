const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const UserAgentPlugin = require('puppeteer-extra-plugin-anonymize-ua')
const fs = require("fs");
const path = require("path");
const moment = require("moment");

puppeteer.use(StealthPlugin());
puppeteer.use(UserAgentPlugin({ makeWindows: true }));

const blockedResourceTypes = [
    'image',
    'media',
    'font',
    'texttrack',
    'object',
    'beacon',
    'csp_report',
    'imageset',
    "stylesheet",
  ];
  
  const skippedResources = [
    'quantserve',
    'adzerk',
    'doubleclick',
    'adition',
    'exelator',
    'sharethrough',
    'cdn.api.twitter',
    'google-analytics',
    'googletagmanager',
    'google',
    'fontawesome',
    'facebook',
    'analytics',
    'optimizely',
    'clicktale',
    'mixpanel',
    'zedo',
    'clicksor',
    'tiqcdn',
    "yandex",
    "hotjar",
  ];
  

module.exports = async (url, elements) => {

    let infoElSelector, waitElSelector;
    if(!elements) infoElSelector = "body";
    else if(typeof elements == "string") infoElSelector = elements;
    else if(typeof elements == "object") {
      infoElSelector = elements.infoElSelector;
      waitElSelector = elements.waitElSelector;
    }

    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
  
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', request => {
        const requestUrl = request._url.split('?')[0].split('#')[0];
        if (
            blockedResourceTypes.includes(request.resourceType()) ||
            skippedResources.some(resource => requestUrl.includes(resource))
        ) request.abort();
        else request.continue();
    });

    await page.goto(url, {timeout: 180000});

    await page.waitForSelector(infoElSelector, {timeout: 90000});

    if(waitElSelector) await page.waitForSelector(waitElSelector, {timeout: 90000});

    const html = await page.evaluate(s => document.querySelector(s).outerHTML, infoElSelector);

    await browser.close();

    let fileName = `file--${moment().format("DD-MM-HH-mm")}--${url.split("://")[1].split("/")[0]}`;
    let filePath = path.join(__dirname, "../parsed", `${fileName}.html`);
    // add folder ./libs/parsers/parsed before test
    fs.writeFileSync(filePath, html, "utf-8");

    return html;
};