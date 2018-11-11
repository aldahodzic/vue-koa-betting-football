const mongoose = require("mongoose");
const config = require("config");

mongoose.Promise = Promise;
mongoose.set("debug", config.env.development);

// todo add mongoose-id

const beautifyUnique = require("mongoose-beautiful-unique-validation");
mongoose.plugin(beautifyUnique);

mongoose.connect(config.mongo.connection.uri, {
    keepAlive: config.mongo.connection.keepAlive
});

module.exports = mongoose;