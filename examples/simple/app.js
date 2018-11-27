const { koma } = require("../../index");

koma.$use({
  start: {
    config: {
      PORT: 8001
    },
    load: {
      modules: ["./examples/simple/modules"]
    }
  }
});
