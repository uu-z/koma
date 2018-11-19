const Mhr = require("menhera").default;
const config = require("./config");
const { utils } = require("./plugins/utils");
const requireDir = require("require-dir");

global.Mhr = Mhr;

Mhr.$use(utils.load("./core"))
  .$use(utils.load("./plugins"))
  .$use(utils.load("./modules"))
  .$use({ start: { config } });
