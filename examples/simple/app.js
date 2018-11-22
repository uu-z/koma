const { koma } = require("../../index");

koma.$use({
  load: {
    modules: ["./examples/simple/modules"]
  },
  start: {
    config: {
      PORT: 8001
    }
  }
});
