const _ = require("lodash");
const mongoose = require("libs/mongo");

const CoefficientSchema = new mongoose.Schema({
  _id: false,
  name: String,
  coefficient: Number,
});

const MatchSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: "not unique",
    index: 1,
  },
  home: String,
  guest: String,
  league: {
    type: String,
    index: 1,
  },
  date: Number,
  score: String,
  coefficients: {
    0: [CoefficientSchema],
    1: [CoefficientSchema],
    2: [CoefficientSchema],
  },
}, {
  timestamps: true,
  versionKey: false,
  strict: false,
});

MatchSchema.methods.getData = function () {
  return _.pick(this, ["key", "home", "guest", "league", "date", "coefficients"]);
};

module.exports = mongoose.model("Match", MatchSchema);
