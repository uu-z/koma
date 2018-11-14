const Koa = require("koa");
const Router = require("koa-router");
const _ = require("lodash");
const requireDir = require("require-dir");
const Mhr = require("menhera").default;

global.Mhr = Mhr;

const app = new Koa();
const router = new Router();
const modules = requireDir("./modules");
const plugins = requireDir("./plugins");

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
    $({ _: mhr, _key, _val }) {
      let fn = _.get(global, _val);
      _.set(Mhr, `routes.${_key}`, _val)
      if (!fn) {
        console.warn(`${_key}: ${_val} not exists`);
        fn = () => {};
      }
      const [method, path] = _key.split(" ");
      router[method](path, fn);
    }
  },
  $config: {
    _({ _, _val }) {
      const { PORT } = _val;
      _.$use({
        use: [router.routes(), router.allowedMethods()]
      });
      app.listen(PORT);
      console.success(`Server listening on port ${PORT}...`);
    }
  }
});

_.each(plugins, (val, key) => {
  if (!val.name) {
    return console.warn(`${key} plugin: invalid name `);
  }
  Mhr.$use({
    _mount: {
      [key]: val
    }
  });
});

_.each(modules, (val, key) => {
  if (!val.name) {
    return console.warn(`${key} module: invalid name `);
  }
  Mhr.$use({
    _mount: {
      [key]: val
    }
  });
});

module.exports = Mhr;
