const config = require("config");

const staticParser = require("./static-parser");
const dynamicParser = require("./dynamic-parser");

const fs = require("fs");
const path = require("path");

const moment = require("moment");

module.exports = async (url, strategy, { league, bookmaker, dataSelector = "body", waitSelector }) => {
  let html;

  if (strategy == "static") {
    html = await staticParser(url);
  }
  if (strategy == "dynamic") {
    html = await dynamicParser(url, { dataSelector, waitSelector });
  }

  if (config.parser.writeParsedResources) {
    const fileName = `file--${moment().format("DD-MM-HH-mm")}--${bookmaker}--${league}`;
    const filePath = path.join(__dirname, "../../parsed-pages", `${fileName}.html`);
    fs.writeFileSync(filePath, html, "utf-8");
  }

  return html;
};
