const Mhr = require("menhera").default;
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const jwt = require("koa-jwt");
const _ = require("lodash");

const { JWT_SECRET } = _.get(Mhr, "config", {});

module.exports = {
  name: "Middlewares",
  use: [
    bodyParser(),
    cors({
      origin: "*"
    }),
    jwt({ secret: JWT_SECRET, passthrough: true }),
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
        console.error(err.message);
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
          message: err.message
        };
      }
    }
  ]
};
