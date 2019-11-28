const config = require("config");

const needle = require("needle");

module.exports = url => {
  return new Promise((resolve, reject) => {
    const needleConfig = {
      response_timeout: config.parser.timeout.static.page,
    };

    needle.get(url, needleConfig, (err, res) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(res.body);
      }
    });
  });
};
