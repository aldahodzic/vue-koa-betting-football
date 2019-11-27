const path = require("path");
const send = require("koa-send");
const fs = require("fs");

exports.list = async ctx => {

    let files = fs.readdirSync("./server/libs/parsers/parsed");
    ctx.body = `
    <div>
        ${files.map(file => `<a href="parsed-data/${file}">${file}</a>`).join("<br>")} 
    </div>
    `;
    return;


};

exports.file = async ctx => {

    let file = ctx.params.file;

    try {
        await send(ctx, file, {root: "./server/libs/parsers/parsed"});
    }
    catch(e) {
        ctx.error(404, "File not found");
    }

};
