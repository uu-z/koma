const Koa = require("koa");
const Router = require("koa-router");
const _ = require("lodash");
const requireDir = require("require-dir");
const Mhr = require("menhera").default;
const compose = require("koa-compose");
const { utils } = require("./plugins/utils");

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
  $validators: utils.injectObject("validators"),
  $controllers: utils.injectObject("controllers"),
  $routes: {
    $({ _key, _val }) {
      let fn;
      if (typeof _val == "string") {
        fn = _.get(Mhr, `controllers.${_val}`);
      } else if (typeof _val == "object") {
        const fns = _.chain(_val)
          .mapKeys((v, k) => `${k}.${v}`)
          .keys()
          .map(v => _.get(Mhr, v))
          .value();
        fn = compose(fns);
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
  _mount: utils.parseModule(modules, {
    queue: ["name", "controllers", "validators", "models", "services", "routes"]
  })
});

module.exports = Mhr;
