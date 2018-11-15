const Test = require("./test");

module.exports = {
  name: "Index",
  routes: {
    "get /": "Index.controllers.test"
  },
  controllers: {
    test: Test.controllers.hello.bind(Test)
  }
};
