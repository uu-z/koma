const { utils } = require("./utils");

module.exports = {
  name: "Controller",
  $controllers: utils.injectObject("controllers")
};
