const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const UserAgentPlugin = require('puppeteer-extra-plugin-anonymize-ua')

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
  

module.exports = async (url, infoSelector = "body") => {

    const browser = await puppeteer.launch({headless: true});

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

    await page.goto(url, {timeout: 120000});

    await page.waitForSelector(infoSelector);

    const html = await page.evaluate(s => document.querySelector(s).outerHTML, infoSelector);

    await browser.close();

    return html;
};