module.exports = {
  port: process.env.PORT || 3000,
  env: {
    production: process.env.NODE_ENV === "production" || false,
    development: process.env.NODE_ENV === "development" || false,
  },
  mongo: {
    connection: {
      uri: "mongodb://someuser:someuserpassword@ds121889.mlab.com:21889/fakebet?retryWrites=false",
      keepAlive: 1,
    },
  },

  parser: {
    writeParsedResources: true,

    timeout: {
      dynamic: {
        page: 180000,
        dom: 60000,
      },
      static: {
        page: 30000,
      },
    },

    block: {
      resources: [
        "image",
        "media",
        "font",
        "texttrack",
        "object",
        "beacon",
        "csp_report",
        "imageset",
        "stylesheet",
      ],
      sites: [
        "quantserve",
        "adzerk",
        "doubleclick",
        "adition",
        "exelator",
        "sharethrough",
        "cdn.api.twitter",
        "google-analytics",
        "googletagmanager",
        "google",
        "fontawesome",
        "facebook",
        "analytics",
        "optimizely",
        "clicktale",
        "mixpanel",
        "zedo",
        "clicksor",
        "tiqcdn",
        "yandex",
        "hotjar",
      ],
    },
  },
};
