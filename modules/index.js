const Test = require("./test");

module.exports = {
  name: "Index",
  routes: {
    "get /": "test"
  },
  controllers: {
    test: Test.controllers.hello
  }
};
