const Mhr = require("menhera").default;
const cache = require("koa-redis-cache");
const _ = require("lodash");

const { REDIS_CACHE } = _.get(Mhr, "config", {});

module.exports = {
  name: "RedisCache",
  $start: {
    app() {
      console.success("redis-cache start~~~");
    }
  },
  use: [cache(REDIS_CACHE)]
};
