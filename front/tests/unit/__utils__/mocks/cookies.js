import _ from "lodash";

let defaultCookies = {
    auth: "cookie: auth",
};

let cookies = _.cloneDeep(defaultCookies);

const Cookies =  {

    get(key) {
        let _cookies = _.cloneDeep(cookies);
        return _cookies[key];
    },

    set(key, value) {
        cookies[key] = value;
    },

    reset() {
        cookies = _.cloneDeep(defaultCookies);
    }

};

module.exports = Cookies;
export default Cookies