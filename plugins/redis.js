const Mhr = require("menhera").default;
const Redis = require("ioredis");
const _ = require("lodash");

const { REDIS_HOST, REDIS_PORT } = _.get(Mhr, "config", {});
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT
});
exports.redis = redis;
module.exports = {
  name: "Redis",
  $start: {
    app() {
      console.success("redis start~~~");
    }
  },
  use: [
    async (ctx, next) => {
      ctx.redis = redis;
      await next();
    }
  ]
};
