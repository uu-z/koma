const Mhr = require("menhera").default;
const _ = require("lodash");
const IO = require("koa-socket.io");
const { utils } = require("../core/utils");

const io = new IO({
  namespace: "/"
});

module.exports = {
  name: "Socket",
  $io: {
    on: utils.injectObject("io.on")
  },
  io: {
    on: {
      async connect(ctx) {
        console.info("socket-server: ", ctx);
      }
    }
  },
  $start: {
    server({ _val: server }) {
      this.ScoketUtils.InjectSocket({ server });
    }
  },
  ScoketUtils: {
    InjectSocket({ server }) {
      io.start(server);
      const datas = _.get(Mhr, "io.on", {});
      _.each(datas, (val, key) => {
        io.on(key, val);
      });

      console.success("socket server start~~~");
      Mhr.$use({
        start: {
          socketServer: io
        }
      });
    }
  }
};
