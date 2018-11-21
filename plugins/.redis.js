const cache = require("koa-redis-cache");

module.exports = {
  name: "Redis",

  $start: {
    config({ _val }) {
      const { REDIS_HOST, REDIS_PORT } = _val;
      console.success("redis cache start~~~");
      Mhr.$use({
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
      });
    }
  }
};
