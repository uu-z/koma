const bodyParser = require("koa-bodyparser");
const cache = require("koa-redis-cache");
const cors = require("@koa/cors");
const _ = require("lodash");
const es = require("koa-elasticsearch");

const Mhr = require("./hooks");

const { PORT = 8001, REDIS_HOST, REDIS_PORT } = process.env;

Mhr.$use({
  use: [
    bodyParser(),
    cors({
      origin: "*"
    }),
    cache({
      redis: {
        host: REDIS_HOST,
        port: REDIS_PORT
      },
      onerror(err) {
        console.log(err);
      }
    }),
    // es(),
    async (ctx, next) => {
      const start = new Date();
      await next();
      const ms = new Date() - start;
      console.log(`-> ${ctx.method} ${ctx.url} - ${ms}ms`);
    },
    async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        console.log(err);
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
          message: err.message
        };
      }
    }
  ],
  config: {
    PORT
  }
});
