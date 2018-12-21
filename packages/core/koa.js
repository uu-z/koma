const Mhr = require("menhera").default;
const Koa = require("koa");
const _ = require("lodash");
const { utils } = require("./utils");
const app = new Koa();

exports.app = app;
module.exports = {
  name: "App",
  $use: utils.injectArray("_use"),
  $methods: utils.injectMethods("methods"),
  metas: utils.injectObjectDeep("metas"),
  $start: {
    // lifecycle
    metas: utils.injectObjectDeep("metas"),
    load: utils.injectObjectArray("load"),
    config: {
      // ...utils.injectObject("config"),
      ...utils.injectObjectDeep("config"),
      ...utils.injectVariableDeep("config"),
      RUN() {
        const { plugins = [], modules = [] } = _.get(Mhr, "load", {});
        Mhr.$use(utils.load(plugins)).$use({ start: { plugins: true } });
        Mhr.$use(utils.load(modules)).$use({ start: { modules: true } });

        const { PORT } = Mhr.config;
        Mhr.$use({ start: { app } });
        const http = require("http");
        const server = http.createServer(app.callback());
        Mhr.$use({ start: { server } });
        server.listen(PORT);
        console.success(`server listening on port ${PORT}~~`);
      }
    },
    app() {
      const use = _.get(Mhr, "_use", []);
      use.forEach(val => {
        app.use(val);
      });
    },
    server() {}
  }
};
