const crypto = require("crypto");
const User = require("libs/mongo/schemas/user");

exports.authorization = async ctx => {
  if (ctx.user) ctx.error(403, "authorized.user");

  const { login, password } = ctx.request.body;

  if (!login || !/^[a-zA-Z _]+$/.test(login)) ctx.error("login not valid");
  if (!password || !/^[a-zA-Z0-9]+$/.test(password)) ctx.error("password not valid");

  const user = await User.findOne({ login });
  if (!user) ctx.error(404, "not found user");
  if (!user.checkPassword(password)) ctx.error(403, "not correct password");

  const token = crypto.randomBytes(10).toString("base64");
  user.token = token;
  await user.save();
  ctx.cookies.set("auth", `${user._id}::${token}`, { httpOnly: false });

  ctx.end("authorization successful");
};

exports.registration = async ctx => {
  if (ctx.user) ctx.error(403, "authorized.user");

  const { login, password } = ctx.request.body;

  if (!login || !/^[a-zA-Z _]+$/.test(login)) ctx.error("login not valid");
  if (!password || !/^[a-zA-Z0-9]+$/.test(password)) ctx.error("password not valid");

  const token = crypto.randomBytes(10).toString("base64");
  try {
    // issue in library: don't use try catch
    const user = await User.create({ login, password, token });
    ctx.cookies.set("auth", `${user._id}::${token}`, { httpOnly: false });
    ctx.end("registration successful");
  }
  catch (e) {
    ctx.error(400, "login is occupied");
  }
};

exports.logout = async ctx => {
  if (!ctx.user) ctx.error(401, "not.authorized.user");

  ctx.cookies.set("auth", "guest", { httpOnly: false });

  ctx.end("ok");
};
