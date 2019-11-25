module.exports = {
  root: true,
  env: {
    browser: true,
    "jest/globals": true,
  },

  parserOptions: {
      parser: "babel-eslint",
  },

  extends: [
    'standard',
    "plugin:vue/recommended"
  ],
  
  plugins: [
    'vue',
    "jest",
  ],
  
  rules: {
    indent: ["warn", 2],
    "comma-dangle": ["error", "always-multiline"],
    quotes: ["error", "double"],
    "max-len": ["error", 150],
    "consistent-return": "off",
    eqeqeq: "off",
    "no-alert": "off",
    "no-continue": "off",
    "import/extensions": "off",
    "spaced-comment": ["error", "always", { markers: ["/"] }],
    "no-underscore-dangle": "off",
    "no-return-assign": "off",
    semi: ["error", "always"],
    "brace-style": ["error", "stroustrup", { "allowSingleLine": true }],

    // temp
    "vue/return-in-computed-property": "off",
    "vue/require-default-prop": "off",

    "vue/max-attributes-per-line": ["error", {"singleline": 3}],
    "vue/no-v-html": "off",
    "vue/multiline-html-element-content-newline": ["error", {
      "allowEmptyLines": true,
    }],
    "vue/order-in-components": ["error", {
      "order": [
        "el",
        "name",
        "parent",
        "functional",
        ["delimiters", "comments"],
        ["components", "directives", "filters"],
        "extends",
        "mixins",
        "inheritAttrs",
        "model",
        ["props", "propsData"],
        "data",
        "computed",
        "methods",
        "watch",
        "LIFECYCLE_HOOKS",
        ["template", "render"],
        "renderError"
      ]
    }]

  },
  
}
