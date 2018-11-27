const Mhr = require("menhera").default;
const Koa = require("koa");
const _ = require("lodash");
const { utils } = require("./utils");
const http = require("http");
const app = new Koa();

exports.app = app;
module.exports = {
  name: "App",
  $use: utils.injectArray("use"),
  $start: {
    // lifecycle
    config: utils.injectObject("config"),
    metas: utils.injectObjectDeep("metas"),
    load({ _val }) {
      const { plugins, modules } = _val;
      plugins &&
        Mhr.$use(utils.load(plugins)).$use({
          start: { plugins: true }
        });
      modules && Mhr.$use(utils.load(modules)).$use({ start: { modules: true } });
    },
    modules() {
      const { PORT } = Mhr.config;
      Mhr.$use({ start: { app } });
      const server = http.createServer(app.callback());
      Mhr.$use({ start: { server } });
      server.listen(PORT);
      console.success(`Server listening on port ${PORT}...`);
    },
    app() {
      const use = _.get(Mhr, "use", []);
      use.forEach(val => {
        app.use(val);
      });
    },
    server() {}
  }
};
