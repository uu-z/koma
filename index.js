const Mhr = require("menhera").default;
const { utils } = require("./core/utils");
const path = require("path");
const { setting } = require("./config");

exports.utils = utils;
exports.koma = Mhr.$use(utils.load(path.resolve(__dirname, "./core"))).$use(setting);
