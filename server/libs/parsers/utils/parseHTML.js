const needle = require("needle");

module.exports = url => {
    return new Promise((resolve, reject) => {

        let config = {
            response_timeout: 30000,
        };

        needle.get(url, config, (err, res) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(res.body);
            }
        });

    });
};