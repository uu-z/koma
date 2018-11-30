const Mhr = require("menhera").default;
const _ = require("lodash");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const helmet = require("koa-helmet");
const { CORS, BODY_PARSER, HELMET } = _.get(Mhr, "config", {});

module.exports = {
  name: "Middlewares",
  use: [
    bodyParser(BODY_PARSER),
    cors(CORS),
    helmet(HELMET),
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
