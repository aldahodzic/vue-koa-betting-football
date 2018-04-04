const crypto = require('crypto');
const User = require("libs/mongo/schemas/user");

exports.login = async ctx => {

    let {login, password} = ctx.request.body;

    if(!login || !/^[a-zA-Z _]+$/.test(login)) ctx.error("login not valid");
    if(!password || ! /^[a-zA-Z0-9]+$/.test(password)) ctx.error("password not valid");

    let user = await User.findOne({login});
    if(user === null) ctx.error(404, "not found user");
    if(!user.checkPassword(password)) ctx.error(403, "not correct password");

    let token = crypto.randomBytes(10).toString("base64");
    user.token = token;
    await user.save();
    ctx.cookies.set("auth", `${user._id}::${token}`, {httpOnly: false});

    ctx.end("login successful");

};


exports.registration = async ctx => {

    let {login, password} = ctx.request.body;

    if(!login || !/^[a-zA-Z _]+$/.test(login)) ctx.error("login not valid");
    if(!password || ! /^[a-zA-Z0-9]+$/.test(password)) ctx.error("password not valid");

    let token = crypto.randomBytes(10).toString("base64");
    try {
        // issue in library: don't use try catch
        let user = await User.create({login, password, token});
        ctx.cookies.set("auth", `${user._id}::${token}`, {httpOnly: false});
        ctx.end("registration successful");
    }
    catch(e) {
        if(e.message === "not unique") ctx.error(400, "login is not unique");
    }


};
