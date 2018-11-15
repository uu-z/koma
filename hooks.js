const Koa = require("koa");
const Router = require("koa-router");
const _ = require("lodash");
const requireDir = require("require-dir");
const Mhr = require("menhera").default;
const compose = require("koa-compose");
const validate = require("koa-joi-validate");

global.Mhr = Mhr;

const app = new Koa();
const router = new Router();

Mhr.$use({
  $use: {
    $({ _val }) {
      app.use(_val);
    }
  },
  $hooks: {
    $({ _val }) {
      if (typeof _val == "function") {
        _val();
      }
    }
  },
  $routes: {
    $({ _key, _val }) {
      let fn;
      if (typeof _val == "string") {
        fn = _.get(global, _val) || _.get(global.Mhr, _val);
      } else if (typeof _val == "object") {
        fn = compose(_.values(_val).map(target => _.get(global, target) || _.get(global.Mhr, target)));
      }
      _.set(Mhr, `routes.${_key}`, _val);
      if (!fn) {
        console.warn(`${_key}: ${_val} not exists`);
        fn = () => {};
      }
      const [method, path] = _key.split(" ");
      router[method](path, fn);
    }
  },
  $config({ _val }) {
    const { PORT } = _val;
    Mhr.configs = _val;
    Mhr.$use({
      use: [router.routes(), router.allowedMethods()]
    });
    app.listen(PORT);
    console.success(`Server listening on port ${PORT}...`);
  }
});

const PluginQueue1 = requireDir("./plugins");
Mhr.$use({
  _mount: _.values(PluginQueue1)
});

const modules = requireDir("./modules");
Mhr.$use({
  _mount: _.values(modules)
});

module.exports = Mhr;
