module.exports = {
    port: process.env.PORT || 3000,
    env: {
        production: process.env.NODE_ENV == "production" || false,
        development: process.env.NODE_ENV == "development" || false,
    },
    mongo: {
        connection: {
            uri: "mongodb://someuser:someuserpassword@ds121889.mlab.com:21889/fakebet",
            keepAlive: 1,
        },
    },
};