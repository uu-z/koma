const _ = require("lodash");
const requireDir = require("require-dir");
const Mhr = require("menhera").default;
const config = require("./config");

global.Mhr = Mhr;

const plugins = requireDir("./plugins");
const modules = requireDir("./modules");

Mhr.$use({ _mount: _.values(plugins) })
  .$use({ _mount: _.values(modules) })
  .$use({ config });
