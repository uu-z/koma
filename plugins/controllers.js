const Mhr = require("menhera").default;
const { utils } = require("../core/utils");

module.exports = {
  name: "Controller",
  $controllers: utils.injectObject("methods")
};
