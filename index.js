const Mhr = require("menhera").default;
const { utils } = require("./core/utils");

exports.utils = utils;
exports.koma = Mhr.$use(utils.load("./core")).$use({
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
    plugins: ["./plugins"]
  }
});
