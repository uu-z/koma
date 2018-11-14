const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");

module.exports = {
  name: "Middlewares",
  use:[
    bodyParser(),
    cors({
      origin: "*"
    }),
    async (ctx, next) => {
      const start = new Date();
      await next();
      const ms = new Date() - start;
      console.info(`-> ${ctx.method} ${ctx.url} - ${ms}ms`);
    },
    async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        console.error(err);
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
          message: err.message
        };
      }
    }
  ]
}
