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
    "standard",
    "plugin:vue/recommended",
  ],

  plugins: [
    "vue",
    "jest",
  ],

  rules: {
    indent: ["warn", 2],
    "comma-dangle": ["error", "always-multiline"],
    quotes: ["error", "double"],
    "max-len": ["error", 150],
    "spaced-comment": ["error", "always", { markers: ["/"] }],
    semi: ["error", "always"],
    "brace-style": ["error", "stroustrup", { allowSingleLine: true }],

    "vue/max-attributes-per-line": ["error", { singleline: 3 }],
    "vue/no-v-html": "off",
    "vue/multiline-html-element-content-newline": ["error", {
      allowEmptyLines: true,
    }],
    "vue/order-in-components": ["error", {
      order: [
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
        "renderError",
      ],
    }],
  },
};
