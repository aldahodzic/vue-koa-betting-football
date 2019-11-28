module.exports = async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "http://localhost:8080");
  await next();
};
