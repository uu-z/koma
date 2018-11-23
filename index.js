const Mhr = require("menhera").default;
const { utils } = require("./core/utils");
const path = require("path");

exports.utils = utils;
exports.koma = Mhr.$use(utils.load(path.resolve(__dirname, "./core"))).$use({
  metas: {
    mongoose: {
      load: false
    },
    redis: {
      load: false
    },
    elasticsearch: {
      load: false
    },
    passport: {
      load: false
    },
    socket: {
      load: false
    },
    cli: {
      load: false
    },
    "socket.client": {
      load: false
    }
  },
  load: {
    plugins: [path.resolve(__dirname, "./plugins")]
  }
});
