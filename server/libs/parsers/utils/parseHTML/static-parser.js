const config = require("config");

const needle = require("needle");
const axios = require("axios");

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
        if (res.body.length !== 0) resolve(res.body);
        else {
          axios
            .get(url)
            .then(r => resolve(r.data))
            .catch(reject);
        }
      }
    });
  });
};
