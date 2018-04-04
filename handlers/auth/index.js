const User = require("libs/mongo/schemas/user");

module.exports = async (ctx, next) => {

    const setGuest = () => ctx.cookies.set("auth", "guest", {httpOnly: false});

    let handle = true;

    let authToken = ctx.cookies.get("auth");

    if(handle && authToken === "guest") {
        handle = false;
    }

    if(handle && !authToken) {
        setGuest();
        handle = false;
    }

    let user, userId, token;

    if(handle) {
        [userId, token] = authToken.split("::");
        user = await User.findById(userId);
    }

    if(handle && !user) {
        setGuest();
        handle = false;
    }

    if(handle && user.token !== token) {
        setGuest();
        handle = false;
    }

    if(handle) {
        ctx.user = user;
    }

    await next();

};
