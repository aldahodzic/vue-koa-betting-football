const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.set('debug', process.env.NODE_ENV !== "production");

const beautifyUnique = require("mongoose-beautiful-unique-validation");
mongoose.plugin(beautifyUnique);

mongoose.connect("mongodb://someuser:someuserpassword@ds121889.mlab.com:21889/fakebet", {
    keepAlive: 1
});

module.exports = mongoose;

