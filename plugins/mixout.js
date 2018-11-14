const _ = require("lodash")

module.exports = {
  name: "Mixout",
  $mixouts:{
    $({_key, _val, cp}){
      if(_key == _val) {
        let val = _.get(global, _val) || _.get(global.Mhr, _val)
        _.set(global, _key,val)
        return
      }
      Reflect.defineProperty(global, _key, {
        get() {
          let val = _.get(global, _val) || _.get(global.Mhr, _val)
          return val
        }
      })
    }
  }
}
