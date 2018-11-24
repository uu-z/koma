const Mhr = require("menhera").default;
const Redis = require("ioredis");

module.exports = {
  name: "Redis",
  $start: {
    config({ _val }) {
      const { REDIS_HOST, REDIS_PORT } = _val;
      console.success("redis start~~~");
      const redis = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT
      });
      Mhr.$use({
        use: [
          async (ctx, next) => {
            ctx.redis = redis;
            await next();
          }
        ]
      });
    }
  }
};
