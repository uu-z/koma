const Mhr = require("menhera").default;
const _ = require("lodash");
const IO = require("socket.io");
const { utils } = require("../packages/core/utils");


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
      const datas = _.get(Mhr, "io.on", {});
      const io = IO(server)
      io.on("connection", socket => {
        _.each(datas, (val, key) => {
          socket.on(key, data => {
            val({data, socket})
          });
        });
      })
      
      console.success("socket server start~~~");
      Mhr.$use({
        start: {
          io
        }
      });
    }
  }
};
