const moment = require("moment");

module.exports = date => {

    if(Number.isNaN(date)) {
        return true;
    }

    // time of starting match more than 10 days from now, exclude this match
    if(date > moment().add(10, "days").valueOf()) {
        return true;
    }

};