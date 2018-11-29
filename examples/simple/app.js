const { koma } = require("../../index");
const path = require("path");

koma.$use({
  start: {
    load: {
      plugins: [],
      modules: [path.join(__dirname, "./modules")]
    },
    config: {
      PORT: 8001,
      RUN: true
    }
  }
});
