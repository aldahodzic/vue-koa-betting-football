const _ = require("lodash");
const mongoose = require("libs/mongo");

const BetSlipSchema = new mongoose.Schema({
    bookie: {
        name: String,
        coefficient: Number,
    },
    date: Number,
    dateTmpl: String,
    guest: String,
    home: String,
    league: String,
    // todo rewrite prediction
    type: String,
    score: String
});

const BetSchema = new mongoose.Schema({
    rate: Number,
    userId: mongoose.Schema.Types.ObjectId,
    bets: [BetSlipSchema]
}, {
    timestamps: true,
    versionKey: false,
});

BetSchema.methods.getData = function() {
    let {rate, bets, _id, createdAt} = this;
    return {rate, bets, _id, createdAt};
};

module.exports = mongoose.model("Bet", BetSchema);
