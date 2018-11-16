const Koa = require("koa");
const { RouterUtils } = require("./router");

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
    app.listen(PORT);
    console.success(`Server listening on port ${PORT}...`);
  }
};
