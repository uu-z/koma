const Mhr = require("menhera").default;
const { utils } = require("./utils");
const _ = require("lodash");
const compose = require("koa-compose");

const Router = require("koa-router");
const router = new Router();

exports.router = router;
module.exports = {
  name: "Router",
  $routes: utils.injectObject("routes"),
  $start: {
    app({ _val: app }) {
      Mhr.$use({
        start: {
          router: true
        }
      });
      this.RouterUtils.InjectRoutes({ app });
    }
  },
  RouterUtils: {
    InjectRoutes({ app }) {
      const routes = _.get(Mhr, "routes", {});
      Mhr.$use({ start: { routes } });
      _.each(routes, (val, key) => {
        let fn, fns;
        if (typeof val == "string") {
          fns = val.split("|").map(key => {
            const method = _.get(Mhr, `methods.${key}.fn`);
            if (!method) {
              throw new Error(`routes: method ${key} not exists`);
            }
            return method;
          });
          fn = compose(fns);
        } else if (typeof val == "function") {
          fn = val;
        }

        const [method, path] = key.split(" ");
        router[method](path, fn);
        app.use(router.routes());
        app.use(router.allowedMethods());
      });
    }
  }
};
