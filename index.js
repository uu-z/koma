const Mhr = require("menhera").default;
const { utils } = require("./core/utils");
const _ = require("lodash");
const path = require("path");
const { setting, config } = require("./config");

exports.config = config;
exports.koma = Mhr.$use({
  $mount: {
    $({ _val }) {
      let cps = Array.isArray(_val) ? _val : [_val];
      _.each(cps, component => {
        let cp = typeof component === "function" ? component({ _ }) : component;
        Mhr.$use(cp);
      });
    }
  }
})
  .$use(utils.load(path.resolve(__dirname, "./core")))
  .$use(setting);
