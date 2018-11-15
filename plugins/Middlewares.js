const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const jwt = require("koa-jwt");
const config = require("../config");

module.exports = {
  name: "Middlewares",
  use: [
    bodyParser(),
    cors({
      origin: "*"
    }),
    // passport.initialize(),
    jwt({ secret: config.JWT_SECRET, passthrough: true }),
    async (ctx, next) => {
      const start = new Date();
      await next();
      const ms = new Date() - start;
      console.info(`-> ${ctx.method} ${ctx.url} - ${ms}ms`);
    },
    async (ctx, next) => {
      return next().catch(err => {
        if (err.status === 401) {
          ctx.status = 401;
          ctx.body = {
            error: err.originalError ? err.originalError.message : err.message
          };
        } else {
          throw err;
        }
      });
    }
  ]
};
