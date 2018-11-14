const _ = require("lodash")

module.exports = {
  name: "Mixout",
  $mixouts:{
    $({_key, _val, cp}){
      let val = typeof _val == "string" ? _val : cp.name
      let target
      if(_key == 'global'){
        target = global
      } else {
        target = _.get(global, _key)
      }
      _.set(target, val, Mhr[cp.name])
    }
  }
}
