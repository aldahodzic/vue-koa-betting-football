const _ = require("lodash");
const mongoose = require("libs/mongo");

const MatchSchema = new mongoose.Schema({
    key: {type: String, unique: "not unique", index: 1},
    home: String,
    guest: String,
    league: {type: String, index: 1},
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
    timestamps: true,
    versionKey: false,
    strict: false
});

MatchSchema.virtual("teams", function() {
    return `${this.home}-${this.guest}`;
});

MatchSchema.methods.getData = function() {
    return _.pick(this, ["key", "teams", "home", "guest", "league", "date", "coefficients"]);
};

module.exports = mongoose.model("Match", MatchSchema);
