const _ = require("lodash");
const requireDir = require("require-dir");
const Mhr = require("menhera").default;

global.Mhr = Mhr;

const PluginQueue1 = requireDir("./plugins");
Mhr.$use({
  _mount: _.values(PluginQueue1)
});

const modules = requireDir("./modules");
Mhr.$use({
  _mount: _.values(modules)
});

module.exports = Mhr;
