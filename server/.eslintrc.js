module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "standard"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        indent: ["warn", 2],
        "comma-dangle": ["error", "always-multiline"],
        quotes: ["error", "double"],
        "max-len": ["error", 150],
        eqeqeq: "off",
        "spaced-comment": ["error", "always", { markers: ["/"] }],
        "no-return-assign": "off",
        semi: ["error", "always"],
        "brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
        "no-return-await": "off"
    }
};