const Mhr = require("menhera").default;
const { utils } = require("./packages/core/utils");
const _ = require("lodash");
const path = require("path");
const { setting } = require("./config");

exports.koma = Mhr.$use(utils.load(path.resolve(__dirname, "./packages/core"))).$use(setting);
