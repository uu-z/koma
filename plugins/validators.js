const { utils } = require("./utils");

module.exports = {
  name: "Validator",
  $validators: utils.injectObject("validators")
};
