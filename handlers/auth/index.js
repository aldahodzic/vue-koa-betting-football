const User = require("libs/mongo/schemas/user");

module.exports = async (ctx, next) => {

    const setGuest = () => {
        ctx.cookies.set("auth", "guest", {httpOnly: false});
        return next();
    };

    try {
        let authToken = ctx.cookies.get("auth");

        if(authToken === "guest") return await next();
        if(!authToken) return await setGuest();

        let [userId, token] = authToken.split("::");
        let user = await User.findById(userId);
        if(!user) return await setGuest();
        if(user.token !== token) return await setGuest();
    }
    catch(e) {
        return await setGuest()
    }

    await next();

};
