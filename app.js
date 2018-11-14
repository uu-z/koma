const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");

const Mhr = require("./hooks");

const { PORT = 8001, ES_ENABLE=false, REDIS_ENABLE=false, MONGO_ENABLE = false, REDIS_HOST, REDIS_PORT, MONGO_URL = "localhost:27017", MONGO_DATABASE = "test"} = process.env;

Mhr.$use({
  use: [
    bodyParser(),
    cors({
      origin: "*"
    }),
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
    PORT,
    ES_ENABLE,
    REDIS_ENABLE,
    REDIS_HOST,
    REDIS_PORT,
    MONGO_ENABLE,
    MONGO_URL,
    MONGO_DATABASE,
  }
});
