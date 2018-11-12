const moment = require("moment");

module.exports = date => {

    if(Number.isNaN(date)) {
        return true;
    }

    // time of starting match more than 20 days from now, exclude this match
    if(date > moment().add(20, "days").valueOf()) {
        return true;
    }

};