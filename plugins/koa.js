const Koa = require("koa");
const http = require("http");
const { RouterUtils } = require("./router");
const { ScoketUtils } = require("./socket");

const app = new Koa();

exports.app = app;
module.exports = {
  name: "App",
  $use: {
    $({ _val }) {
      app.use(_val);
    }
  },
  $config({ _val }) {
    const { PORT } = _val;
    Mhr.configs = _val;
    RouterUtils.InjectRoutes({ app });
    const server = http.createServer(app.callback());
    ScoketUtils.InjectSocket({ server });
    server.listen(PORT);
    console.success(`Server listening on port ${PORT}...`);
  }
};
