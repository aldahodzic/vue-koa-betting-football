const $ = require("cheerio");
const config = require("config");

class Logger {
  constructor (leagueName, bookmakerName) {
    this.globalTask = `[${bookmakerName}][${leagueName}]`;
    this.cnt = 1;
    this.begin = new Date();
  }

  end () {
    if (config.env.production) return;

    const end = Date.now();
    console.log(`${this.globalTask} finished in ${(end - this.begin) / 1000} seconds`);
    this.begin = end;
    console.log("------------------------");
  }

  log (taskName) {
    if (config.env.production) return;

    if (this.cnt == 1) {
      console.log("------------------------");
      console.log(`${this.globalTask} started`);
    }

    console.log(`${this.globalTask} ${this.cnt}. Task: "${taskName}" done`);
    this.cnt += 1;
  };

  fail (message, e = {}, element) {
    if (config.env.production) return;

    let elementText;
    if (element) {
      elementText = $(element).text() ? $(element).text() : "no element text";
      elementText = elementText.replace(/(\t|\n)+/g, " | ");
    }

    console.log("Error >>", {
      task: this.globalTask,
      cause: message,
      message: e.message,
      stack: e.stack ? e.stack.split(" at ").splice(1, 3) : null,
      elementText,
    });
  }
}

module.exports = Logger;
