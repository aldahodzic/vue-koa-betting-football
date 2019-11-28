const send = require("koa-send");
const fs = require("fs");

exports.list = async ctx => {
  const files = fs.readdirSync("./server/libs/parsers/parsed-pages");
  ctx.body = `
    <div>
        ${files.map(file => `<a href="parsed-data/${file}">${file}</a>`).join("<br>")} 
    </div>
    `;
};

exports.file = async ctx => {
  const file = ctx.params.file;

  try {
    await send(ctx, file, { root: "./server/libs/parsers/parsed-pages" });
  }
  catch (e) {
    ctx.error(404, "File not found");
  }
};
