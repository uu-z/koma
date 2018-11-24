const Mhr = require("menhera").default;
const cache = require("koa-redis-cache");
const _ = require("lodash");

const { REDIS_HOST, REDIS_PORT } = _.get(Mhr, "config", {});

module.exports = {
  name: "RedisCache",
  $start: {
    app() {
      console.success("redis-cache start~~~");
    }
  },
  use: [
    cache({
      redis: {
        host: REDIS_HOST,
        port: REDIS_PORT
      },
      onerror(err) {
        console.log(err);
      }
    })
  ]
};
