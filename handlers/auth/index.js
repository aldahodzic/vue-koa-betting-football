const User = require("libs/mongo/schemas/user");

module.exports = async (ctx, next) => {

    let authToken = ctx.cookies.get("auth");

    const setGuest = () => {
        ctx.cookies.set("auth", "guest");
        return next();
    };

    if(ctx.path !== "/auth/login" && (!authToken || authToken === "guest")) return await setGuest();

    let user, [userId, token] = authToken.split("::");
    try {
        user = await User.findById(userId);
        if(user === null) return await setGuest();
    }
    catch(e) {
        return await setGuest()
    }


    if(user.token !== token) return await setGuest();

    await next();

};
