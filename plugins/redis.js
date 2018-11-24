const Mhr = require("menhera").default;
const Redis = require("ioredis");
const _ = require("lodash");

const { REDIS_HOST, REDIS_PORT } = _.get(Mhr, "config", {});
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT
});

module.exports = {
  name: "Redis",
  $start: {
    plugins() {
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
