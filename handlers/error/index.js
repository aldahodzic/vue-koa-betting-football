if(process.env.NODE_ENV !== "production") {
    require("trace");
    require("clarify");
}

const _ = require("lodash");

module.exports =  async (ctx, next) => {

    try{
        // End with error
        ctx.error = (status, message) => {
            let err = new Error(message);
            err.my = true;
            err.status = status;
            throw err;
        };
        // Successful finish
        ctx.end = message => ctx.body = message;
        await next()
    }
    catch(e) {

        if(e.my) {
            ctx.status = e.status;
            ctx.body = e.message;
            console.log("my error > ", e.message);
            return;
        }

        if(e.errors) {
            let errs = [];
            _.each(e.errors, v => errs.push(v.message));
            ctx.status = 400;
            ctx.body = errs;
            console.log("mongo error > ", e.message);
            return;
        }


        if(process.env.NODE_ENV !== "production") console.log("unhandled error > ", e || '');

        ctx.status = e.status || 500;
        ctx.body = e.message;
    }

};
