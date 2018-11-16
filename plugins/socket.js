const _ = require("lodash");
const IO = require("koa-socket.io");
const config = require("../config");
const IO_Client = require("socket.io-client");
const { utils } = require("./utils");

const io = new IO({
  namespace: "/"
});
const options = {};
let client; // just for testing

module.exports = {
  name: "Socket",
  $io: {
    on: utils.injectObject("io.on")
  },
  io: {
    on: {
      async connect(ctx) {
        console.info("server: ", ctx);
      }
    }
  },
  ScoketUtils: {
    InjectSocket({ server }) {
      if (config.SOCKET_IO_ENABLE) {
        io.start(server);
        const datas = _.get(Mhr, "io.on", {});
        _.each(datas, (val, key) => {
          io.on(key, val);
        });

        console.success("socket server start~~~");
      }
      if (config.SOCKET_IO_CLIENT_ENABLE) {
        this.ScoketUtils.ClientTest();
      }
    },
    ClientTest() {
      client = IO_Client(`http://localhost:${config.PORT}`);
      client.on("connect", () => {
        console.info("client:", "connected");
      });
    }
  }
};
