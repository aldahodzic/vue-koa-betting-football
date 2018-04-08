const _ = require("lodash");
const mongoose = require("libs/mongo");

const BetSlipSchema = new mongoose.Schema({
    bookie: {name: String, coefficient: String},
    dateNum: Number,
    date: String,
    guest: String,
    home: String,
    league: String,
    type: String,
    score: String
});

const BetSchema = new mongoose.Schema({
    rate: Number,
    bets: [BetSlipSchema]
}, {
    timestamps: true,
    versionKey: false,
    strict: false
});

BetSchema.methods.getData = function() {
    let {rate, bets} = this;
    // todo del _id from bets
    return {rate, bets};
};

module.exports = mongoose.model("Bet", BetSchema);
