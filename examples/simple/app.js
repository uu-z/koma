const { koma } = require("../../index");

koma.$use({
  start: {
    load: {
      plugins: [],
      modules: ["./examples/simple/modules"]
    },
    config: {
      PORT: 8001,
      RUN: true
    }
  }
});
