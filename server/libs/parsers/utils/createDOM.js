const cheerio = require("cheerio");

module.exports = innerHTML => cheerio.load(innerHTML);