const es = require("koa-elasticsearch");

module.exports = {
  name: "ElasticeSearch",
  $config:{
    _({_val}){
      const {ES_ENABLE} = _val
      if(!ES_ENABLE) return
      Mhr.$use({
        use:[es]
      })
    }
  }
}
