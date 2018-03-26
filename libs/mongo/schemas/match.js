const _ = require("lodash");
const mongoose = require("libs/mongo");

const MatchSchema = new mongoose.Schema({
    key: {type: String, unique: "not unique", index: 1},
    home: String,
    guest: String,
    league: String,
    date: Number,
    coefficients: {
        "0": [{
            name: String,
            coefficient: Number
        }],
        "1": [{
            name: String,
            coefficient: Number
        }],
        "2": [{
            name: String,
            coefficient: Number
        }],
    }
}, {
    timestamp: false,
    versionKey: false,
    strict: false
});

MatchSchema.virtual("teams", function() {
    return `${this.home}-${this.guest}`;
});

MatchSchema.methods.getData = function() {
    let {teams, home, guest, league, date, coefficients} = this;
    _.each(coefficients, (coefficientTypeData, coefficientType) => {
        _.each(coefficientTypeData, (bookie, index) => {
            let {name, coefficient} = coefficients[coefficientType][index];
            coefficients[coefficientType][index] = {name, coefficient};
        });
    });
    return {teams, home, guest, league, date, coefficients};
};

module.exports = mongoose.model("Match", MatchSchema);
