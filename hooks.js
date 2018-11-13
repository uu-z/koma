const Koa = require("koa");
const Router = require("koa-router");
const _ = require("lodash");
const requireDir = require("require-dir");
const Mhr = require("menhera").default;

const app = new Koa();
const router = new Router();
const modules = requireDir("./modules");

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
      const fn = _.get(mhr, _val);
      if (!fn) {
        throw Error(`${_val} not exists`);
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
      console.info(`Server listening on port ${PORT}...`);
    }
  }
});

_.each(modules, (val, key) => {
  Mhr.$use({
    _mount: {
      [key]: val
    }
  });
});

global.Mhr = Mhr;

module.exports = Mhr;
