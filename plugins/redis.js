const Mhr = require("menhera").default;
const Redis = require("ioredis");
const _ = require("lodash");

const {
  REDIS: {
    options = {
      host: "localhost",
      port: 6379
    }
  }
} = _.get(Mhr, "config", {});

const redis = new Redis(options);

module.exports = {
  name: "Redis",
  redis,
  $start: {
    app() {
      console.success("redis start~~~");
    }
  }
  // use: [
  //   async (ctx, next) => {
  //     ctx.redis = redis;
  //     await next();
  //   }
  // ]
};
