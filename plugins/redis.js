const cache = require("koa-redis-cache");

module.exports = {
  name: "Redis",
  $config:{
    _({_val}){
      const {REDIS_ENABLE, REDIS_HOST, REDIS_PORT} = _val
      if(!REDIS_ENABLE) return
      console.success("redis start~")
      Mhr.$use({
        use:[
          cache({
            redis: {
              host: REDIS_HOST,
              port: REDIS_PORT
            },
            onerror(err) {
              console.log(err);
            }
          }),
        ]
      })

    }
  }
}
