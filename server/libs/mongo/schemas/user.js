const crypto = require("crypto");
const mongoose = require("libs/mongo");

const UserSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: "login occupied",
    required: "login required",
  },
  passwordHash: String,
  passwordSalt: String,
  token: String,
}, {
  timestamps: false,
  versionKey: false,
  strict: false,
});

UserSchema.virtual("password").set(function (password) {
  this.passwordSalt = crypto.randomBytes(10).toString("base64");
  this.passwordHash = crypto.pbkdf2Sync(password, this.passwordSalt, 5, 20, "sha256").toString("base64");
});

UserSchema.methods.checkPassword = function (password) {
  const passwordHash = crypto.pbkdf2Sync(password, this.passwordSalt, 5, 20, "sha256").toString("base64");
  return passwordHash === this.passwordHash;
};

module.exports = mongoose.model("User", UserSchema);
