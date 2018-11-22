const Mhr = require("menhera").default;
const Koa = require("koa");
const http = require("http");
const app = new Koa();

exports.app = app;
module.exports = {
  name: "App",
  $use: {
    $({ _val }) {
      app.use(_val);
    }
  },
  $loaded: {
    modules() {
      const { PORT } = Mhr.config;
      Mhr.$use({ start: { app } });
      const server = http.createServer(app.callback());
      Mhr.$use({ start: { server } });
      server.listen(PORT);
      console.success(`Server listening on port ${PORT}...`);
    }
  }
};
