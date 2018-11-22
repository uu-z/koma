const _ = require("lodash");
const { utils } = require("./utils");
const Mhr = require("menhera").default;

module.exports = {
  name: "Plugin",
  $metas: utils.injectObjectDeep("metas"),
  $load: utils.injectObjectArray("load"),
  $start: {
    config({ _val }) {
      Mhr.config = _val;
      const { plugins = [], modules = [] } = Mhr.load;

      plugins.forEach(path => {
        Mhr.$use(utils.load(path));
      });
      Mhr.$use({
        loaded: { plugin: true }
      });
      modules.forEach(path => {
        Mhr.$use(utils.load(path));
      });
      Mhr.$use({
        loaded: { modules: true }
      });
    }
  }
};
