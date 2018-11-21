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
        const fns = val.split("|").map(key => {
          const method = _.get(Mhr, `methods.${key}`);
          if (!method) {
            throw new Error(`routes: method ${key} not exists`);
          }
          return method;
        });
        fn = compose(fns);
        const [method, path] = key.split(" ");
        router[method](path, fn);
        app.use(router.routes());
        app.use(router.allowedMethods());
      });
    }
  }
};
