const Mhr = require("menhera").default;
const { utils } = require("./core/utils");
const path = require("path");
const config = require("./config");

exports.utils = utils;
exports.koma = Mhr.$use(utils.load(path.resolve(__dirname, "./core"))).$use({
  ...config,
  load: {
    plugins: [path.resolve(__dirname, "./plugins")]
  }
});
