const { utils } = require("./utils");
const _ = require("lodash");
const compose = require("koa-compose");

const Router = require("koa-router");
const router = new Router();

exports.router = router;
module.exports = {
  name: "Router",
  $routes: {
    $({ _key, _val }) {
      _val = typeof _val == "object" ? _val : { controllers: _val };
      _.set(Mhr, `routes.${_key}`, _val);
    }
  },
  $start: {
    app({ _val: app }) {
      this.RouterUtils.InjectRoutes({ app });
    }
  },
  RouterUtils: {
    InjectRoutes({ app }) {
      const routes = _.get(Mhr, "routes", {});
      _.each(routes, (val, key) => {
        let fn;
        if (typeof val == "string") {
          fn = _.get(Mhr, `controllers.${val}`);
        } else if (typeof val == "object") {
          const fns = _.chain(val)
            .mapKeys((v, k) => `${k}.${v}`)
            .keys()
            .map(v => _.get(Mhr, v))
            .value();
          fn = compose(fns);
        }
        if (!fn) {
          console.warn(`${key}: ${val} not exists`);
          fn = () => {};
        }
        const [method, path] = key.split(" ");
        router[method](path, fn);
        app.use(router.routes());
        app.use(router.allowedMethods());
      });
    }
  }
};
