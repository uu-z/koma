const Mhr = require("menhera").default;
const config = require("./config");
const { utils } = require("./plugins/utils");

global.Mhr = Mhr;

Mhr.$use(utils.loadPlugins("./core"))
  .$use(utils.loadPlugins("./plugins"))
  .$use(utils.loadPlugins("./modules"))
  .$use({ config });
