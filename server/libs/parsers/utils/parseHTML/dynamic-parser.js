const config = require("config");

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const UserAgentPlugin = require("puppeteer-extra-plugin-anonymize-ua");

puppeteer.use(StealthPlugin());
puppeteer.use(UserAgentPlugin({ makeWindows: true }));

const browserPromise = puppeteer.launch({
  headless: config.env.production,
  args: [
    "--no-sandbox",
    "--lang=uk-UA,uk;q=0.9,ru;q=0.8,en-US;q=0.7,en;q=0.6",
    "--disable-webgl",
  ],
});

module.exports = async (url, { dataSelector, waitSelector }) => {
  const browser = await browserPromise;

  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", request => {
    const requestUrl = request._url.split("?")[0].split("#")[0];
    if (
      config.parser.block.resources.includes(request.resourceType()) ||
            config.parser.block.sites.some(resource => requestUrl.includes(resource))
    ) request.abort();
    else request.continue();
  });

  await page.goto(url, { timeout: config.parser.timeout.dynamic.page });

  await page.waitForSelector(dataSelector, { timeout: config.parser.timeout.dynamic.dom });

  if (waitSelector) await page.waitForSelector(waitSelector, { timeout: config.parser.timeout.dynamic.dom });

  const html = await page.evaluate(s => document.querySelector(s).outerHTML, dataSelector);

  await page.close();

  return html;
};
